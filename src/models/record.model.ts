import { DB } from "services/db.connection";
import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

export type Record = InferAttributes<RecordModel>;

// order of InferAttributes & InferCreationAttributes is important.
export class RecordModel extends Model<
  InferAttributes<RecordModel>,
  InferCreationAttributes<RecordModel>
> {
  declare id: CreationOptional<number>;
  declare date: string;
  declare type: number;
  declare millage: number;
  declare desc: string;
  declare imageCount: number;
  declare createdAt?: Date;
  declare updatedAt?: Date;
}

export const attributes = {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  type: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  millage: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  desc: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  imageCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
};

RecordModel.init(attributes, {
  // Other model options go here
  sequelize: DB.getInstance(), // We need to pass the connection instance
  modelName: "Record", // We need to choose the model name
});
