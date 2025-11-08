
export interface Review {
  rating: number; // e.g., 4.5
  author: string;
  date: string;
  comment: string;
}

export interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  images: string[]; // Replaced imageUrl
  description: string; // This will be the short description
  detailedDescription: string;
  reviews: Review[];
  isOnSale?: boolean;
  originalPrice?: number;
}

export interface CartItem {
  productId: number;
  quantity: number;
}

export interface CustomerDetails {
  name: string;
  phone: string;
  address: string;
  paymentMethod: 'Efectivo' | 'Transferencia';
}

export interface BlogPost {
  id: number;
  title: string;
  category: 'Salud' | 'Limpieza' | 'Bienestar';
  imageUrl: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
}