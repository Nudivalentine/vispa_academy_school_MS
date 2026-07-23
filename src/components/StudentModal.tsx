import React, { useState } from 'react';
import { Student, GradeLevel, ScholarType, Gender } from '../types';
import { X, UserPlus, CheckCircle2 } from 'lucide-react';

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStudent: (newStudent: Student) => void;
}

export const StudentModal: React.FC<StudentModalProps> = ({ isOpen, onClose, onAddStudent }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState<Gender>('Girl');
  const [grade, setGrade] = useState<GradeLevel>(1);
  const [stream, setStream] = useState('Eagle');
  const [scholarType, setScholarType] = useState<ScholarType>('Day Scholar');
  const [house, setHouse] = useState<'Simba' | 'Chui' | 'Kifaru' | 'Nyati'>('Simba');
  const [guardianName, setGuardianName] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('+254 712 ');
  const [guardianEmail, setGuardianEmail] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !guardianName) return;

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const admissionNo = `VIS/2026/${randomNum}`;
    const nemisNo = `NEMIS-${Math.floor(1000000 + Math.random() * 9000000)}`;
    const isBoarder = scholarType === 'Boarding';
    const totalTermFee = grade >= 7 ? (isBoarder ? 48000 : 32000) : (isBoarder ? 42000 : 24000);

    const newStudent: Student = {
      id: `vis-${Date.now()}`,
      admissionNo,
      nemisNo,
      firstName,
      lastName,
      gender,
      grade,
      stream,
      scholarType,
      house,
      guardianName,
      guardianPhone,
      guardianEmail: guardianEmail || `${firstName.toLowerCase()}.${lastName.toLowerCase()}@gmail.com`,
      feeBalance: totalTermFee,
      totalTermFee,
      photoUrl: gender === 'Girl'
        ? 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200'
        : 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200'
    };

    onAddStudent(newStudent);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-[#FAF8F3] rounded-2xl max-w-lg w-full border border-[#D5CEBC] shadow-2xl overflow-hidden animate-fadeIn">
        <div className="bg-[#143626] text-[#FAF8F3] p-5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <UserPlus className="w-5 h-5 text-[#C99A43]" />
            <h3 className="text-lg font-bold font-serif-school">Enroll New Scholar (Grade 1 - 10)</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-[#214E36] rounded text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs text-[#143626]">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#55695D] uppercase text-[10px] mb-1">First Name *</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="e.g. Jabali"
                className="w-full bg-[#F3EFE6] border border-[#D5CEBC] rounded-lg p-2 focus:outline-none focus:border-[#143626]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#55695D] uppercase text-[10px] mb-1">Last Name *</label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="e.g. Kamau"
                className="w-full bg-[#F3EFE6] border border-[#D5CEBC] rounded-lg p-2 focus:outline-none focus:border-[#143626]"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-[#55695D] uppercase text-[10px] mb-1">Gender *</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as Gender)}
                className="w-full bg-[#F3EFE6] border border-[#D5CEBC] rounded-lg p-2 focus:outline-none"
              >
                <option value="Boy">Boy</option>
                <option value="Girl">Girl</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#55695D] uppercase text-[10px] mb-1">Grade Level *</label>
              <select
                value={grade}
                onChange={(e) => setGrade(Number(e.target.value) as GradeLevel)}
                className="w-full bg-[#F3EFE6] border border-[#D5CEBC] rounded-lg p-2 focus:outline-none"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((g) => (
                  <option key={g} value={g}>Grade {g}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#55695D] uppercase text-[10px] mb-1">Stream *</label>
              <input
                type="text"
                value={stream}
                onChange={(e) => setStream(e.target.value)}
                placeholder="Eagle, JSS-1..."
                className="w-full bg-[#F3EFE6] border border-[#D5CEBC] rounded-lg p-2 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#55695D] uppercase text-[10px] mb-1">Scholar Category *</label>
              <select
                value={scholarType}
                onChange={(e) => setScholarType(e.target.value as ScholarType)}
                className="w-full bg-[#F3EFE6] border border-[#D5CEBC] rounded-lg p-2 focus:outline-none"
              >
                <option value="Day Scholar">Day Scholar</option>
                <option value="Boarding">Boarding Scholar</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#55695D] uppercase text-[10px] mb-1">School House *</label>
              <select
                value={house}
                onChange={(e) => setHouse(e.target.value as any)}
                className="w-full bg-[#F3EFE6] border border-[#D5CEBC] rounded-lg p-2 focus:outline-none"
              >
                <option value="Simba">Simba House</option>
                <option value="Chui">Chui House</option>
                <option value="Kifaru">Kifaru House</option>
                <option value="Nyati">Nyati House</option>
              </select>
            </div>
          </div>

          <div className="border-t border-[#E8E2D0] pt-3 space-y-3">
            <h4 className="font-bold text-[#143626] uppercase text-[10px]">Guardian Information</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#55695D] text-[10px] mb-1">Guardian Name *</label>
                <input
                  type="text"
                  required
                  value={guardianName}
                  onChange={(e) => setGuardianName(e.target.value)}
                  placeholder="Parent full name"
                  className="w-full bg-[#F3EFE6] border border-[#D5CEBC] rounded-lg p-2 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[#55695D] text-[10px] mb-1">M-Pesa Phone Number *</label>
                <input
                  type="text"
                  required
                  value={guardianPhone}
                  onChange={(e) => setGuardianPhone(e.target.value)}
                  placeholder="+254 7..."
                  className="w-full bg-[#F3EFE6] border border-[#D5CEBC] rounded-lg p-2 focus:outline-none font-mono"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-[#E2DCCB] hover:bg-[#D5CEBC] text-[#143626] px-4 py-2 rounded-lg font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#143626] hover:bg-[#214E36] text-[#FAF8F3] px-5 py-2 rounded-lg font-bold shadow-sm"
            >
              Confirm Enrollment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
