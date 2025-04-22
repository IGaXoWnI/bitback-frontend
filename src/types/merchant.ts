export interface Offer {
  id: number;
  title: string;
  originalPrice: number;
  discountedPrice: number;
  quantity: number;
  expiresAt: string;
  status: 'Active' | 'Inactive' | 'Sold Out';
}

export interface Order {
  id: string;
  customer: string;
  item: string;
  date: string;
  pickupTime: string;
  status: 'Pending' | 'Ready' | 'Completed' | 'Cancelled';
  total: string;
}

export interface NewOfferForm {
  title: string;
  description: string;
  originalPrice: string;
  discountedPrice: string;
  quantity: string;
  is_active: boolean;
  image: File | null;
  pickup_time: string;
}