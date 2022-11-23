import { DB } from 'services/db.connection';
import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
export type User = InferAttributes<UserModel>;

// order of InferAttributes & InferCreationAttributes is important.
export class UserModel extends Model<InferAttributes<UserModel>, InferCreationAttributes<UserModel>>{
  declare id: CreationOptional<number>;
  declare identifier: string;
  declare name: string;
  declare email: string | null;
  declare phone: string | null;;
  declare password: string;
  declare refreshToken: string;
  declare country: string;
  declare createdAt?: Date
  declare updatedAt?: Date
}

export const attributes = {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  identifier: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false
  },
  refreshToken: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE
};
UserModel.init(attributes, { // Other model options go here
  sequelize: DB.getInstance(), // We need to pass the connection instance
  modelName: 'User' // We need to choose the model name
});

