"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
exports.sequelize = new sequelize_1.Sequelize("postgres://vwqchnvs:fDjNya34v9uiWmIGzRaQPgtisI0DEalJ@silly.db.elephantsql.com/vwqchnvs");
// try {
//     await sequelize.authenticate();
//     console.log("Connection has been established successfully.");
//   } catch (error) {
//     console.error("unable to connect to the data base:", error);
//   }
