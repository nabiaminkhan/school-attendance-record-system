'use client';

import { useEffect, useState, useRef } from 'react';
import Navbar from '@/components/Navbar';
import { getStudents, addStudent, deleteStudent } from '@/lib/storage';
import { Student } from '@/types';
import { QRCodeSVG } from 'qrcode.react';
import { Plus, Trash2, Download, IdCard, Search, X } from 'lucide-react';
import html2canvas from 'html2canvas';

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<Student | null>(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    name: '',
    fatherName: '',
    idNo: '',
    class: '',
  });
  const cardRef = useRef<HTMLDivElement>(null);
  const qrOnlyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setStudents(getStudents());
  }, []);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.idNo || !form.class) return;
    const newStu = addStudent(form);
    setStudents(getStudents());
    setForm({ name: '', fatherName: '', idNo: '', class: '' });
    setShowForm(false);
    setSelected(newStu);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this student permanently?')) {
      deleteStudent(id);
      setStudents(getStudents());
      if (selected?.id === id) setSelected(null);
    }
  };

  const downloadQROnly = async () => {
    if (!qrOnlyRef.current || !selected) return;
    const canvas = await html2canvas(qrOnlyRef.current, {
      backgroundColor: '#ffffff',
      scale: 3,
    });
    const link = document.createElement('a');
    link.download = `QR_${selected.idNo}_${selected.name.replace(/\s+/g, '_')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const downloadFullCard = async () => {
    if (!cardRef.current || !selected) return;
    const canvas = await html2canvas(cardRef.current, {
      backgroundColor: null,
      scale: 2,
    });
    const link = document.createElement('a');
    link.download = `ID_Card_${selected.idNo}_${selected.name.replace(/\s+/g, '_')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.idNo.toLowerCase().includes(search.toLowerCase()) ||
      s.fatherName.toLowerCase().includes(search.toLowerCase()) ||
      s.class.toLowerCase().includes(search.toLowerCase())
  );

  const qrValue = selected
    ? JSON.stringify({
        id: selected.id,
        name: selected.name,
        fatherName: selected.fatherName,
        idNo: selected.idNo,
        class: selected.class,
      })
    : '';

  return (
    <div className="min-h-screen pb-10">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold text-white">Student Management</h1>
          <button
            onClick={() => setShowForm(true)}
            className="glass-btn flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-medium"
          >
            <Plus size={18} /> Add Student
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={18} />
          <input
            type="text"
            placeholder="Search by name, ID, father name or class..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="glass-input w-full pl-10 pr-4 py-3 rounded-xl text-sm"
          />
        </div>

        {/* Add Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass-card p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Add New Student</h2>
                <button onClick={() => setShowForm(false)} className="text-white/70 hover:text-white">
                  <X size={22} />
                </button>
              </div>
              <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <label className="text-sm text-white/70 mb-1 block">Student Name *</label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="glass-input w-full px-3 py-2.5 rounded-lg"
                    placeholder="Full Name"
                  />
                </div>
                <div>
                  <label className="text-sm text-white/70 mb-1 block">Father Name</label>
                  <input
                    value={form.fatherName}
                    onChange={(e) => setForm({ ...form, fatherName: e.target.value })}
                    className="glass-input w-full px-3 py-2.5 rounded-lg"
                    placeholder="Father's Name"
                  />
                </div>
                <div>
                  <label className="text-sm text-white/70 mb-1 block">ID Number *</label>
                  <input
                    required
                    value={form.idNo}
                    onChange={(e) => setForm({ ...form, idNo: e.target.value })}
                    className="glass-input w-full px-3 py-2.5 rounded-lg"
                    placeholder="e.g. ASP-2026-001"
                  />
                </div>
                <div>
                  <label className="text-sm text-white/70 mb-1 block">Class *</label>
                  <input
                    required
                    value={form.class}
                    onChange={(e) => setForm({ ...form, class: e.target.value })}
                    className="glass-input w-full px-3 py-2.5 rounded-lg"
                    placeholder="e.g. Grade 5-A"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full glass-btn py-3 rounded-xl font-medium text-white mt-2"
                >
                  Create Student & Generate QR
                </button>
              </form>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Student List */}
          <div className="glass-card p-4 max-h-[70vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-3 text-white">
              Students ({filtered.length})
            </h2>
            {filtered.length === 0 ? (
              <p className="text-white/50 text-center py-8">No students found. Add one to begin.</p>
            ) : (
              <div className="space-y-2">
                {filtered.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => setSelected(s)}
                    className={`p-3 rounded-xl cursor-pointer transition-all border ${
                      selected?.id === s.id
                        ? 'bg-blue-500/30 border-blue-400/60'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-white">{s.name}</p>
                        <p className="text-xs text-white/60">
                          ID: {s.idNo} • Class: {s.class}
                        </p>
                        {s.fatherName && (
                          <p className="text-xs text-white/50">Father: {s.fatherName}</p>
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(s.id);
                        }}
                        className="p-1.5 rounded-lg hover:bg-red-500/30 text-red-300"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Selected Student QR & Card */}
          <div className="space-y-4">
            {selected ? (
              <>
                {/* Hidden QR only for download */}
                <div className="fixed -left-[9999px] top-0">
                  <div ref={qrOnlyRef} className="p-6 bg-white">
                    <QRCodeSVG value={qrValue} size={280} level="H" includeMargin />
                  </div>
                </div>

                {/* Preview Card */}
                <div
                  ref={cardRef}
                  className="bg-gradient-to-br from-slate-800 to-blue-900 rounded-2xl p-6 border border-white/20 shadow-2xl"
                  style={{ width: '100%', maxWidth: 380 }}
                >
                  <div className="flex items-center gap-3 mb-4 border-b border-white/20 pb-3">
                    <img src="/logo.svg" alt="Logo" className="w-14 h-14" />
                    <div>
                      <p className="text-sm font-bold text-white leading-tight">
                        ASP INTERNATIONAL
                      </p>
                      <p className="text-xs text-blue-300 font-semibold">SCHOOL CITY</p>
                      <p className="text-[10px] text-white/50 mt-0.5">Student Identification Card</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="bg-white p-2 rounded-lg shrink-0">
                      <QRCodeSVG value={qrValue} size={110} level="H" />
                    </div>
                    <div className="flex-1 space-y-1.5 text-sm">
                      <div>
                        <p className="text-[10px] text-white/50 uppercase">Name</p>
                        <p className="font-semibold text-white">{selected.name}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-white/50 uppercase">Father Name</p>
                        <p className="text-white/90">{selected.fatherName || '—'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-white/50 uppercase">ID No</p>
                        <p className="font-mono text-blue-300">{selected.idNo}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-white/50 uppercase">Class</p>
                        <p className="text-white">{selected.class}</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-[9px] text-center text-white/40 mt-4">
                    Scan QR for attendance • Official School Document
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={downloadQROnly}
                    className="flex-1 glass-btn flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-white"
                  >
                    <Download size={18} /> Download QR Only
                  </button>
                  <button
                    onClick={downloadFullCard}
                    className="flex-1 glass-btn flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-white bg-amber-500/30 border-amber-500/50"
                  >
                    <IdCard size={18} /> Download Full Card
                  </button>
                </div>
              </>
            ) : (
              <div className="glass-card p-10 text-center text-white/50">
                <IdCard size={48} className="mx-auto mb-3 opacity-40" />
                <p>Select a student to view QR code and ID card</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
