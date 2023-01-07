import { DB } from "../services/db.connection";
import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

export type Meta = InferAttributes<MetaModel>;

// order of InferAttributes & InferCreationAttributes is important.
export class MetaModel extends Model<
  InferAttributes<MetaModel>,
  InferCreationAttributes<MetaModel>
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

MetaModel.init(attributes, {
  // Other model options go here
  sequelize: DB.getInstance(), // We need to pass the connection instance
  modelName: "Meta", // We need to choose the model name
});
