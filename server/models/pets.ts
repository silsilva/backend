import { Model, DataTypes } from "sequelize";
import { sequelize } from "./db";

export class Pet extends Model {}
Pet.init(
  {
    petName: DataTypes.STRING,
    pictureUrl: DataTypes.STRING,
    lat: DataTypes.FLOAT,
    lng: DataTypes.FLOAT,
    zone: DataTypes.STRING,
  },
  { sequelize, modelName: "pet" }
);
