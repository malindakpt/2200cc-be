import { Request, Response } from "express";
import { Op } from "sequelize";
import { config } from "../config";
import { RecordModel } from "../models/record.model";
import { UserModel } from "../models/user.model";
import { VehicleModel } from "../models/vehicle.model";
import { getUser } from "../util/helper";

export const createRecord = async (req: Request, res: Response) => {
  try {
    const Record = await RecordModel.create(req.body);
    return res.status(201).send(Record);
  } catch (e: any) {
    console.error(e);
    return res.status(500).send(e.message);
  }
};

export const readRecord = async (req: Request, res: Response) => {
  try {
    const foundRecord = await RecordModel.findByPk(req.params.id, {
      include: [VehicleModel, UserModel]
    });

    return res.status(201).send(foundRecord);
  } catch (e: any) {
    console.error(e);
    return res.status(500).send(e.message);
  }
};

export const readRecords = async (req: Request, res: Response) => {
  try {
    // TODO handle errors
    const { offset, limit, VehicleId, recordTypes } = req.query;
    const where = { 
      VehicleId,
      type: {
        [Op.or]: recordTypes === '' ? [] : recordTypes?.toString().split(',')
      }
     };

    const foundRecords = await RecordModel.findAll({
      where,
      order: [["date", "DESC"]],
      offset: Number(offset),
      limit: Number(limit),
      
    });
    return res.status(201).send(foundRecords);
  } catch (e: any) {
    console.error(e);
    return res.status(500).send(e.message);
  }
};

export const updateRecord = async (req: Request, res: Response) => {
  const { id } = req.body;
  try {
    const foundRecord = await RecordModel.findByPk(id)
    if (foundRecord) {
      const user = getUser(req);
      if(!user || user.id !== foundRecord.UserId){
        return res.status(403).send('Unauthorized');
      }

      foundRecord.changed('updatedAt', true);
      const updated = await foundRecord.update(req.body);
      return res.status(201).send(updated);
    } else {
      return res.status(404).send({});
    }
  } catch (e: any) {
    console.error(e);
    return res.status(500).send(e.message);
  }
};

export const deleteRecord = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const foundRecord = await RecordModel.findByPk(id);
    if (foundRecord) {
      const user = getUser(req);
      if(!user || user.id !== foundRecord.UserId){
        return res.status(403).send('Unauthorized');
      }
    }
    await RecordModel.destroy({
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

export const allRecords = async (req: Request, res: Response) => {
  try {
    const { offset, limit } = req.query;
    const user = getUser(req);
    if(user?.id !== config.adminUserId){
      return res.status(403).send('Unauthorized');
    }

    const foundUsers = await RecordModel.findAll({
      order: [["createdAt", "DESC"]],
      offset: Number(offset),
      limit: Number(limit),
    });

    return res.status(201).send(foundUsers);
  }
  catch (e: any) {
    console.error(e);
    return res.status(500).send(e.message);
  }
}

export const searchRecords = async (req: Request, res: Response) => {
  try {
    // TODO handle errors
    const { offset, limit, regNo, chassis, recordTypes } = req.query;

    const foundVehicles = await RecordModel.findAll({
      where: {
          [Op.or]: [
            {  '$Vehicle.regNo$': regNo },
            {  '$Vehicle.chassis$': chassis}
          ],
          type: {
            [Op.or]: recordTypes
          }
      },
      order: [["date", "DESC"]],
      offset: Number(offset),
      limit: Number(limit),
      include: [{
        model: VehicleModel,
        as: 'Vehicle'
      }],
    });
    return res.status(201).send(foundVehicles);
  } catch (e: any) {
    console.error(e);
    return res.status(500).send(e.message);
  }
};
