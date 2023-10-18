"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("./db");
class Auth extends sequelize_1.Model {
}
exports.Auth = Auth;
Auth.init({
    email: sequelize_1.DataTypes.STRING,
    password: sequelize_1.DataTypes.STRING,
    user_id: sequelize_1.DataTypes.INTEGER,
}, { sequelize: db_1.sequelize, modelName: "auth" });
