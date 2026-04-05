export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  images: string[];
  tags: string[];
  featured: boolean;
  createdAt: string;
};

//Make these types more consistent
export type FeaturedProductData = {
  success: boolean;
  data: Product[];
};

export type ProductResponse = {
  success: boolean;
  data: Product;
};

export type ProductStock = {
  success: boolean;
  data: {
    productId: string;
    stock: number;
    inStock: boolean;
    lowStock: boolean;
  };
};
export type ActivePromoResponse = {
  success: boolean;
  data: {
    id: string;
    title: string;
    description: string;
    discountPercent: number;
    code: string;
    validFrom: string;
    validUntil: string;
    active: boolean;
  };
};

export type CartContentsResponse = {
  success: boolean;
  data: {
    token: string;
    items: Product[];
    totalItems: number;
    subtotal: number;
    currency: string;
    createdAt: string;
    updatedAt: string;
  };
};
