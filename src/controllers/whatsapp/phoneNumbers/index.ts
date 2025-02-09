import { Request, Response, NextFunction } from "express";
import { ApiController } from "@controllers/ApiController";
import { WhatsappPhones } from "@models/index";
import { CreateSchema, UpdateSchema } from "./schema";
import { initializeWhatsapp } from "@services/whatsappService";
import { CustomError, NotFoundError } from "@helpers/errors";
import { successResponse } from "@helpers/response";
import QRCode from "qrcode";
import sharp from "sharp";
import { Jimp, JimpMime, BlendMode } from "jimp";
import WhatsappSessions from "@models/whatsapp/sessions";

class WhatsappPhonesController extends ApiController<WhatsappPhones> {
  protected model = WhatsappPhones;
  protected entity = "phoneNumbers";
  protected createSchema = CreateSchema;
  protected updateSchema = UpdateSchema;
  protected fieldsAssociations = {
    session: [
      "id",
      "phone_number_id",
      "session_name",
      "created_at",
      "updated_at",
      "phone_number_id"
    ]
  };

  public _createRecord = async (req: Request, res: Response, next: NextFunction) => {
    req.body.created_by = req.user.id;
    req.body.session_name = `session-${req.body.area_code}${req.body.phone_number}`;
    return this.createRecord(req, res, next);
  };

  protected generateQRCode = async (qrCode: string) => {
    try {
      const qrBuffer = await QRCode.toBuffer(qrCode, {
        errorCorrectionLevel: "H",
        width: 500,
        color: {
          dark: "#123033",
          light: "#FFFFFF"
        }
      });

      const qrImage = await Jimp.read(qrBuffer);
      const logoSize = qrImage.width / 4;
      const pngBuffer = await sharp("./src/assets/images/whatsapp.svg")
        .resize(200)
        .png()
        .toBuffer();
      const logo = await Jimp.read(pngBuffer);
      logo.resize({ w: logoSize, h: logoSize });

      const x = (qrImage.width - logoSize) / 2;
      const y = (qrImage.height - logoSize) / 2;

      qrImage.composite(logo, x, y, {
        mode: BlendMode.SRC_OVER,
        opacityDest: 1,
        opacitySource: 1
      });

      const qrBase64 = await qrImage.getBase64(JimpMime.png);
      return qrBase64;
    } catch (error) {
      console.error("Error generating QR code:", error);
      throw new Error("Failed to generate QR code");
    }
  };

  public activateWhatsapp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const phone = await this.model.findOne({ where: { id } });
      if (!phone) throw new NotFoundError("Phone number not found", "phoneNotFound");

      await initializeWhatsapp(
        phone.session_name,
        `${phone.area_code}1${phone.phone_number}`,
        async (err, response: any) => {
          if (err) throw new CustomError(err.message, 400, "initializeWhatsapp");
          if (response.status === "remote_session_saved") {
            const session = await WhatsappSessions.findOne({
              where: { session_name: `RemoteAuth-${phone.session_name}` }
            });
            console.log("session", session, `RemoteAuth-${phone.session_name}}`);

            session?.update({ phone_number_id: parseInt(id) });
          }
          if (res.headersSent) return;
          if (response.status === "authenticated") return successResponse(req, res, { response });
          // Get qrCode content from response object and convert in QRCode image in base64
          if (response.status === "qr") {
            const qrCode = await this.generateQRCode(response.qr);
            successResponse(req, res, { image: qrCode, text: response.qr });
          }
        }
      );
    } catch (error) {
      next(error);
    }
  };

  public deactivateWhatsapp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const phone = await this.model.findOne({ where: { id } });
      if (!phone) throw new CustomError("Phone number not found", 404, "deactivateWhatsapp");

      await initializeWhatsapp(phone.session_name, null, async (err, response: any) => {
        if (err) throw new CustomError(err.message, 400, "initializeWhatsapp");
        if (response.status === "qr")
          return next(new CustomError("Session not authenticated", 401, "initializeWhatsapp"));
        if (res.headersSent) return;

        successResponse(req, res, null, "api.whatsapp.deactivated");
      });
    } catch (error) {
      next(error);
    }
  };

  public sendMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const phone = await this.model.findOne({ where: { id } });
      if (!phone) throw new NotFoundError("Phone number not found", "phoneNotFound");

      if (!req.whatsapp?.[`RemoteAuth-${phone.session_name}`])
        throw new NotFoundError("Whatsapp session not found", "whatsappSessionNotFound");

      const client = req.whatsapp[`RemoteAuth-${phone.session_name}`];
      const { message, area_code, phone_number } = req.body;

      await client.sendMessage(`${area_code}1${phone_number}@c.us`, message);
      const response = {
        phone_number: `${area_code}1${phone_number}`,
        message,
        status: "sent"
      };
      successResponse(req, res, response, req.t("api.whatsapp.messageSent"));
    } catch (error) {
      next(error);
    }
  };
}

export default new WhatsappPhonesController();
