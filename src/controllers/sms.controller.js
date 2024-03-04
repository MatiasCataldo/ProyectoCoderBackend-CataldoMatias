import config from "../config/config.js";
import twilio from 'twilio';

const twilioClient = twilio(config.twilioAccountSID, config.twilioAuthToken);
const twilioSMSOptions = {
    body: "Esto es un mensaje SMS de prueba usando Twilio desde Coderhouse.",
    from: config.twilioSmsNumber,
    to: config.twilioToSmsNumber
}

export const sendSMS = async (req, res) => {
    try {
        console.log("Enviando SMS usando Twilio.");
        console.log(twilioClient);
        const result = await twilioClient.messages.create(twilioSMSOptions);
        res.send({ message: "Success!", payload: result });
        console.log("Mensaje SMS enviado usando Twilio.");
    } catch (error) {
        console.error("Hubo un problema enviando el SMS usando Twilio.");
        res.status(500).send({ error: error });
    }
}