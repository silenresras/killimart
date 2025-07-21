export interface Product {
    _id: string;
    name: string;
    price: number;
    slug: string;
    images: string[];
    category: {
      _id: string;
      name: string;
      slug: string;
    } | string;
    isHotDeal: boolean;
  }
  