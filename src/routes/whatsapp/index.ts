import { Router } from "express";
import WhatsappPhonesController from "@controllers/whatsapp/phoneNumbers";

const router = Router();

router.get("/phone-numbers", WhatsappPhonesController.getAll);
router.get("/phone-numbers/trash", WhatsappPhonesController.deletedRecords);
router.post("/phone-numbers", WhatsappPhonesController._createRecord);
router.get("/phone-numbers/:id", WhatsappPhonesController.getById);
router.delete("/phone-numbers/:id", WhatsappPhonesController.deleteRecord);
router.post("/phone-numbers/:id/restore", WhatsappPhonesController.restoreRecord);

router.post("/phone-numbers/:id/activate", WhatsappPhonesController.activateWhatsapp);
router.post("/phone-numbers/:id/deactivate", WhatsappPhonesController.deactivateWhatsapp);
router.post("/phone-numbers/:id/messages/send", WhatsappPhonesController.sendMessage);

router.get(
  "/phone-numbers/:id/:associationName(session|user)",
  WhatsappPhonesController.getAssociation
);

export default router;
