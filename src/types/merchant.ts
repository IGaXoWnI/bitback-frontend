export interface Offer {
  id: number;
  title: string;
  description: string;
  originalPrice: string | number;
  discountedPrice: string | number;
  quantity: string | number;
  quantityReserved: number;
  image: string;
  pickup_time: string;
  expiresAt: string;
  status: string;
  rating: string;
  businessId: number;
  newImage?: File; 
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

export interface Reservation {
  id: number;
  user_id: number;
  box_id: number;
  status: string;
  created_at: string;
  updated_at: string;
  pickup_deadline: string | null;
  box: {
    id: number;
    title: string;
    description: string;
    original_price: string;
    discounted_price: string;
    image: string;
    quantity_available: number;
    quantity_reserved: number;
    pickup_time: string;
    rating: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    business_id: number;
  };
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
    address: string;
    status: string;
  };
}