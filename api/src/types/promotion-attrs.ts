// Describes the properties that are requried to create a new Promotion
export default interface PromotionAttrs {
  name: string;
  type: string;
  start_date: Date;
  end_date: Date;
  user_group: string;
}
