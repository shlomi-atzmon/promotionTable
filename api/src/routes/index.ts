import { Router } from 'express';
import { paginate } from '../middlewares/paginate';
import { Promotion } from '../models/Promotion';
import promotionController from '../controllers/promotion-controller';

const router = Router();

router.get(
  '/promotions',
  paginate(Promotion),
  promotionController.getPromotions
);

router.post('/promotions/mock-data', promotionController.addMockData);
router.put('/promotions/:id', promotionController.updatePromotionByID);
router.delete('/promotions/:id', promotionController.deletePromotionByID);

export { router as promotionRouter };
