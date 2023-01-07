import { Request, Response } from "express";
import { config } from "../config";
import { BrandModel } from "../models/brand.model";
import { getUser } from "../util/helper";

export const createBrand = async (req: Request, res: Response) => {
  try {
    const brand = await BrandModel.create(req.body);
    return res.status(201).send(brand);
  } catch (e: any) {
    console.error(e);
    return res.status(500).send(e.message);
  }
};

export const readBrands = async (req: Request, res: Response) => {
  try {
    const { offset, limit } = req.query;
    const user = getUser(req);
    if(user?.id !== config.adminUserId){
      return res.status(403).send('Unauthorized');
    }

    let foundBrands;

    if(Number(limit) > 0 && !isNaN(Number(offset))) {
      foundBrands = await BrandModel.findAll({
        order: [["createdAt", "DESC"]],
        offset: Number(offset),
        limit: Number(limit),
      });
    } else {
      foundBrands = await BrandModel.findAll();
    }
    return res.status(201).send(foundBrands);
  } catch (e: any) {
    console.error(e);
    return res.status(500).send(e.message);
  }
};

export const updateBrand = async (req: Request, res: Response) => {
  const { id } = req.body;
  try {
    const foundBrand = await BrandModel.findByPk(id)
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