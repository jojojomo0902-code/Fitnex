export type UserRole = "Member" | "Trainer" | "Admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  plan?: string;
  status?: string;
}

export interface GymClass {
  id: string;
  name: string;
  trainer: string;
  time: string;
  capacity: number;
  booked: number;
  category: string;
  image?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  stock: number;
  price: number;
  image?: string;
}
