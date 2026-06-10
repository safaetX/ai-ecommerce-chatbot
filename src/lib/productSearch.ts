import Product from "@/models/Product";

export const PRODUCT_SIZES = ["S", "M", "L", "XL", "XXL"] as const;

export type ProductSize = (typeof PRODUCT_SIZES)[number];

export interface ProductSearchFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  keywords?: string[];
  color?: string;
  size?: string;
  inStock?: boolean;
  limit?: number;
}

export interface ProductSummary {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: Record<ProductSize, number>;
}

interface ProductSearchDocument {
  _id: { toString(): string };
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: Record<ProductSize, number>;
}

type ProductStockQuery = Partial<Record<`stock.${ProductSize}`, { $gt: number }>>;

type ProductSearchQuery = ProductStockQuery & {
  category?: string | RegExp;
  price?: { $gte?: number; $lte?: number };
  name?: RegExp;
  description?: RegExp;
  $and?: ProductSearchQuery[];
  $or?: ProductSearchQuery[];
};

const DEFAULT_LIMIT = 5;
const MAX_LIMIT = 5;

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeCategory(category?: string) {
  const normalized = category?.trim().toLowerCase();

  if (!normalized) {
    return undefined;
  }

  if (["tshirt", "tshirts", "t-shirt", "t-shirts", "shirt", "shirts"].includes(normalized)) {
    return "t-shirt";
  }

  if (["pant", "pants", "jean", "jeans", "trouser", "trousers"].includes(normalized)) {
    return "pants";
  }

  return normalized;
}

function normalizeSize(size?: string): ProductSize | undefined {
  const normalized = size?.trim().toUpperCase();

  if (!normalized) {
    return undefined;
  }

  return PRODUCT_SIZES.find((productSize) => productSize === normalized);
}

function normalizeLimit(limit?: number) {
  if (typeof limit !== "number" || !Number.isFinite(limit)) {
    return DEFAULT_LIMIT;
  }

  return Math.min(Math.max(Math.trunc(limit), 1), MAX_LIMIT);
}

function cleanSearchTerms(filters: ProductSearchFilters) {
  return [...(filters.keywords ?? []), filters.color]
    .filter((term): term is string => Boolean(term?.trim()))
    .map((term) => term.trim())
    .slice(0, 6);
}

export function buildProductSearchQuery(filters: ProductSearchFilters = {}): ProductSearchQuery {
  const conditions: ProductSearchQuery[] = [];
  const category = normalizeCategory(filters.category);
  const size = normalizeSize(filters.size);
  const searchTerms = cleanSearchTerms(filters);

  if (category) {
    conditions.push({ category });
  }

  const priceQuery: { $gte?: number; $lte?: number } = {};

  if (typeof filters.minPrice === "number") {
    priceQuery.$gte = filters.minPrice;
  }

  if (typeof filters.maxPrice === "number") {
    priceQuery.$lte = filters.maxPrice;
  }

  if (Object.keys(priceQuery).length > 0) {
    conditions.push({ price: priceQuery });
  }

  for (const term of searchTerms) {
    const regex = new RegExp(escapeRegex(term), "i");

    conditions.push({
      $or: [{ name: regex }, { description: regex }, { category: regex }],
    });
  }

  if (filters.inStock && size) {
    conditions.push({
      [`stock.${size}`]: { $gt: 0 },
    });
  } else if (filters.inStock) {
    conditions.push({
      $or: PRODUCT_SIZES.map((productSize) => ({
        [`stock.${productSize}`]: { $gt: 0 },
      })),
    });
  }

  if (conditions.length === 0) {
    return {};
  }

  if (conditions.length === 1) {
    return conditions[0];
  }

  return { $and: conditions };
}

export async function searchProducts(filters: ProductSearchFilters = {}) {
  const products = await Product.find(buildProductSearchQuery(filters))
    .select("_id name description price category image stock")
    .sort({ createdAt: -1 })
    .limit(normalizeLimit(filters.limit))
    .lean<ProductSearchDocument[]>();

  return products.map<ProductSummary>((product) => ({
    _id: product._id.toString(),
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category,
    image: product.image,
    stock: product.stock,
  }));
}
