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
export type ProuctResponse = {
  success: boolean;
  data: Product[];
  meta: {
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
};

export type ProductResponse = {
  success: boolean;
  data?: Product;
  error?: {
    code: string;
    message: string;
    details: string | null;
  };
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
  data?: {
    token: string;
    items: CartItem[];
    totalItems: number;
    subtotal: number;
    currency: string;
    createdAt: string;
    updatedAt: string;
  };
  error?: {
    code: string;
    message: string;
    details: null;
  };
};

export type CartItem = {
  productId: string;
  quantity: number;
  addedAt: string;
  product: Product;
  lineTotal: number;
  stock?: number;
};

export type SearchParams = {
  page?: number;
  search?: string;
  category?: string;
  limit?: number;
};

export type Category = {
  slug: string;
  name: string;
  productCount: number;
};

export type CategoryResponse = {
  success: boolean;
  data: Category[];
};

export type PaginationLinkProps = {
  className?: string;
  isActive?: boolean;
  href?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};
