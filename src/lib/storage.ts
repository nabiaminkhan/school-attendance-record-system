import { Student, AttendanceRecord } from '@/types';

const STUDENTS_KEY = 'asp_students';
const ATTENDANCE_KEY = 'asp_attendance';

export const getStudents = (): Student[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STUDENTS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveStudents = (students: Student[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
};

export const addStudent = (student: Omit<Student, 'id' | 'createdAt'>): Student => {
  const students = getStudents();
  const newStudent: Student = {
    ...student,
    id: `STU-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
  };
  students.push(newStudent);
  saveStudents(students);
  return newStudent;
};

export const deleteStudent = (id: string): void => {
  const students = getStudents().filter((s) => s.id !== id);
  saveStudents(students);
};

export const getAttendance = (): AttendanceRecord[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(ATTENDANCE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveAttendance = (records: AttendanceRecord[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(records));
};

export const addAttendance = (record: Omit<AttendanceRecord, 'id'>): AttendanceRecord | null => {
  const records = getAttendance();
  const today = new Date().toISOString().split('T')[0];
  
  // Check for duplicate on same day
  const exists = records.find(
    (r) => r.studentId === record.studentId && r.date === today
  );
  
  if (exists) {
    return null; // Duplicate
  }
  
  const newRecord: AttendanceRecord = {
    ...record,
    id: `ATT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  };
  records.unshift(newRecord);
  saveAttendance(records);
  return newRecord;
};

export const getAttendanceByStudent = (query: string): AttendanceRecord[] => {
  const records = getAttendance();
  const q = query.toLowerCase().trim();
  if (!q) return records;
  return records.filter(
    (r) =>
      r.studentName.toLowerCase().includes(q) ||
      r.idNo.toLowerCase().includes(q) ||
      r.fatherName.toLowerCase().includes(q)
  );
};
