import { Schema, model, Document, Model } from 'mongoose';
import PromotionAttrs from '../types/promotion-attrs';

// Describes the properties that a Promotion Model has
interface PromotionModel extends Model<PromotionDoc> {
  build(attrs: PromotionAttrs): PromotionDoc;
  massInsert(attrs: PromotionAttrs[]): PromotionDoc[];
}

// Describes the properties that a Promotion Document has
interface PromotionDoc extends Document {
  name: string;
  type: string;
  start_date: Date;
  end_date: Date;
  user_group: string;
}

const promotionSchema = new Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    user_group: { type: String, required: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.created_at;
        delete ret.updated_at;
      },
    },
  }
);

// Get TS involved in the process of create new promotion
// To create promotion call the Promotion.build() function
promotionSchema.statics.build = (attrs: PromotionAttrs) => {
  return new Promotion(attrs);
};

// Get TS involved in the process of insertMany promotions
// To insertMany promotions call the Promotion.massInsert() function
promotionSchema.statics.massInsert = (attrs: PromotionAttrs[]) => {
  return Promotion.insertMany(attrs);
};

const Promotion = model<PromotionDoc, PromotionModel>(
  'Promotion',
  promotionSchema
);

export { Promotion };
