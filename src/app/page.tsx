'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { getStudents, getAttendance } from '@/lib/storage';
import { Users, ClipboardCheck, QrCode, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const [stats, setStats] = useState({ students: 0, today: 0, total: 0 });

  useEffect(() => {
    const students = getStudents();
    const attendance = getAttendance();
    const today = new Date().toISOString().split('T')[0];
    const todayCount = attendance.filter((a) => a.date === today).length;
    setStats({
      students: students.length,
      today: todayCount,
      total: attendance.length,
    });
  }, []);

  const cards = [
    {
      title: 'Total Students',
      value: stats.students,
      icon: Users,
      color: 'from-blue-500/30 to-cyan-500/20',
      href: '/students',
    },
    {
      title: "Today's Attendance",
      value: stats.today,
      icon: ClipboardCheck,
      color: 'from-emerald-500/30 to-green-500/20',
      href: '/attendance',
    },
    {
      title: 'Total Records',
      value: stats.total,
      icon: TrendingUp,
      color: 'from-purple-500/30 to-indigo-500/20',
      href: '/attendance',
    },
    {
      title: 'Scan QR',
      value: 'Open',
      icon: QrCode,
      color: 'from-amber-500/30 to-orange-500/20',
      href: '/scanner',
    },
  ];

  return (
    <div className="min-h-screen pb-10">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4">
        <div className="glass-card p-6 mb-8 text-center">
          <img src="/logo.svg" alt="School Logo" className="w-24 h-24 mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            ASP INTERNATIONAL SCHOOL CITY
          </h1>
          <p className="text-blue-200 text-lg">Digital QR Attendance Management System</p>
          <p className="text-white/60 text-sm mt-2">Secure • Real-time • Paperless</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.title}
                href={card.href}
                className={`glass-card p-5 bg-gradient-to-br ${card.color} hover:scale-[1.02] transition-transform`}
              >
                <div className="flex items-center justify-between mb-3">
                  <Icon className="text-white/90" size={28} />
                </div>
                <p className="text-white/70 text-sm font-medium">{card.title}</p>
                <p className="text-2xl md:text-3xl font-bold text-white mt-1">{card.value}</p>
              </Link>
            );
          })}
        </div>

        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-4 text-white">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/students"
              className="glass-btn rounded-xl p-4 text-center font-medium text-white"
            >
              Manage Students & Generate QR
            </Link>
            <Link
              href="/scanner"
              className="glass-btn rounded-xl p-4 text-center font-medium text-white bg-emerald-500/30 border-emerald-500/50"
            >
              Open Camera Scanner
            </Link>
            <Link
              href="/attendance"
              className="glass-btn rounded-xl p-4 text-center font-medium text-white bg-purple-500/30 border-purple-500/50"
            >
              View & Export Attendance
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
