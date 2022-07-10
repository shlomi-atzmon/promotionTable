import { PromotionType } from '../Enums/promotion-type';
import PromotionAttrs from '../types/promotion-attrs';
import { Promotion } from '../models/Promotion';

export const generatePromotions = async () => {
  const start_date = new Date();
  const end_date = new Date(start_date.setMonth(start_date.getMonth() + 3));

  const totalDocuments = await Promotion.countDocuments().exec();

  // TODO: Switch to i < 10000
  const promotions: PromotionAttrs[] = [];
  for (let i = totalDocuments; i < totalDocuments + 100; i++) {
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
