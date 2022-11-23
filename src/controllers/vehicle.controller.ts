import { Request, Response } from "express";
import { UserModel } from "models/user.model";
import { VehicleModel } from "models/vehicle.model";
import { Op } from "sequelize";

export const createVehicle = async (req: Request, res: Response) => {
  try {
    const Vehicle = await VehicleModel.create(req.body);
    return res.status(201).send(Vehicle);
  } catch (e: any) {
    return res.status(500).send(e.message);
  }
};

export const readVehicle = async (req: Request, res: Response) => {
  try {
    const foundVehicles = await VehicleModel.findByPk(req.params.id);
    return res.status(201).send(foundVehicles);
  } catch (e: any) {
    return res.status(500).send(e.message);
  }
};

export const readVehicles = async (req: Request, res: Response) => {
  try {
    const foundVehicles = await VehicleModel.findAll({
      where: req.body,
      order: [["updatedAt", "DESC"]],
    });
    return res.status(201).send(foundVehicles);
  } catch (e: any) {
    return res.status(500).send(e.message);
  }
};

export const updateVehicle = async (req: Request, res: Response) => {
  const { id } = req.body;
  try {
    const foundVehicle = await VehicleModel.findOne({
      where: { id },
    });
    if (foundVehicle) {
      foundVehicle.changed("updatedAt", true);
      const updated = await foundVehicle.update(req.body);
      return res.status(201).send(updated);
    } else {
      return res.status(404).send({});
    }
  } catch (e: any) {
    return res.status(500).send(e.message);
  }
};

export const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await VehicleModel.destroy({
      where: {
        id,
      },
    });
    return res.status(201).send();
  } catch (e: any) {
    return res.status(500).send(e.message);
  }
};

export const searchVehicles = async (req: Request, res: Response) => {
  try {
    const where = req.body.key
      ? {
          [Op.or]: [
            {
              regNo: { [Op.like]: `%${req.body.key}%` },
            },
            {
              chassis: { [Op.like]: `%${req.body.key}%` },
            },
          ],
        }
      : {};
    const foundVehicles = await VehicleModel.findAll({
      where,
      order: [["updatedAt", "DESC"]],
      include: UserModel,
    });
    return res.status(201).send(foundVehicles);
  } catch (e: any) {
    return res.status(500).send(e.message);
  }
};
