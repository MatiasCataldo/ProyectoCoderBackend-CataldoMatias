import { Router } from "express";
import { sendEmail, sendEmailWithAttachments, sendEmailToResetPassword, resetPassword } from '../controllers/email.controller.js';
import { updatePassword } from '../controllers/user.controller.js';

const router = Router();

router.get("/", sendEmail);

router.get("/attachments", sendEmailWithAttachments);

router.post("/send-email-to-reset", sendEmailToResetPassword);

router.post('/reset-password/:token', resetPassword)

export default router;