export interface FragranceNotes {
  top: string[];
  middle: string[];
  base: string[];
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  discountPrice?: number;
  size: string[]; // e.g. ["50ml", "100ml"]
  selectedSize?: string;
  gender: "Men" | "Women" | "Unisex";
  rating: number;
  reviewsCount: number;
  images: string[];
  sku: string;
  barcode: string;
  stock: number;
  fragranceFamily: "Woody" | "Floral" | "Oriental" | "Citrus" | "Fresh" | "Gourmand";
  occasion: string[]; // e.g. ["Evening", "Date Night", "Daily Wear", "Summer", "Office"]
  notes: FragranceNotes;
  ingredients: string[];
  reviews: Review[];
  featured?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  country: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: "Pending" | "Awaiting Payment" | "Paid" | "Processing" | "Packed" | "Shipped" | "Delivered" | "Cancelled" | "Refunded";
  shippingAddress: Address;
  paymentMethod: "M-Pesa" | "Card" | "Cash on Delivery";
  mpesaDetails?: {
    phone: string;
    transactionId?: string;
    checkoutRequestId?: string;
    paymentStatus: "Pending" | "Completed" | "Failed";
  };
  trackingCode?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  date: string;
  category: string;
  tags: string[];
  likes: number;
}

export interface MarketingCampaign {
  id: string;
  title: string;
  description: string;
  code: string;
  discountValue: number;
  discountType: "percentage" | "fixed";
  startDate: string;
  endDate: string;
  status: "active" | "scheduled" | "expired";
}

export interface SalesData {
  date: string;
  sales: number;
  revenue: number;
  orders: number;
}
