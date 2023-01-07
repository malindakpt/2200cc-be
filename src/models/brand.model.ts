import { DB } from "../services/db.connection";
import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

export type Meta = InferAttributes<BrandModel>;

// order of InferAttributes & InferCreationAttributes is important.
export class BrandModel extends Model<
  InferAttributes<BrandModel>,
  InferCreationAttributes<BrandModel>
> {
  declare id: CreationOptional<number>;
  declare cat: number;
  declare label: string;

  declare createdAt?: Date;
  declare updatedAt?: Date;
}

export const attributes = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  cat: DataTypes.INTEGER,
  label: DataTypes.STRING,
 
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
};

BrandModel.init(attributes, {
  // Other model options go here
  sequelize: DB.getInstance(), // We need to pass the connection instance
  modelName: "Brands", // We need to choose the model name
});
