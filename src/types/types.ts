import { ReactNode } from "react";

export interface Department {
  _id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  mfa: {
    enabled: boolean;
  };
  _id: string;
  name: string;
  email: string;
  role: string;
  department: string; // ID do departamento
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface AssignedUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  department: Department;
}

export interface Comment {
  loggedUserId: string;
  _id: string;
  content: string;
  attachments: string[];
  author: {
    avatarUrl: ReactNode;
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

export interface OrderService {
  _id: string;
  userId: string;
  priority: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  local: string; // Tipo do local, como string
  images: [];
  assignedUser: User;
  status: 'open' | 'in_progress' | 'completed' | 'closed';
  startTime: string;
  endTime: string;
  isRecurring: boolean;
  recurrencePattern: 'daily' | 'weekly' | 'monthly';
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface OrderFormValues {
  _id: string;
  userId: string;
  priority: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  local: string; // Tipo do local, como string
  images: [];
  assignedUser: User;
  status: 'open' | 'in_progress' | 'completed' | 'closed';
  startTime: string;
  endTime: string;
  isRecurring: boolean;
  recurrencePattern: 'daily' | 'weekly' | 'monthly';
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface OrderModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (values: any) => void;
  users: User[];
  departments: Department[];
  locations: Location[]; // Atualizado para refletir a interface Location
  loading: boolean;
  editingOrder: OrderService | null;
}


export interface Location {
  name: string;
  number: string; // Pode ser string para suportar números e letras como "31 A"
}
