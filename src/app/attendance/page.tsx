'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { getAttendance, getAttendanceByStudent } from '@/lib/storage';
import { AttendanceRecord } from '@/types';
import { Download, Search, Filter } from 'lucide-react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export default function AttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [filtered, setFiltered] = useState<AttendanceRecord[]>([]);
  const [query, setQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    const data = getAttendance();
    setRecords(data);
    setFiltered(data);
  }, []);

  useEffect(() => {
    let result = query ? getAttendanceByStudent(query) : getAttendance();
    if (dateFilter) {
      result = result.filter((r) => r.date === dateFilter);
    }
    setFiltered(result);
  }, [query, dateFilter]);

  const exportExcel = (data: AttendanceRecord[], filename: string) => {
    const sheetData = data.map((r, i) => ({
      '#': i + 1,
      'Student Name': r.studentName,
      'Father Name': r.fatherName || '',
      'ID No': r.idNo,
      Class: r.class,
      Date: r.date,
      Time: r.time,
      Timestamp: r.timestamp,
    }));

    const ws = XLSX.utils.json_to_sheet(sheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
    
    // Auto column widths
    const colWidths = [
      { wch: 5 },
      { wch: 22 },
      { wch: 20 },
      { wch: 15 },
      { wch: 12 },
      { wch: 12 },
      { wch: 12 },
      { wch: 24 },
    ];
    ws['!cols'] = colWidths;

    const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([buf], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(blob, filename);
  };

  const handleDownloadAll = () => {
    exportExcel(filtered, `ASP_Attendance_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleDownloadStudent = () => {
    if (!query.trim()) {
      alert('Enter a student name or ID to filter first');
      return;
    }
    const safeName = query.replace(/\s+/g, '_').slice(0, 30);
    exportExcel(filtered, `ASP_Attendance_${safeName}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="min-h-screen pb-10">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold text-white">Attendance Log</h1>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleDownloadAll}
              className="glass-btn flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-medium"
            >
              <Download size={18} /> Download All (Excel)
            </button>
            <button
              onClick={handleDownloadStudent}
              className="glass-btn flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-medium bg-purple-500/30 border-purple-400/50"
            >
              <Filter size={18} /> Download Filtered
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="glass-card p-4 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={18} />
            <input
              type="text"
              placeholder="Search by Name or ID Number..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="glass-input w-full pl-10 pr-4 py-2.5 rounded-xl text-sm"
            />
          </div>
          <div>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="glass-input w-full px-4 py-2.5 rounded-xl text-sm"
            />
          </div>
        </div>

        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/15 bg-white/5">
                  <th className="text-left py-3 px-4 font-semibold text-white/80">#</th>
                  <th className="text-left py-3 px-4 font-semibold text-white/80">Student Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-white/80">Father Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-white/80">ID No</th>
                  <th className="text-left py-3 px-4 font-semibold text-white/80">Class</th>
                  <th className="text-left py-3 px-4 font-semibold text-white/80">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-white/80">Time</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-white/50">
                      No attendance records found
                    </td>
                  </tr>
                ) : (
                  filtered.map((r, i) => (
                    <tr
                      key={r.id}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-3 px-4 text-white/60">{i + 1}</td>
                      <td className="py-3 px-4 font-medium text-white">{r.studentName}</td>
                      <td className="py-3 px-4 text-white/80">{r.fatherName || '—'}</td>
                      <td className="py-3 px-4 font-mono text-blue-300">{r.idNo}</td>
                      <td className="py-3 px-4 text-white/80">{r.class}</td>
                      <td className="py-3 px-4 text-white/80">{r.date}</td>
                      <td className="py-3 px-4 text-white/80">{r.time}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-white/10 text-sm text-white/50">
            Showing {filtered.length} of {records.length} records
          </div>
        </div>
      </main>
    </div>
  );
}
