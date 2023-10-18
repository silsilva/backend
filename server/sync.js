"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("./models");
const db_1 = require("./models/db");
db_1.sequelize
    .sync({
    alter: true,
})
    .then((res) => {
    console.log(res);
});
const user = models_1.User.findByPk(1);
