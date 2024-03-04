import nodemailer from 'nodemailer';
import config from '../config/config.js';
import __dirname from '../utils.js'

// configuracion de transport
const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 465,
    auth: {
        user: config.gmailAccount,
        pass: config.gmailAppPassword
    }
})

// Verificamos conexion con gmail
transporter.verify(function (error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log('El servidor está listo para enviar mensajes');
    }
})

const mailOptions = {
    from: "Helanus Test - " + config.gmailAccount,
    to: 'matiascataldo923@gmail.com',
    subject: "Correo de prueba HELANUS!",
    html: `<div><h1> Esto es un test de correo con NodeMailer </h1></div>`,
    attachments: []
}

const mailOptionsWithAttachments = {
    from: "Helanus Test - " + config.gmailAccount,
    to: `${config.gmailAccount}`,
    subject: "Correo de prueba HELANUS!",
    html: `<div>
                <h1>Esto es un Test de envio de correos con Nodemailer!</h1>
                <p>Ahora usando imagenes: </p>
                <img src="cid:helanus"/>
            </div>`,
    attachments: [
        {
            filename: 'Helanus',
            path: __dirname + '/images/carrusel2.jpg',
            cid: 'helanus'
        }
    ]
}

export const sendEmail = (req, res, ticketData) => {
    try {
        const { code, purchase_datetime, amount, purchaser } = ticketData;

        const mailOptionsWithTicket = {
            ...mailOptions,
            html: `
                <div>
                    <h1>GRACIAS POR SU COMPRA!</h1>
                    <h2>Ticket generado</h2>
                    <p><strong>Código:</strong> ${code}</p>
                    <p><strong>Fecha de compra:</strong> ${purchase_datetime}</p>
                    <p><strong>Monto:</strong> ${amount}</p>
                    <p><strong>Comprador:</strong> ${purchaser}</p>
                </div>
            `
        };

        transporter.sendMail(mailOptionsWithTicket, (error, info) => {
            if (error) {
                console.log(error);
                res.status(400).send({ message: "Error", payload: error });
            }
            console.log('Correo electrónico enviado: %s', info.messageId);
            res.send({ message: "Éxito", payload: info });
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error, message: "No se pudo enviar el correo electrónico desde:" + config.gmailAccount });
    }
};

export const sendEmailWithAttachments = (req, res) => {
    try {
        let result = transporter.sendMail(mailOptionsWithAttachments, (error, info) => {
            if (error) {
                console.log(error);
                res.status(400).send({ message: "Error", payload: error });
            }
            console.log('Message sent: %s', info.messageId);
            res.send({ message: "Success", payload: info })
        })
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error, message: "No se pudo enviar el email desde:" + config.gmailAccount });
    }
}