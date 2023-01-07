import { Request, Response } from "express";
import { Op } from "sequelize";
import { config } from "../config";
import { MetaModel } from "../models/meta.model";
import { getUser } from "../util/helper";

export const createBrand = async (req: Request, res: Response) => {
  try {
    const brand = await MetaModel.create(req.body);
    return res.status(201).send(brand);
  } catch (e: any) {
    console.error(e);
    return res.status(500).send(e.message);
  }
};

export const readBrands = async (req: Request, res: Response) => {
  try {
    // const { offset, limit } = req.query;
    const user = getUser(req);
    if(user?.id !== config.adminUserId){
      return res.status(403).send('Unauthorized');
    }

    const foundBrands = await MetaModel.findAll({
      // order: [["createdAt", "DESC"]],
      // offset: Number(offset),
      // limit: Number(limit),
    });

    return res.status(201).send(foundBrands);
  } catch (e: any) {
    console.error(e);
    return res.status(500).send(e.message);
  }
};

export const updateBrand = async (req: Request, res: Response) => {
  const { id } = req.body;
  try {
    const foundBrand = await MetaModel.findByPk(id)
    if (foundBrand) {
      foundBrand.changed('updatedAt', true);
      const updated = await foundBrand.update(req.body);
      return res.status(201).send(updated);
    } else {
      return res.status(404).send({});
    }
  } catch (e: any) {
    console.error(e);
    return res.status(500).send(e.message);
  }
};

// TODO: think about deleting a brand