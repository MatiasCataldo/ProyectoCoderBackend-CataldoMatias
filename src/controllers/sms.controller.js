i/*mport config from "../config/config.js";
import twilio from 'twilio';

const twilioClient = twilio(config.twilioAccountSID, config.twilioAuthToken);
const twilioSMSOptions = {
    body: "Esto es un mensaje SMS de prueba usando Twilio desde Coderhouse.",
    from: process.env.twilioSmsNumber,
    to: process.env.twilioToSmsNumber
}

export const sendSMS = async (req, res) => {
    try {
        const result = await twilioClient.messages.create(twilioSMSOptions);
        res.send({ message: "Success!", payload: result });
    } catch (error) {
        console.error("Hubo un problema enviando el SMS usando Twilio.");
        res.status(500).send({ error: error });
    }
}*/