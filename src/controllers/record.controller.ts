import { Request, Response } from "express";
import { config } from "../config";
import { RecordModel } from "../models/record.model";
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
    const foundRecords = await RecordModel.findByPk(req.params.id);
    return res.status(201).send(foundRecords);
  } catch (e: any) {
    console.error(e);
    return res.status(500).send(e.message);
  }
};

export const readRecords = async (req: Request, res: Response) => {
  try {
    // TODO handle errors
    const { offset, limit } = req.body;
    const where = { ...req.body };

    delete where.offset;
    delete where.limit;

    const foundRecords = await RecordModel.findAll({
      where,
      order: [["date", "DESC"]],
      offset,
      limit,
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
    const { offset, limit } = req.body;
    const user = getUser(req);
    if(user?.id !== config.adminUserId){
      return res.status(403).send('Unauthorized');
    }

    const foundUsers = await RecordModel.findAll({
      order: [["createdAt", "DESC"]],
      offset,
      limit,
    });

    return res.status(201).send(foundUsers);
  }
  catch (e: any) {
    console.error(e);
    return res.status(500).send(e.message);
  }
}
