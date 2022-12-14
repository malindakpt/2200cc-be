import { Request, Response } from "express";
import { UserModel } from "../models/user.model";
import { VehicleModel } from "../models/vehicle.model";
import { Op } from "sequelize";
import { getUser } from "../util/helper";
import { config } from "../config";
import { DB } from "../services/db.connection";

export const createVehicle = async (req: Request, res: Response) => {
  try {
    const Vehicle = await VehicleModel.create(req.body);
    return res.status(201).send(Vehicle);
  } catch (e: any) {
    console.error(e);
    return res.status(500).send(e.message);
  }
};

export const readVehicle = async (req: Request, res: Response) => {
  try {
    const foundVehicles = await VehicleModel.findByPk(req.params.id, {
      include: UserModel,
    });
    return res.status(201).send(foundVehicles);
  } catch (e: any) {
    console.error(e);
    return res.status(500).send(e.message);
  }
};

export const readVehicles = async (req: Request, res: Response) => {
  try {
    const { UserId } = req.query;

    const foundVehicles = await VehicleModel.findAll({
      where: { UserId: Number(UserId) },
      order: [["updatedAt", "DESC"]],
      include: UserModel,
    });
    return res.status(201).send(foundVehicles);
  } catch (e: any) {
    console.error(e);
    return res.status(500).send(e.message);
  }
};

export const readNewVehicleBrands = async (req: Request, res: Response) => {
  try {
    const foundVehicles = await VehicleModel.findAll({
      where: { brand: -1 },
      order: [["updatedAt", "DESC"]],
    });
    return res.status(201).send(foundVehicles);
  } catch (e: any) {
    console.error(e);
    return res.status(500).send(e.message);
  }
};

export const updateVehicle = async (req: Request, res: Response) => {
  const { id } = req.body;
  try {
    const foundVehicle = await VehicleModel.findByPk(id);
    if (foundVehicle) {
      const user = getUser(req);

      if (user?.id !== config.adminUserId && (!user || user.id !== foundVehicle.UserId)) {
        return res.status(403).send("Unauthorized");
      }

      foundVehicle.changed("updatedAt", true);
      const updated = await foundVehicle.update(req.body);
      return res.status(201).send(updated);
    } else {
      return res.status(404).send({});
    }
  } catch (e: any) {
    console.error(e);
    return res.status(500).send(e.message);
  }
};

export const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const foundVehicle = await VehicleModel.findByPk(id);
    if (foundVehicle) {
      const user = getUser(req);
      if (!user || user.id !== foundVehicle.UserId) {
        return res.status(403).send("Unauthorized");
      }
    }

    await VehicleModel.destroy({
      where: {
        id,
      },
    });
    return res.status(201).send();
  } catch (e: any) {
    console.error(e);
    return res.status(500).send(e.message);
  }
};

export const searchVehicles2 = async (req: Request, res: Response) => {
  try {
    // TODO handle errors
    const { offset, limit } = req.body;
    // const where = { ...req.body };
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
      offset,
      limit,
      include: UserModel,
    });
    return res.status(201).send(foundVehicles);
  } catch (e: any) {
    console.error(e);
    return res.status(500).send(e.message);
  }
};

export const searchVehicles = async (req: Request, res: Response) => {
  try {
    // TODO handle errors
    const { offset, limit, key } = req.query;

    const query = `
    SELECT * FROM (select * from public."Vehicles" where "regNo" like '%${key}%' or "chassis" like '%${key}%') V
    LEFT JOIN 
    (SELECT "VehicleId", count("VehicleId") recordCnt from public."Records" group by "VehicleId") R
    ON V."id" = R."VehicleId"
    LEFT JOIN
    (SELECT "name" ownerName, id UserId from public."Users") U 
    ON V."UserId" = U.UserId
    ORDER BY "createdAt" DESC
    offset ${offset}
    limit ${limit}
    `;

    const [results, metadata] = await DB.getInstance().query(query);

    return res.status(201).send(results);
  } catch (e: any) {
    console.error(e);
    return res.status(500).send(e.message);
  }
};

export const allVehicles = async (req: Request, res: Response) => {
  try {
    const { offset, limit } = req.query;
    const user = getUser(req);
    if (user?.id !== config.adminUserId) {
      return res.status(403).send("Unauthorized");
    }

    const foundUsers = await VehicleModel.findAll({
      order: [["createdAt", "DESC"]],
      offset: Number(offset),
      limit: Number(limit),
    });

    return res.status(201).send(foundUsers);
  } catch (e: any) {
    console.error(e);
    return res.status(500).send(e.message);
  }
};
