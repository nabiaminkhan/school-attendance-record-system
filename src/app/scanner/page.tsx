'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import { Html5Qrcode } from 'html5-qrcode';
import { getStudents, addAttendance } from '@/lib/storage';
import { Student } from '@/types';
import { Camera, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

type ScanStatus = 'idle' | 'success' | 'duplicate' | 'invalid';

export default function ScannerPage() {
  const [scanning, setScanning] = useState(false);
  const [status, setStatus] = useState<ScanStatus>('idle');
  const [message, setMessage] = useState('');
  const [lastStudent, setLastStudent] = useState<Student | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const processingRef = useRef(false);

  const stopScanner = useCallback(async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (_) {}
      scannerRef.current = null;
    }
    setScanning(false);
  }, []);

  const handleScan = useCallback(
    async (decodedText: string) => {
      if (processingRef.current) return;
      processingRef.current = true;

      try {
        const data = JSON.parse(decodedText);
        if (!data.id || !data.name || !data.idNo) {
          setStatus('invalid');
          setMessage('Invalid QR Code format');
          setTimeout(() => {
            setStatus('idle');
            processingRef.current = false;
          }, 2500);
          return;
        }

        const students = getStudents();
        const student = students.find((s) => s.id === data.id || s.idNo === data.idNo);

        if (!student) {
          setStatus('invalid');
          setMessage('Student not found in system');
          setTimeout(() => {
            setStatus('idle');
            processingRef.current = false;
          }, 2500);
          return;
        }

        const now = new Date();
        const result = addAttendance({
          studentId: student.id,
          studentName: student.name,
          fatherName: student.fatherName,
          idNo: student.idNo,
          class: student.class,
          timestamp: now.toISOString(),
          date: now.toISOString().split('T')[0],
          time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        });

        if (result === null) {
          setStatus('duplicate');
          setMessage(`Duplicate scan detected for ${student.name}`);
          setLastStudent(student);
          // Announce
          if ('speechSynthesis' in window) {
            const utter = new SpeechSynthesisUtterance(
              `Duplicate scan. Attendance already recorded for ${student.name}`
            );
            utter.rate = 0.9;
            speechSynthesis.speak(utter);
          }
        } else {
          setStatus('success');
          setMessage(`Attendance marked for ${student.name}`);
          setLastStudent(student);
          if ('speechSynthesis' in window) {
            const utter = new SpeechSynthesisUtterance(
              `Attendance recorded. Welcome ${student.name}`
            );
            utter.rate = 0.9;
            speechSynthesis.speak(utter);
          }
        }

        setTimeout(() => {
          setStatus('idle');
          processingRef.current = false;
        }, 3000);
      } catch {
        setStatus('invalid');
        setMessage('Unable to read QR code');
        setTimeout(() => {
          setStatus('idle');
          processingRef.current = false;
        }, 2500);
      }
    },
    []
  );

  const startScanner = async () => {
    await stopScanner();
    const scanner = new Html5Qrcode('qr-reader');
    scannerRef.current = scanner;
    try {
      await scanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1,
        },
        handleScan,
        () => {}
      );
      setScanning(true);
    } catch (err) {
      setMessage('Camera access denied or unavailable');
      setStatus('invalid');
    }
  };

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, [stopScanner]);

  return (
    <div className="min-h-screen pb-10">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">QR Attendance Scanner</h1>

        <div className="glass-card p-4 mb-6 relative overflow-hidden">
          <div id="qr-reader" className="w-full rounded-xl overflow-hidden min-h-[280px] bg-black/40" />
          {!scanning && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 rounded-xl">
              <Camera size={48} className="text-white/60 mb-3" />
              <p className="text-white/70 text-sm">Camera preview will appear here</p>
            </div>
          )}
          {scanning && (
            <div className="scanner-overlay pointer-events-none">
              <div className="scanner-corner tl" />
              <div className="scanner-corner tr" />
              <div className="scanner-corner bl" />
              <div className="scanner-corner br" />
            </div>
          )}
        </div>

        <div className="flex gap-3 mb-6">
          {!scanning ? (
            <button
              onClick={startScanner}
              className="flex-1 glass-btn py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 bg-emerald-500/40 border-emerald-400/60"
            >
              <Camera size={20} /> Start Camera Scanner
            </button>
          ) : (
            <button
              onClick={stopScanner}
              className="flex-1 glass-btn py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 bg-red-500/40 border-red-400/60"
            >
              Stop Scanner
            </button>
          )}
        </div>

        {/* Status Feedback */}
        {status !== 'idle' && (
          <div
            className={`glass-card p-5 mb-4 text-center ${
              status === 'success'
                ? 'success-pulse border-emerald-400/60 bg-emerald-500/20'
                : status === 'duplicate'
                ? 'error-pulse border-amber-400/60 bg-amber-500/20'
                : 'error-pulse border-red-400/60 bg-red-500/20'
            }`}
          >
            {status === 'success' && (
              <>
                <CheckCircle className="mx-auto text-emerald-400 mb-2" size={40} />
                <p className="text-lg font-semibold text-emerald-300">Attendance Recorded</p>
              </>
            )}
            {status === 'duplicate' && (
              <>
                <AlertTriangle className="mx-auto text-amber-400 mb-2" size={40} />
                <p className="text-lg font-semibold text-amber-300">Duplicate Scan</p>
                <p className="text-sm text-amber-200/80 mt-1">First scan already counted. Not added again.</p>
              </>
            )}
            {status === 'invalid' && (
              <>
                <XCircle className="mx-auto text-red-400 mb-2" size={40} />
                <p className="text-lg font-semibold text-red-300">Scan Failed</p>
              </>
            )}
            <p className="text-white mt-2">{message}</p>
            {lastStudent && (status === 'success' || status === 'duplicate') && (
              <div className="mt-3 pt-3 border-t border-white/20 text-sm text-white/80">
                <p>
                  <strong>{lastStudent.name}</strong> • {lastStudent.idNo} • {lastStudent.class}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="glass-card p-4 text-center text-sm text-white/60">
          <p>Point the camera at a student QR code.</p>
          <p className="mt-1">Only the first successful scan of the day is recorded.</p>
          <p className="mt-1">Duplicate scans are announced and rejected.</p>
        </div>
      </main>
    </div>
  );
}
