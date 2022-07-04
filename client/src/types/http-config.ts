import { Promotion } from './promotion';

export interface httpConfig {
  url: string;
  method: string;
  // TODO: check axios type
  data?: string;
  onSuccess(data: Promotion[]): void;
}
