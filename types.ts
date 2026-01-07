
export const HalalStatus = {
  HALAL: 'HALAL',
  HARAM: 'HARAM',
  MUSHBOOH: 'MUSHBOOH'
} as const;

export type HalalStatus = typeof HalalStatus[keyof typeof HalalStatus];

export interface Product {
  id: string;
  name: string;
  brand: string;
  flavor?: string;
  status: HalalStatus;
  category: string;
  imageUrl: string;
  ingredients: string[];
  explanation: string;
  religiousReference?: string;
  isBoycotted?: boolean;
  boycottReason?: string;
}

export type Category = {
  id: string;
  name: string;
  icon: string;
};
