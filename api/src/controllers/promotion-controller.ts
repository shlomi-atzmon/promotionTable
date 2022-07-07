import { Request, Response } from 'express';
import { Promotion } from '../models/Promotion';
import { NotFoundError } from '../errors/not-found-error';
import PromotionAttrs from '../types/promotion-attrs';
import { PromotionType } from '../Enums/promotion-type';

// TODO: Fix error handling with try catch and next function

// Get all promotions
const getPromotions = async (req: Request, res: Response) => {
  res.send(res.paginatedResults);
};

// Add 10,000 rows of data
const addMockPromotions = async (req: Request, res: Response) => {
  const response = await Promotion.massInsert(await createPromotions());
  return res.status(201).send();
};

const createPromotions = async () => {
  const start_date = new Date();
  const end_date = new Date(start_date.setMonth(start_date.getMonth() + 3));

  const totalDocuments = await Promotion.countDocuments().exec();

  // TODO: Switch to i < 10000
  const promotions: PromotionAttrs[] = [];
  for (let i = totalDocuments; i < totalDocuments + 20; i++) {
    const keys = Object.keys(PromotionType);
    promotions.push({
      name: `New promotion ${i + 1}`,
      type: keys[Math.floor(Math.random() * keys.length)],
      start_date,
      end_date,
      user_group: `group ${i + 1}`,
    });
  }

  return promotions;
};

// Update by ID
const updatePromotionByID = async (req: Request, res: Response) => {
  const promotion = await Promotion.findById(req.params.id);

  if (!promotion) {
    throw new NotFoundError('promotion');
  }

  const updatePromotion: PromotionAttrs = req.body;

  promotion.set(updatePromotion);
  await promotion.save();

  res.send(promotion);
};

// Delete by ID
const deletePromotionByID = async (req: Request, res: Response) => {
  const result = await Promotion.deleteOne({ _id: req.params.id });

  if (!result.deletedCount) {
    throw new NotFoundError('promotion');
  }

  return res.status(204).send();
};

// Duplicate
const duplicatePromotionByID = async (req: Request, res: Response) => {
  const promotion = await Promotion.findById(req.params.id);

  if (!promotion) {
    throw new NotFoundError('promotion');
  }

  const newPromotion = Promotion.build({
    name: promotion.name,
    type: promotion.type,
    start_date: promotion.start_date,
    end_date: promotion.end_date,
    user_group: promotion.user_group,
  });

  await newPromotion.save();

  return res.status(200).send(newPromotion);
};

export default {
  getPromotions,
  addMockPromotions,
  updatePromotionByID,
  deletePromotionByID,
  duplicatePromotionByID,
};
