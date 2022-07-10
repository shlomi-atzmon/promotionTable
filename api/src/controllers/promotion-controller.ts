import { Request, Response } from 'express';
import { BadRequestError } from '../errors/bad-request-error';
import PromotionAttrs from '../types/promotion-attrs';
import { Promotion } from '../models/Promotion';
import { generatePromotions } from '../utils/mock-generator';

// Get all promotions
const getPromotions = async (req: Request, res: Response) => {
  res.send(res.paginatedResults);
};

// Generate 10,000 rows of data
const addMockPromotions = async (req: Request, res: Response) => {
  const response = await Promotion.massInsert(await generatePromotions());
  return res.status(201).send();
};

// Update
const updatePromotionByID = async (req: Request, res: Response) => {
  const promotion = await Promotion.findById(req.params.id);

  if (!promotion) {
    throw new BadRequestError('Invalid request');
  }

  const updatePromotion: PromotionAttrs = req.body;

  promotion.set(updatePromotion);
  await promotion.save();

  res.send(promotion);
};

// Delete
const deletePromotionByID = async (req: Request, res: Response) => {
  const result = await Promotion.deleteOne({ _id: req.params.id });

  if (!result.deletedCount) {
    throw new BadRequestError('Invalid request');
  }

  return res.status(204).send();
};

// Duplicate
const duplicatePromotionByID = async (req: Request, res: Response) => {
  const promotion = await Promotion.findById(req.params.id);

  if (!promotion) {
    throw new BadRequestError('Invalid request');
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
