export interface Product {
  _id: string;
  name: string;
  price: number;
  slug: string;
  images: string[];
  description: string;
  stock: number;
  isHotDeal: boolean;
  category: {
    _id: string;
    name: string;
    slug: string;
  } | string;
}
