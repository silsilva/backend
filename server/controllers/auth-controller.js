"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getToken = exports.updatePassword = exports.checkUser = exports.getUser = exports.newAuth = exports.authToken = exports.newUser = void 0;
const models_1 = require("../models");
const auth_1 = require("../models/auth");
const crypto = require("crypto");
const jtw = require("jsonwebtoken");
const SECRET = process.env.SECRET;
function getSHA256ofString(text) {
    return crypto.createHash("sha256").update(text).digest("hex");
}
//APROBADOS
async function newUser(name, email) {
    const [user, created] = await models_1.User.findOrCreate({
        where: {
            email: email,
        },
        defaults: {
            name: name,
            email: email,
        },
    });
    return {
        user,
        created,
    };
}
exports.newUser = newUser;
async function authToken(email, password) {
    const res = await auth_1.Auth.findOne({
        where: { email: email, password: password },
    });
    return res;
}
exports.authToken = authToken;
async function newAuth(userId, email, password) {
    const [auth, authCreated] = await auth_1.Auth.findOrCreate({
        where: { user_id: userId },
        defaults: {
            email: email,
            password: password,
            user_id: userId,
        },
    });
    return {
        auth,
        authCreated,
    };
}
exports.newAuth = newAuth;
async function getUser(userId) {
    const user = await models_1.User.findByPk(userId);
    return user;
}
exports.getUser = getUser;
//SIN REVISAR
async function checkUser(email) {
    const user = await models_1.User.findOne({
        where: {
            email: email,
        },
    });
    if (user) {
        return true;
    }
    else {
        return false;
    }
}
exports.checkUser = checkUser;
async function updatePassword(userId, password) {
    const auth = await auth_1.Auth.findByPk(userId);
    await auth.update({ password });
    return auth;
}
exports.updatePassword = updatePassword;
async function getToken(UserData) {
    const auth = await auth_1.Auth.findOne({
        where: {
            email: UserData.email,
            password: getSHA256ofString(UserData.password),
        },
    });
    if (auth) {
        const token = jtw.sign({ id: auth.get("user_id") }, SECRET);
        return token;
    }
    else {
        return false;
    }
}
exports.getToken = getToken;
