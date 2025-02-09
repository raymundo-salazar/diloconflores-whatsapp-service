import { whatsappStore } from "@config/db";
import { RemoteAuth, Message } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import { Client } from "whatsapp-web.js";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import path from "path";
import WhatsappChatMessage from "@models/whatsapp/chats/messages";
import WhatsappChatMedia from "@models/whatsapp/chats/medias";
import {
  WhatsappPhones,
  WhatsappSessions,
  WhatsappChatSession,
  WhatsappChatUsers
} from "@models/index";
import { WhatsappChatMessageAttributes } from "@models/whatsapp/chats/messages/types";

// TODO: Create chatbot flow and steps to respond to user messages.
// TODO: Create a flow to send messages to users as campaigns or notifications.

export const initializeWhatsapp = (
  clientId: string,
  phone: string | null,
  callback: (error: any, response: object, client: Client) => Promise<any>,
  server: boolean = false
) => {
  let qrCodeGenerated = false;
  const sessionName = `RemoteAuth-${clientId}`;
  const client = new Client({
    puppeteer: { headless: false },
    authStrategy: new RemoteAuth({
      store: whatsappStore,
      backupSyncIntervalMs: 300000,
      clientId
    })
  });

  client.on("authenticated", async () => {
    callback(null, { status: "authenticated", info: client.info }, client);
  });

  client.on("auth_failure", (msg: any) => {
    console.error("AUTHENTICATION FAILURE", msg);
  });

  client.on("ready", async () => {
    if (phone === null) {
      await client.logout();
      return await client.destroy();
    }

    callback(null, { status: "ready", info: client.info }, client);
    if (!qrCodeGenerated) return;

    client.sendMessage(`${phone}@c.us`, "Welcome to Dilo con Flores Whatsapp service.").then(() => {
      client.sendMessage(
        `${phone}@c.us`,
        "Your session is authenticated. Waiting for remote session to be saved. Please do not close the session or the app. This may take a few minutes to complete. You will be notified once the session is ready."
      );
    });
  });

  client.on("message_create", async (message: Message) => {
    // TODO: Save message in database when is send by ME trhoug the API or app. Think in flow to this messages.
    console.log("message_create");
    try {
      if (qrCodeGenerated) return;
      if (message.author !== undefined) return false; // Prevent whatsapp group messages
      if (message.from !== "5218125421248@c.us") return; // Prevent messages from other numbers

      let sender: WhatsappChatMessageAttributes["sender"] = "user";
      if (message.fromMe) {
        sender = "self";
        if (message.body.toLowerCase().includes("bot")) sender = "bot";
        if (message.body.toLowerCase().includes("system")) sender = "system";
      }

      await saveMessage(message, sessionName, false, sender);
    } catch (error) {
      console.log(error);
    }
  });

  client.on("message_revoke_everyone", async (message: Message, revokedMessage: Message) => {
    console.log("message_revoke_everyone");
    removeMessage(revokedMessage.id.id);
  });

  client.on("message_revoke_me", async (revokedMessage: Message) => {
    console.log("message_revoke_me");
    removeMessage(revokedMessage.id.id, "REVOKE_BY_RECEIVER");
  });

  client.on("message_edit", async (message: Message) => {
    console.log("message_edit", message);
    saveMessage(message, sessionName, true);
  });

  client.on("remote_session_saved", () => {
    callback(null, { status: "remote_session_saved", clientId }, client);
    if (!qrCodeGenerated) return;

    client.sendMessage(
      `${phone}@c.us`,
      "Your session was saved successfully. You can now start using the Whatsapp service."
    );
    qrCodeGenerated = false;
  });

  client.on("qr", (qr: any) => {
    callback(null, { status: "qr", qr }, client);
    qrCodeGenerated = true;
    // Generate QR code image to terminal
    qrcode.generate(qr, { small: true });
  });

  client.on("disconnected", (reason: any) => {
    console.log("Client was logged out", reason);
    callback(null, { status: "disconnected", reason }, client);

    if (server) {
      console.log(">>> trying to create whatsapp session again...");
      client.initialize();
    }
  });

  client.initialize().then(() => {
    console.log("Client initialized");
  });
};

const saveMessage = async (
  message: any,
  sessionName: string,
  edit: boolean = false,
  sender: WhatsappChatMessageAttributes["sender"] = "user"
) => {
  const wid = message.from;
  const name = message.rawData.notifyName;
  const device_type = message.deviceType;

  const whatsappSession = await WhatsappSessions.findOne({
    where: { session_name: sessionName },
    include: [
      {
        model: WhatsappPhones,
        as: "phone_number"
      }
    ]
  });
  if (whatsappSession === null) return console.warn("Whatsapp session not found");
  const phoneId = whatsappSession.phone_number?.id ?? 0;

  const count = await WhatsappChatUsers.count({ where: { wid } });
  if (count === 0) {
    await WhatsappChatUsers.create({
      wid,
      whatsapp_name: name,
      name: name,
      phone_number: message.from
    });
  }

  const user = await WhatsappChatUsers.findOne({ where: { wid } });
  if (!user) return console.log("User not found");
  const sessions = await WhatsappChatSession.count({
    where: {
      active: true,
      closed_at: null
    }
  });
  if (sessions === 0) {
    await WhatsappChatSession.create({
      user_id: user.id,
      active: true,
      device_type,
      to_id: phoneId
    });
  }

  const session = await WhatsappChatSession.findOne({
    where: {
      user_id: user.id,
      active: true,
      closed_at: null
    }
  });
  if (!session) return console.log("Not session found");

  const messageExists = await WhatsappChatMessage.findOne({ where: { message_id: message.id.id } });
  if (messageExists && edit === false) return console.log("Message already exists");

  let old_chat_id;

  if (messageExists) {
    removeMessage(messageExists.message_id, "REVOKE_BY_EDIT");
    old_chat_id = messageExists.id;
  }

  const _message = await WhatsappChatMessage.create({
    sender,
    message_id: message.id.id,
    session_id: session.id,
    user_id: user.id,
    message: message.body,
    type: message.type,
    has_media: message.hasMedia,
    forwarded: message.isForwarded,
    edited: edit,
    old_chat_id
  });

  console.log("Message saved");
  if (message.hasMedia) {
    saveMedia(message, _message.id);
  }
};

const saveMedia = async (message: any, message_id: number) => {
  try {
    const media = await message.downloadMedia();

    if (!existsSync(path.join(__dirname, "../../downloads")))
      mkdirSync(path.join(__dirname, "../../downloads"), { recursive: true });

    const filePath = path.join(
      __dirname,
      `../../downloads/${message.id.id}.${media.mimetype.split("/")[1]}`
    );
    writeFileSync(filePath, media.data, "base64");

    return WhatsappChatMedia.create({
      message_id,
      bucket_name: "local",
      object_name: filePath,
      media_type: message.type,
      mime_type: media.mimetype,
      size: message.rawData.size,
      caption: message.rawData.caption,
      extension: message.rawData.extension,
      width: message.rawData.width,
      height: message.rawData.height,
      is_view_once: message.rawData.isViewOnce
    });
  } catch (error) {
    console.log();
  }
};

const removeMessage = async (message_id: string, revoke_reason = "REVOKE_BY_USER") => {
  const message = await WhatsappChatMessage.findOne({ where: { message_id } });
  if (!message) return console.log("Message not found");

  message.update({ revoke_reason });
  const destroy = message.destroy();
  console.log("Message removed");
  return destroy;
};
