"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pet = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("./db");
class Pet extends sequelize_1.Model {
}
exports.Pet = Pet;
Pet.init({
    petName: sequelize_1.DataTypes.STRING,
    pictureUrl: sequelize_1.DataTypes.STRING,
    lat: sequelize_1.DataTypes.FLOAT,
    lng: sequelize_1.DataTypes.FLOAT,
    zone: sequelize_1.DataTypes.STRING,
}, { sequelize: db_1.sequelize, modelName: "pet" });
