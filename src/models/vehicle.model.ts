import { DB } from 'services/db.connection';
import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';

export type Vehicle = InferAttributes<VehicleModel>;

// order of InferAttributes & InferCreationAttributes is important.
export class VehicleModel extends Model<InferAttributes<VehicleModel>, InferCreationAttributes<VehicleModel>>{
  declare id: CreationOptional<number>;
  declare regNo: string;
  declare imageCount: number;
  declare createdAt?: Date;
  declare updatedAt?: Date;
  declare UserId?: number;
}

export const attributes = {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  regNo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  manufac: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  brand: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  chassis: {
    type: DataTypes.STRING,
    allowNull: true
  },
  type: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fuel: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  transmission: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  model: {
    type: DataTypes.STRING,
    allowNull: false
  },
  imageCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  UserId: DataTypes.INTEGER.UNSIGNED,
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE
};

VehicleModel.init(attributes, { // Other model options go here
  sequelize: DB.getInstance(), // We need to pass the connection instance
  modelName: 'Vehicle' // We need to choose the model name
});
