"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.msg = void 0;
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID);
async function msg(msg) {
    try {
        await sgMail.send(msg);
        return { response: "Informacion enviada al dueño de la mascota" };
    }
    catch (error) {
        console.error(error);
    }
}
exports.msg = msg;
