
import { QuizQuestion, VehicleDetails, LicenseDetails, Challan } from './types';

export const MOCK_CHALLANS: Challan[] = [
  {
    id: 'CH8829102',
    vehicleNumber: 'MH12AB1234',
    date: '2024-05-10',
    time: '14:25',
    location: 'Senapati Bapat Road, Pune',
    violationType: 'Over Speeding (72 km/h in 50 km/h zone)',
    amount: 2000,
    status: 'Pending',
    section: 'Sec 183(1) MV Act',
    evidenceUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'CH8829105',
    vehicleNumber: 'MH12AB1234',
    date: '2024-04-12',
    time: '09:15',
    location: 'University Circle, Pune',
    violationType: 'Red Light Signal Violation',
    amount: 500,
    status: 'Paid',
    section: 'Sec 119/177 MV Act',
    evidenceUrl: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'CH9001223',
    vehicleNumber: 'DL01CX9988',
    date: '2024-05-20',
    time: '23:10',
    location: 'Outer Ring Road, Delhi',
    violationType: 'Driving Without Seatbelt',
    amount: 1000,
    status: 'Pending',
    section: 'Sec 194B(1) MV Act'
  }
];

export const MOCK_VEHICLES: Record<string, VehicleDetails> = {
  'MH12AB1234': {
    rcNumber: 'MH12AB1234',
    ownerName: 'Rahul Sharma',
    model: 'Tata Nexon EV',
    engineNumber: 'NEX2023X991',
    chassisNumber: 'MAT123456NEX901',
    registrationDate: '2023-05-15',
    fitnessUpTo: '2038-05-14',
    insuranceExpiry: '2024-12-14',
    pucExpiry: '2024-11-20',
    taxPaidUpTo: '2038-05-14',
    hypothecation: 'HDFC Bank Ltd',
    fuelType: 'Electric',
    vehicleClass: 'LMV'
  },
  'DL01CX9988': {
    rcNumber: 'DL01CX9988',
    ownerName: 'Priya Verma',
    model: 'Honda City i-VTEC',
    engineNumber: 'HONDA991122',
    chassisNumber: 'CH11002233HON',
    registrationDate: '2019-10-20',
    fitnessUpTo: '2034-10-19',
    insuranceExpiry: '2024-05-14',
    pucExpiry: '2023-12-10',
    taxPaidUpTo: '2034-10-19',
    fuelType: 'Petrol',
    vehicleClass: 'LMV'
  }
};

export const MOCK_LICENSES: Record<string, LicenseDetails> = {
  'DL1420150012345': {
    dlNumber: 'DL1420150012345',
    name: 'Rahul Sharma',
    dob: '1992-08-12',
    validityTransport: '2028-08-11',
    validityNonTransport: '2032-08-11',
    status: 'Active'
  }
};

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "Near a pedestrian crossing, when the pedestrians are waiting to cross the road, you should:",
    options: ["Sound horn and proceed", "Slow down, sound horn and pass", "Stop the vehicle and wait till the pedestrians cross", "Pass with caution"],
    correctAnswer: 2
  },
  {
    id: 2,
    question: "You are approaching a narrow bridge, another vehicle is about to enter the bridge from opposite side you should:",
    options: ["Increase the speed and try to cross the bridge first", "Put on the head light and pass the bridge", "Wait till the other vehicle passes and then proceed", "Stop in the middle"],
    correctAnswer: 2
  },
  {
    id: 3,
    question: "When a vehicle is involved in an accident causing injury to any person:",
    options: ["Take the vehicle to the nearest police station", "Take all reasonable steps to secure medical attention and report to police", "Inform your insurance company", "Drive away"],
    correctAnswer: 1
  },
  {
    id: 4,
    question: "On a road designated as one-way:",
    options: ["Parking is prohibited", "Overtaking is prohibited", "Should not drive in reverse gear", "High beam is prohibited"],
    correctAnswer: 2
  },
  {
    id: 5,
    question: "You can overtake a vehicle that is in front:",
    options: ["Through the left side", "Through the right side", "Any side if road is wide", "Only at night"],
    correctAnswer: 1
  }
];
