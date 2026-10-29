'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, QrCode, ClipboardList, Home } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/students', label: 'Students', icon: Users },
  { href: '/scanner', label: 'Scanner', icon: QrCode },
  { href: '/attendance', label: 'Attendance', icon: ClipboardList },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="glass sticky top-0 z-50 px-4 py-3 mb-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="ASP Logo" className="w-12 h-12" />
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white">
              ASP INTERNATIONAL
            </h1>
            <p className="text-xs text-blue-300 font-medium">SCHOOL CITY</p>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                  isActive
                    ? 'nav-active text-white'
                    : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
                }`}
              >
                <Icon size={18} />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
