import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
  "postgres://vwqchnvs:fDjNya34v9uiWmIGzRaQPgtisI0DEalJ@silly.db.elephantsql.com/vwqchnvs"
);

// try {
//     await sequelize.authenticate();
//     console.log("Connection has been established successfully.");
//   } catch (error) {
//     console.error("unable to connect to the data base:", error);
//   }
