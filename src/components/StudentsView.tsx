import React, { useState, useMemo } from 'react';
import { Student, GradeLevel, ScholarType, Gender, UserRole } from '../types';
import { getStudentsForRole, getPrimaryStudentForRole } from '../utils/roleUtils';
import { 
  Users, 
  Search, 
  Filter, 
  UserPlus, 
  Phone, 
  Mail, 
  CreditCard, 
  FileText, 
  Eye, 
  X, 
  CheckCircle2, 
  AlertCircle,
  Shield,
  Download,
  GraduationCap
} from 'lucide-react';

interface StudentsViewProps {
  currentRole: UserRole;
  students: Student[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenAddStudent: () => void;
  onSelectReportCard: (studentId: string) => void;
}

export const StudentsView: React.FC<StudentsViewProps> = ({
  currentRole,
  students,
  searchQuery,
  onSearchChange,
  onOpenAddStudent,
  onSelectReportCard
}) => {
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [selectedHouse, setSelectedHouse] = useState<string>('all');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const canEnroll = currentRole.id === 'superadmin' || currentRole.id === 'admin' || currentRole.id === 'principal' || currentRole.id === 'deputy_principal';
  const isParent = currentRole.id === 'parent';
  const isStudent = currentRole.id === 'student';

  const linkedScholar = getPrimaryStudentForRole(currentRole, students);

  // Filter logic
  const filteredStudents = useMemo(() => {
    // Parent & Student Scope Isolation: Parents and Students only see their own record!
    let targetStudents = students;
    if (isParent || isStudent) {
      targetStudents = getStudentsForRole(currentRole, students);
    }

    return targetStudents.filter((s) => {
      const matchSearch = 
        s.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.admissionNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.nemisNo.toLowerCase().includes(searchQuery.toLowerCase());

      const matchGrade = selectedGrade === 'all' || s.grade.toString() === selectedGrade;
      const matchType = selectedType === 'all' || s.scholarType === selectedType;
      const matchGender = selectedGender === 'all' || s.gender === selectedGender;
      const matchHouse = selectedHouse === 'all' || s.house === selectedHouse;

      return matchSearch && matchGrade && matchType && matchGender && matchHouse;
    });
  }, [students, searchQuery, selectedGrade, selectedType, selectedGender, selectedHouse, isParent, isStudent, currentRole]);

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#FAF8F3] p-5 rounded-xl border border-[#E2DCCB] shadow-sm">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#55695D] uppercase tracking-wider mb-1">
            <Users className="w-4 h-4 text-[#143626]" />
            <span>Vispa Mixed School Registry • Portal Role: {currentRole.label}</span>
          </div>
          <h2 className="text-2xl font-bold font-serif-school text-[#143626]">
            Grade 1 to Grade 10 Scholar Directory
          </h2>
          <p className="text-xs text-[#55695D]">
            Showing {filteredStudents.length} of {students.length} registered students
          </p>
        </div>

        {/* Enroll Button - ONLY VISIBLE TO SUPER ADMIN / ADMIN / PRINCIPAL */}
        {canEnroll && (
          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenAddStudent}
              className="bg-[#143626] hover:bg-[#214E36] text-[#FAF8F3] text-xs font-bold px-4 py-2.5 rounded-lg flex items-center space-x-2 transition-all shadow-sm"
            >
              <UserPlus className="w-4 h-4 text-[#C99A43]" />
              <span>Enroll New Scholar</span>
            </button>
          </div>
        )}
      </div>

      {/* Parent or Student Linked Scholar Banner */}
      {(isParent || isStudent) && (
        <div className="bg-[#143626] text-[#FAF8F3] p-4 rounded-xl border border-[#214E36] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#C99A43] text-[#122C20] rounded-lg">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-[#EAD8A6] font-semibold">
                {isParent ? 'Your Linked Scholar Profile' : 'Your Student Profile'}
              </div>
              <div className="text-sm font-bold">
                {linkedScholar.firstName} {linkedScholar.lastName} (Admission: {linkedScholar.admissionNo})
              </div>
              <div className="text-[11px] text-[#C3BDAD]">
                Grade {linkedScholar.grade} • Stream {linkedScholar.stream} • {linkedScholar.scholarType}
              </div>
            </div>
          </div>
          <button
            onClick={() => onSelectReportCard(linkedScholar.id)}
            className="bg-[#C99A43] hover:bg-[#D8A74F] text-[#122C20] text-xs font-bold px-3.5 py-2 rounded-lg transition-all"
          >
            View {isStudent ? 'My' : `${linkedScholar.firstName}'s`} Report Card
          </button>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="bg-[#FAF8F3] p-4 rounded-xl border border-[#E2DCCB] space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#889B8F]" />
            <input
              type="text"
              placeholder="Search name, NEMIS, Admission..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-[#F3EFE6] border border-[#D5CEBC] text-[#143626] text-xs rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-[#143626]"
            />
          </div>

          {/* Quick Grade Tier Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-[11px] font-bold text-[#55695D] mr-1">Grade Tier:</span>
            {[
              { id: 'all', label: 'All Grades (1-10)' },
              { id: '1', label: 'G1' },
              { id: '2', label: 'G2' },
              { id: '3', label: 'G3' },
              { id: '4', label: 'G4' },
              { id: '5', label: 'G5' },
              { id: '6', label: 'G6' },
              { id: '7', label: 'G7 (JSS)' },
              { id: '8', label: 'G8' },
              { id: '9', label: 'G9' },
              { id: '10', label: 'G10 (Senior)' },
            ].map((g) => (
              <button
                key={g.id}
                onClick={() => setSelectedGrade(g.id)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                  selectedGrade === g.id
                    ? 'bg-[#143626] text-[#FAF8F3] font-bold shadow-sm'
                    : 'bg-[#F3EFE6] text-[#2C3E35] hover:bg-[#E2DCCB]'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary Dropdown Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-[#E8E2D0] text-xs">
          <div>
            <label className="block text-[10px] font-bold text-[#55695D] uppercase mb-1">Scholar Category</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-[#F3EFE6] border border-[#D5CEBC] rounded-lg p-1.5 text-[#143626] focus:outline-none"
            >
              <option value="all">All Categories (Day & Boarding)</option>
              <option value="Day Scholar">Day Scholar</option>
              <option value="Boarding">Boarding Scholar</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#55695D] uppercase mb-1">Gender</label>
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="w-full bg-[#F3EFE6] border border-[#D5CEBC] rounded-lg p-1.5 text-[#143626] focus:outline-none"
            >
              <option value="all">All Genders (Boy & Girl)</option>
              <option value="Boy">Boy Scholar</option>
              <option value="Girl">Girl Scholar</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#55695D] uppercase mb-1">School House</label>
            <select
              value={selectedHouse}
              onChange={(e) => setSelectedHouse(e.target.value)}
              className="w-full bg-[#F3EFE6] border border-[#D5CEBC] rounded-lg p-1.5 text-[#143626] focus:outline-none"
            >
              <option value="all">All Houses (Simba, Chui, etc)</option>
              <option value="Simba">Simba House</option>
              <option value="Chui">Chui House</option>
              <option value="Kifaru">Kifaru House</option>
              <option value="Nyati">Nyati House</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSelectedGrade('all');
                setSelectedType('all');
                setSelectedGender('all');
                setSelectedHouse('all');
                onSearchChange('');
              }}
              className="w-full bg-[#E2DCCB] hover:bg-[#D5CEBC] text-[#143626] font-semibold py-1.5 rounded-lg transition-colors text-xs"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Main Student Directory Table */}
      <div className="bg-[#FAF8F3] rounded-xl border border-[#E2DCCB] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#143626]">
            <thead className="bg-[#143626] text-[#FAF8F3] uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Scholar Name</th>
                <th className="py-3 px-4">Grade & Stream</th>
                <th className="py-3 px-4">Adm & NEMIS No</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">House & Gender</th>
                <th className="py-3 px-4">Fee Balance</th>
                <th className="py-3 px-4">Parent Phone</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D0]">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-[#55695D]">
                    No scholars found matching the selected filters.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => {
                  const hasBalance = s.feeBalance > 0;
                  return (
                    <tr key={s.id} className="hover:bg-[#F3EFE6] transition-colors">
                      <td className="py-3 px-4 font-bold flex items-center space-x-3">
                        <img 
                          src={s.photoUrl} 
                          alt={`${s.firstName} ${s.lastName}`}
                          className="w-8 h-8 rounded-full object-cover border border-[#D5CEBC]"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="text-xs font-bold text-[#143626]">
                            {s.firstName} {s.lastName}
                          </div>
                          <div className="text-[10px] text-[#55695D]">
                            Vispa Scholar #{s.id.toUpperCase()}
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-semibold">
                        <span className="bg-[#143626] text-[#FAF8F3] px-2 py-0.5 rounded text-[11px]">
                          Grade {s.grade}
                        </span>
                        <span className="ml-1 text-[11px] text-[#55695D]">{s.stream}</span>
                      </td>

                      <td className="py-3 px-4 font-mono text-[11px]">
                        <div>{s.admissionNo}</div>
                        <div className="text-[10px] text-[#55695D]">{s.nemisNo}</div>
                      </td>

                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          s.scholarType === 'Boarding'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        }`}>
                          {s.scholarType}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-1.5">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                            s.house === 'Simba' ? 'bg-amber-100 text-amber-800' :
                            s.house === 'Chui' ? 'bg-emerald-100 text-emerald-800' :
                            s.house === 'Kifaru' ? 'bg-blue-100 text-blue-800' : 'bg-stone-100 text-stone-800'
                          }`}>
                            {s.house}
                          </span>
                          <span className="text-[11px] text-[#55695D]">({s.gender})</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-bold">
                        {hasBalance ? (
                          <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            KSh {s.feeBalance.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center space-x-1 w-fit">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Cleared</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-[11px] text-[#2C3E35]">
                        <div className="flex items-center space-x-1">
                          <Phone className="w-3 h-3 text-[#55695D]" />
                          <span>{s.guardianPhone}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <button
                            onClick={() => setSelectedStudent(s)}
                            className="p-1.5 bg-[#EAE4D5] hover:bg-[#143626] hover:text-[#FAF8F3] text-[#143626] rounded transition-colors"
                            title="View Profile Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onSelectReportCard(s.id)}
                            className="p-1.5 bg-[#143626] hover:bg-[#214E36] text-[#FAF8F3] rounded transition-colors"
                            title="Open CBC Report Card"
                          >
                            <FileText className="w-3.5 h-3.5 text-[#C99A43]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Profile Drawer / Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-[#FAF8F3] rounded-2xl max-w-2xl w-full border border-[#D5CEBC] shadow-2xl overflow-hidden animate-fadeIn">
            <div className="bg-[#143626] text-[#FAF8F3] p-5 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img 
                  src={selectedStudent.photoUrl} 
                  alt={selectedStudent.firstName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#C99A43]"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h3 className="text-lg font-bold font-serif-school">
                    {selectedStudent.firstName} {selectedStudent.lastName}
                  </h3>
                  <p className="text-xs text-[#A9BBAF]">
                    Grade {selectedStudent.grade} ({selectedStudent.stream}) • Admission: {selectedStudent.admissionNo}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="p-1.5 hover:bg-[#214E36] rounded-full transition-colors text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Bio Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div className="bg-[#F3EFE6] p-3 rounded-lg border border-[#E2DCCB]">
                  <span className="text-[10px] font-bold text-[#55695D] uppercase block">NEMIS ID</span>
                  <span className="font-mono font-bold text-[#143626]">{selectedStudent.nemisNo}</span>
                </div>
                <div className="bg-[#F3EFE6] p-3 rounded-lg border border-[#E2DCCB]">
                  <span className="text-[10px] font-bold text-[#55695D] uppercase block">Scholar Type</span>
                  <span className="font-bold text-[#143626]">{selectedStudent.scholarType}</span>
                </div>
                <div className="bg-[#F3EFE6] p-3 rounded-lg border border-[#E2DCCB]">
                  <span className="text-[10px] font-bold text-[#55695D] uppercase block">House</span>
                  <span className="font-bold text-[#143626]">{selectedStudent.house} House</span>
                </div>
              </div>

              {/* Guardian Info */}
              <div className="bg-[#F3EFE6] p-4 rounded-xl border border-[#E2DCCB] space-y-2 text-xs">
                <h4 className="font-bold text-[#143626] uppercase text-[11px] border-b border-[#E8E2D0] pb-1">
                  Parent / Guardian Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-[#55695D] block text-[10px]">Guardian Name:</span>
                    <span className="font-bold text-[#143626]">{selectedStudent.guardianName}</span>
                  </div>
                  <div>
                    <span className="text-[#55695D] block text-[10px]">M-Pesa Phone Number:</span>
                    <span className="font-bold text-[#143626] flex items-center space-x-1">
                      <Phone className="w-3 h-3 text-emerald-700" />
                      <span>{selectedStudent.guardianPhone}</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-[#55695D] block text-[10px]">Email Address:</span>
                    <span className="font-medium text-[#143626]">{selectedStudent.guardianEmail}</span>
                  </div>
                </div>
              </div>

              {/* Fee Breakdown */}
              <div className="bg-[#143626] text-[#FAF8F3] p-4 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#EAD8A6] uppercase text-[11px]">Term 2 Fee Position</span>
                  <span className="text-[10px] bg-[#214E36] px-2 py-0.5 rounded">PAYBILL: 400200</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center pt-2">
                  <div className="bg-[#214E36] p-2 rounded">
                    <span className="text-[10px] text-[#A9BBAF] block">Total Term Fee</span>
                    <span className="font-bold text-white">KSh {selectedStudent.totalTermFee.toLocaleString()}</span>
                  </div>
                  <div className="bg-[#214E36] p-2 rounded">
                    <span className="text-[10px] text-[#A9BBAF] block">Amount Paid</span>
                    <span className="font-bold text-emerald-400">
                      KSh {(selectedStudent.totalTermFee - selectedStudent.feeBalance).toLocaleString()}
                    </span>
                  </div>
                  <div className="bg-[#214E36] p-2 rounded">
                    <span className="text-[10px] text-[#A9BBAF] block">Outstanding Balance</span>
                    <span className="font-bold text-amber-400">
                      KSh {selectedStudent.feeBalance.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#F3EFE6] p-4 border-t border-[#E2DCCB] flex items-center justify-between">
              <button
                onClick={() => {
                  const id = selectedStudent.id;
                  setSelectedStudent(null);
                  onSelectReportCard(id);
                }}
                className="bg-[#143626] hover:bg-[#214E36] text-[#FAF8F3] text-xs font-bold px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <FileText className="w-4 h-4 text-[#C99A43]" />
                <span>View Term 2 Report Card</span>
              </button>

              <button
                onClick={() => setSelectedStudent(null)}
                className="bg-[#E2DCCB] hover:bg-[#D5CEBC] text-[#143626] text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
