export type AccountStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
export type UserRole = 'ADMIN' | 'USER';
export type PaymentStatus = 'PAID' | 'UNPAID';
export type ComplaintStatus = 'PENDING' | 'RESOLVED' | 'IN_PROGRESS';

export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  location: string;
  accountStatus: AccountStatus;
  role: UserRole;
  createdAt: string;
}

export interface Payment {
  id: string;
  userId: string;
  userEmail: string;
  amount: number;
  date: string;
  status: PaymentStatus;
}

export interface Complaint {
  id: string;
  userId: string;
  type: string;
  description: string;
  status: ComplaintStatus;
  createdAt: string;
}

export interface CollectionSchedule {
  id: string;
  location: string;
  date: string;
  time: string;
  type: string;
  notes?: string;
}