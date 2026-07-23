export type GradeLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type Gender = 'Boy' | 'Girl';
export type ScholarType = 'Day Scholar' | 'Boarding';
export type CbcRating = 'EE' | 'ME' | 'AE' | 'BE'; 
// EE = Exceeding Expectations (4)
// ME = Meeting Expectations (3)
// AE = Approaching Expectations (2)
// BE = Below Expectations (1)

export interface Student {
  id: string;
  admissionNo: string;
  nemisNo: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  grade: GradeLevel;
  stream: string; // e.g. "Eagle", "Falcon", "Mara", "Savannah"
  scholarType: ScholarType;
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
  feeBalance: number; // in KES
  totalTermFee: number; // in KES
  house: 'Simba' | 'Chui' | 'Kifaru' | 'Nyati';
  photoUrl: string;
}

export interface SubjectScore {
  subjectName: string;
  category: 'Core' | 'Applied' | 'Optional';
  score: number; // 0 - 100
  rating: CbcRating;
  teacherComment: string;
}

export interface ReportCard {
  id: string;
  studentId: string;
  term: 'Term 1' | 'Term 2' | 'Term 3';
  year: number;
  subjectScores: SubjectScore[];
  overallTeacherRemarks: string;
  formativeGuidance: string;
  headTeacherRemarks: string;
  daysPresent: number;
  totalDays: number;
  conduct: 'Exemplary' | 'Good' | 'Needs Improvement';
  issueDate: string;
}

export interface FeeTransaction {
  id: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  grade: GradeLevel;
  amount: number; // KES
  paymentType: 'Tuition Fee' | 'Lunch Program' | 'Transport' | 'Boarding Amenities' | 'CBC Activity Materials';
  mpesaCode: string;
  timestamp: string;
  status: 'Confirmed' | 'Pending';
  payerPhone: string;
}

export interface TimetableEntry {
  id: string;
  grade: GradeLevel;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  timeSlot: string; // e.g., "08:00 AM - 08:40 AM"
  subject: string;
  teacherName: string;
  venue: string;
}

export type SystemRoleId = 
  | 'superadmin' 
  | 'principal' 
  | 'deputy_principal' 
  | 'finance' 
  | 'teacher' 
  | 'receptionist' 
  | 'librarian' 
  | 'nurse' 
  | 'parent' 
  | 'student'
  | 'admin'
  | 'bursar';

export interface UserRole {
  id: SystemRoleId;
  label: string;
  subtitle: string;
  userName: string;
  avatar: string;
  usernameOrEmail?: string;
  email?: string;
  phone?: string;
  admissionNo?: string;
  tscNo?: string;
  nemisNo?: string;
  assignedGrade?: GradeLevel;
  registeredAt?: string;
  password?: string;
  isTemporaryPassword?: boolean;
  createdBySuperAdmin?: boolean;
}

export type ActiveTab = 'dashboard' | 'students' | 'cbc' | 'fees' | 'timetable' | 'school-info' | 'users';

