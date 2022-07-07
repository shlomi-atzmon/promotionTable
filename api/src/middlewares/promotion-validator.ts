import { PromotionType } from '../Enums/promotion-type';
import { body } from 'express-validator';

export const promotionValidator = [
  body('name')
    .trim()
    .not()
    .isEmpty()
    .isLength({ min: 3, max: 30 })
    .withMessage('Name must be within 3 to 30 characters'),
  body('type')
    .trim()
    .isIn([PromotionType.Basic, PromotionType.Common, PromotionType.Epic])
    .withMessage('Invalid type'),
  body('start_date')
    .trim()
    .isISO8601()
    .toDate()
    .withMessage('Invalid start date'),
  body('end_date')
    .trim()
    .isISO8601()
    .toDate()
    .withMessage('Invalid end date')
    .custom((value, { req }) => {
      if (new Date(req.body.start_date) > new Date(value)) {
        throw new Error('Start date of project must be before End date');
      }
      return true;
    }),
  body('user_group')
    .trim()
    .not()
    .isEmpty()
    .isLength({ min: 2, max: 30 })
    .withMessage('User group must be within 3 to 30 characters'),
];
