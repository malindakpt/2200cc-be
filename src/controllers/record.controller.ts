import { Request, Response } from "express";
import { RecordModel } from "models/record.model";

export const createRecord = async (req: Request, res: Response) => {
  try {
    const Record = await RecordModel.create(req.body);
    return res.status(201).send(Record);
  } catch (e: any) {
    return res.status(500).send(e.message);
  }
};

export const readRecord = async (req: Request, res: Response) => {
  try {
    const foundRecords = await RecordModel.findByPk(req.params.id);
    return res.status(201).send(foundRecords);
  } catch (e: any) {
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
    return res.status(500).send(e.message);
  }
};

export const updateRecord = async (req: Request, res: Response) => {
  const { id } = req.body;
  try {
    const foundRecord = await RecordModel.findOne({
      where: { id },
    });
    if (foundRecord) {
      foundRecord.changed('updatedAt', true);
      const updated = await foundRecord.update(req.body);
      return res.status(201).send(updated);
    } else {
      return res.status(404).send({});
    }
  } catch (e: any) {
    return res.status(500).send(e.message);
  }
};

export const deleteRecord = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await RecordModel.destroy({
      where: {
        id,
      },
    });
    return res.status(201).send();
  } catch (e: any) {
    return res.status(500).send(e.message);
  }
};
