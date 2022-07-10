export interface Promotion {
  id: string;
  name: string;
  type: string;
  start_date: string;
  end_date: string;
  user_group: string;
}

export const PromotionHeaders = [
  'Promotion name',
  'Type',
  'Start Date',
  'End Date',
  'User Group Name',
];

export const PromotionTypes = ['Basic', 'Common', 'Epic'];
