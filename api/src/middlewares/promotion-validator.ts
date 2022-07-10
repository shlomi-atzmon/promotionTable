import { PromotionType } from '../Enums/promotion-type';
import { body } from 'express-validator';

export const promotionValidator = [
  body('name')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Name must be within 3 to 30 characters'),
  body('type')
    .trim()
    .isIn([PromotionType.Basic, PromotionType.Common, PromotionType.Epic])
    .withMessage('Invalid filed: Type'),
  body('start_date')
    .trim()
    .isISO8601()
    .toDate()
    .withMessage('Invalid filed: Start Date'),
  body('end_date')
    .trim()
    .isISO8601()
    .toDate()
    .withMessage('Invalid filed: End Date')
    .custom((value, { req }) => {
      if (new Date(req.body.start_date) > new Date(value)) {
        throw new Error('Project start date must be earlier than end date');
      }
      return true;
    }),
  body('user_group')
    .trim()
    .isLength({ min: 2, max: 30 })
    .withMessage('User group must be within 3 to 30 characters'),
];
