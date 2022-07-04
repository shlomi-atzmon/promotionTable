import { Request, Response } from 'express';
import { Promotion } from '../models/Promotion';
import PromotionAttrs from '../types/promotion-attrs';
import { PromotionType } from '../Enums/promotion-type';

// Get all promotions
const getPromotions = async (req: Request, res: Response) => {
  res.send(res.paginatedResults);
};

// Add 10,000 rows of data
const addMockData = async (req: Request, res: Response) => {
  const response = await Promotion.massInsert(await createPromotions());
  return res.status(201).send({ results: response });
};

const createPromotions = async () => {
  const start_date = new Date();
  const end_date = new Date(start_date.setMonth(start_date.getMonth() + 3));

  // TODO: consider a get req for paginated results and than push
  const totalDocuments = await Promotion.countDocuments().exec();

  // TODO: Add random PromotionType
  // TODO: Switch to i < 10000
  const promotions: PromotionAttrs[] = [];
  for (let i = totalDocuments; i < totalDocuments + 5; i++) {
    promotions.push({
      name: `New promotion ${i + 1}`,
      type: PromotionType.Epic,
      start_date,
      end_date,
      user_group: `group ${i + 1}`,
    });
  }

  return promotions;
};

// Edit by ID
const updatePromotionByID = async (req: Request, res: Response) => {
  const promotion = await Promotion.findById(req.params.id);

  // TODO: How to handle next error from controller
  if (!promotion) {
    // throw new NotFoundError('promotion');
  }

  const { name } = req.body;

  /* promotion.set({ name });
  await promotion.save(); */

  res.send({ promotion });
};

// Delete by ID
const deletePromotionByID = async (req: Request, res: Response) => {
  await Promotion.deleteOne({ _id: req.params.id });
  return res.status(204).send();
};

// Duplicate
export const duplicatePromotion = async (req: Request, res: Response) => {
  return res.status(200).send();
};

export default {
  getPromotions,
  addMockData,
  updatePromotionByID,
  deletePromotionByID,
  duplicatePromotion,
};
