import { BrandModel } from "./models/brand.model";
import { RecordModel } from "./models/record.model";
import { UserModel } from "./models/user.model";
import { VehicleModel } from "./models/vehicle.model";
import { startApplication } from "./services/app.service";

export const syncDatabase = async () => {
  try {
    VehicleModel.belongsTo(UserModel);
    VehicleModel.hasMany(RecordModel);
    UserModel.hasMany(VehicleModel);
    RecordModel.belongsTo(UserModel);
    RecordModel.belongsTo(VehicleModel);

    await UserModel.sync();
    await VehicleModel.sync();
    await RecordModel.sync();
    await BrandModel.sync();
    
    console.log(
      "------------- DB Connected -------------"
    );
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

syncDatabase();
startApplication();
