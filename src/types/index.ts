export interface Student {
  id: string;
  name: string;
  fatherName: string;
  idNo: string;
  class: string;
  createdAt: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  fatherName: string;
  idNo: string;
  class: string;
  timestamp: string;
  date: string;
  time: string;
}

export interface SchoolInfo {
  name: string;
  address: string;
  motto: string;
}
