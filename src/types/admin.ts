export type AccountStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
export type UserRole = 'ADMIN' | 'USER';
export type PaymentStatus = 'Paid' | 'Unpaid';
export type ComplaintStatus = 'PENDING' | 'RESOLVED' | 'IN_PROGRESS';

export interface AdminUser {
  id: string; 
  name: string; 
  email: string;
  location: string;
  accountStatus: AccountStatus; 
  role: UserRole; 
  verificationCode: number;
  verificationExp: string; 
  complaints: Complaint[]; 
  payments: Payment[]; 
}

export interface Payment {
  id: string; 
  amount: number;
  date: string; 
  status: PaymentStatus; 
}

export interface Complaint {
  id: string; 
  title: string;
  description: string;
  status: ComplaintStatus; 
  date: string; 
  userId: string; 
}

export interface CollectionSchedule {
  id: string; 
  scheduleDate: string; 
}
