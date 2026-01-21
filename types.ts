
export interface VehicleDetails {
  rcNumber: string;
  ownerName: string;
  model: string;
  engineNumber: string;
  chassisNumber: string;
  registrationDate: string;
  fitnessUpTo: string;
  insuranceExpiry: string;
  pucExpiry?: string;
  taxPaidUpTo?: string;
  hypothecation?: string;
  fuelType: string;
  vehicleClass: string;
}

export interface InsuranceDetails {
  policyNumber: string;
  provider: string;
  type: 'Third Party' | 'Comprehensive' | 'Own Damage';
  insuredValue: number;
  startDate: string;
  expiryDate: string;
  premiumAmount: number;
  status: 'Active' | 'Expiring' | 'Expired';
}

export interface LicenseDetails {
  dlNumber: string;
  name: string;
  dob: string;
  issueDate?: string;
  validityTransport: string;
  validityNonTransport: string;
  status: 'Active' | 'Expired' | 'Suspended';
  vehicleClasses?: string[];
}

export interface Challan {
  id: string;
  vehicleNumber: string;
  date: string;
  time: string;
  location: string;
  violationType: string;
  amount: number;
  status: 'Pending' | 'Paid' | 'Contested';
  evidenceUrl?: string;
  section?: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  image?: string;
}

export interface Appointment {
  id: string;
  serviceType: string;
  location: string;
  date: string;
  timeSlot: string;
  status: 'Confirmed' | 'Pending' | 'Rescheduled';
  reminders?: {
    sms: boolean;
    email: boolean;
  };
}

export enum ServiceType {
  DL_SERVICES = 'Licensing',
  RC_SERVICES = 'Vehicle Registration',
  CHALLAN = 'Enforcement',
  AI_CONSULTANT = 'AI Assistant',
  MOCK_TEST = 'Learner Test',
  APPOINTMENTS = 'Appointments',
  INSURANCE = 'Insurance'
}
