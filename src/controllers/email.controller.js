import nodemailer from 'nodemailer';
import config from '../config/config.js';
import __dirname from '../utils.js';
import { generateUniqueCode } from "../utils.js";
import userModel from '../dao/models/user.model.js';
import bcrypt from "bcrypt";

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
        const { code, purchase_datetime, amount, purchaser, items } = ticketData;

        const mailOptionsWithTicket = {
            ...mailOptions,
            html: `
                <div>
                    <h1>GRACIAS POR SU COMPRA!</h1>
                    <h2>Ticket generado</h2>
                    <p><strong>Código:</strong> ${code}</p>
                    <p><strong>Comprador:</strong> ${purchaser}</p>
                    <p><strong>Fecha de compra:</strong> ${purchase_datetime}</p>
                    <p><strong>Monto:</strong> $${amount}</p>
                    <p><strong>Detalles de la compra:</strong></p>
                    <br>
                    <ul>
                        ${items.map( item => `
                            <li>
                                <p><strong>Producto:</strong> ${item.productName}</p>
                                <p><strong>Precio:</strong> $ ${item.productPrice}</p>
                                <p><strong>Cantidad:</strong> ${item.quantity}</p>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            `
        };

        transporter.sendMail(mailOptionsWithTicket, (error, info) => {
            if (error) {
                res.status(400).send({ message: "Error", payload: error });
            }
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
                res.status(400).send({ message: "Error", payload: error });
            }
            res.send({ message: "Success", payload: info })
        })
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error, message: "No se pudo enviar el email desde:" + config.gmailAccount });
    }
}

const tempDbMails = {}

const mailOptionsToReset = {
    from: config.gmailAccount,
    //to: config.gmailAccount,
    subject: "Reset password",
}

export const sendEmailToResetPassword = (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).send('Email no especificado!')
        }

        const token = generateUniqueCode();
        const link = `http://localhost:8080/reset-password/${token}`

        tempDbMails[token] = {
            email,
            expirationTime: new Date(Date.now() + 60 * 60 * 1000)
        }

        mailOptionsToReset.to = email
        mailOptionsToReset.html = `Para reestablecer su contraseña, haga click en el siguiente enlace: <a href="${link}"> Reestablecer Contraseña</a> Si usted no fue quien solicito el cambio de contraseña puede ignorar el mensaje.`

        transporter.sendMail(mailOptionsToReset, (error, info) => {
            if (error) {
                res.status(500).send({ message: "Error", payload: error });
            }
            res.send({ message: "Success", payload: info })
        })
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error, message: "No se pudo enviar el email desde:" + config.gmailAccount });
    }
}


export const resetPassword = async (req, res) => {
    const token = req.params.token;
    const emailToReset = tempDbMails[token];
    const now = new Date();
    const expirationTime = emailToReset?.expirationTime

    if (now > expirationTime || !expirationTime) {
        delete tempDbMails[token]
        return res.redirect('/updatePassword')
    }

    const { newPassword } = req.body;
    try {
        const user = await userModel.findOne({ email: emailToReset.email });
        if (!user){
            return res.status(401).json({ status: 'error', error: "Usuario no encontrado" });
        } 

        const isSamePassword = bcrypt.compareSync(newPassword, user.password);
        if (isSamePassword) {
            return res.status(400).json({ status: 'error', error: "La nueva contraseña no puede ser igual a la actual" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        res.send({ message: "Contraseña modificada con exito!" })
    } catch (error) {
        console.error("Error al actualizar la contraseña2:", error);
        res.status(500).json({ status: 'error', error: "Error interno del servidor" });
    }
};

export const sendInactiveAccountEmail = (email) => {
    const mailOptions = {
        from: "Helanus Test - " + config.gmailAccount,
        to: email,
        subject: "Cuenta eliminada por inactividad",
        html: `<div><h1>Su cuenta ha sido eliminada por inactividad</h1>
                <p>Lamentamos informarle que su cuenta ha sido eliminada debido a la inactividad. Si desea volver a registrarse, por favor visite nuestro sitio web.</p></div>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error al enviar el correo electrónico:", error);
        } else {
            console.log("Correo electrónico enviado con éxito:", info.response);
        }
    });
};