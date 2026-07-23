import React from 'react';
import { Student, FeeTransaction, ActiveTab, UserRole } from '../types';
import { SCHOOL_EVENTS } from '../data/mockData';
import { getStudentsForRole, getPrimaryStudentForRole } from '../utils/roleUtils';
import { 
  Users, 
  GraduationCap, 
  CreditCard, 
  TrendingUp, 
  Calendar, 
  Sparkles, 
  ArrowUpRight, 
  UserPlus, 
  FileText, 
  CheckCircle2, 
  PhoneCall, 
  ShieldAlert,
  Building,
  School,
  UserCheck,
  Award,
  DollarSign,
  BookOpen,
  KeyRound,
  Lock,
  Phone
} from 'lucide-react';

interface DashboardViewProps {
  currentRole: UserRole;
  students: Student[];
  transactions: FeeTransaction[];
  onNavigate: (tab: ActiveTab) => void;
  onOpenAddStudent: () => void;
  onOpenAuthModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentRole,
  students,
  transactions,
  onNavigate,
  onOpenAddStudent,
  onOpenAuthModal
}) => {
  // Calculations
  const totalStudents = 840; // Total school capacity
  const girlsCount = 437; // 52%
  const boysCount = 403; // 48%
  
  const totalBalance = students.reduce((sum, s) => sum + s.feeBalance, 0);
  const totalFeesExpected = students.reduce((sum, s) => sum + s.totalTermFee, 0);
  const totalCollected = totalFeesExpected - totalBalance;
  const collectionPercentage = Math.round((totalCollected / totalFeesExpected) * 100) || 88;

  // Grade breakdown count
  const gradeCounts: Record<number, number> = {
    1: 85, 2: 82, 3: 88, 4: 84, 5: 86, 6: 80, 7: 92, 8: 90, 9: 88, 10: 65
  };

  const isSuperAdmin = currentRole.id === 'superadmin' || currentRole.id === 'admin';
  const isPrincipal = currentRole.id === 'principal' || currentRole.id === 'deputy_principal';
  const isFinance = currentRole.id === 'finance' || currentRole.id === 'bursar';
  const isTeacher = currentRole.id === 'teacher';
  const isParent = currentRole.id === 'parent';
  const isStudent = currentRole.id === 'student';
  const isSupportStaff = currentRole.id === 'receptionist' || currentRole.id === 'librarian' || currentRole.id === 'nurse';

  // Find linked student for parent or student view dynamically
  const roleScholar = getPrimaryStudentForRole(currentRole, students);

  return (
    <div className="space-y-6">
      {/* Welcome Banner - Tailored per Role */}
      <div className="bg-[#143626] text-[#FAF8F3] rounded-2xl p-6 shadow-md border border-[#214E36] relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(#C99A43_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-[#EAD8A6] text-xs font-semibold uppercase tracking-wider mb-1">
              <School className="w-4 h-4 text-[#C99A43]" />
              <span>Vispa Mixed Primary & Junior Secondary School</span>
              <span className="bg-[#C99A43] text-[#122C20] px-2 py-0.5 rounded text-[10px] font-bold">
                {currentRole.label}
              </span>
            </div>

            <h2 className="text-2xl font-bold font-serif-school text-[#FAF8F3]">
              Karibu, {currentRole.userName}!
            </h2>

            <p className="text-xs text-[#C3BDAD] mt-1 max-w-2xl leading-relaxed">
              {isSuperAdmin && "Super Administrator Root Control Panel • Full system authority to provision staff accounts, manage roles, and review audit logs."}
              {isPrincipal && "Executive Headteacher Dashboard • Academic leadership, CBC curriculum monitoring, and institutional supervision."}
              {isFinance && "School Finance & Bursar Dashboard • Safaricom M-Pesa Paybill 400200 reconciliation, fee statements, and parent notices."}
              {isTeacher && `Grade ${currentRole.assignedGrade || 7} Class Teacher Portal • Managing student CBC assessments, attendance, and AI lesson schemes.`}
              {isParent && `Parent & Guardian Portal • Monitoring academic progress, CBC report cards, and fee position for ${roleScholar.firstName} ${roleScholar.lastName}.`}
              {isStudent && `Student Personal Portal • Viewing Grade ${roleScholar.grade} report card, subject timetable, and AI study assistant for ${roleScholar.firstName} ${roleScholar.lastName}.`}
              {isSupportStaff && `Departmental Staff Dashboard (${currentRole.label}) • Managing operational logs and school service records.`}
            </p>
          </div>

          {/* Action Buttons - Tailored per Role */}
          <div className="flex flex-wrap items-center gap-2">
            {/* SUPER ADMIN ACTIONS */}
            {isSuperAdmin && (
              <>
                <button
                  onClick={() => onNavigate('users')}
                  className="bg-[#C99A43] hover:bg-[#D8A74F] text-[#122C20] text-xs font-bold px-3.5 py-2.5 rounded-lg flex items-center space-x-1.5 transition-all shadow-sm"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Create Staff Account</span>
                </button>
                <button
                  onClick={onOpenAddStudent}
                  className="bg-[#214E36] hover:bg-[#2B6043] border border-[#2F6D4C] text-[#FAF8F3] text-xs font-semibold px-3.5 py-2.5 rounded-lg flex items-center space-x-1.5 transition-all"
                >
                  <UserCheck className="w-4 h-4 text-[#C99A43]" />
                  <span>Enroll Scholar</span>
                </button>
              </>
            )}

            {/* PRINCIPAL ACTIONS */}
            {isPrincipal && (
              <>
                <button
                  onClick={onOpenAddStudent}
                  className="bg-[#C99A43] hover:bg-[#D8A74F] text-[#122C20] text-xs font-bold px-3.5 py-2.5 rounded-lg flex items-center space-x-1.5 transition-all shadow-sm"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Enroll Scholar</span>
                </button>
                <button
                  onClick={() => onNavigate('cbc')}
                  className="bg-[#214E36] hover:bg-[#2B6043] border border-[#2F6D4C] text-[#FAF8F3] text-xs font-semibold px-3.5 py-2.5 rounded-lg flex items-center space-x-1.5 transition-all"
                >
                  <GraduationCap className="w-4 h-4 text-[#C99A43]" />
                  <span>Academic Overview</span>
                </button>
              </>
            )}

            {/* TEACHER ACTIONS */}
            {isTeacher && (
              <>
                <button
                  onClick={() => onNavigate('cbc')}
                  className="bg-[#C99A43] hover:bg-[#D8A74F] text-[#122C20] text-xs font-bold px-4 py-2.5 rounded-lg flex items-center space-x-2 transition-all shadow-sm"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Grade 7 Assessment</span>
                </button>
                <button
                  onClick={() => onNavigate('ai-antigravity')}
                  className="bg-[#214E36] hover:bg-[#2B6043] border border-[#2F6D4C] text-[#FAF8F3] text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center space-x-2 transition-all"
                >
                  <Sparkles className="w-4 h-4 text-[#F3D78A]" />
                  <span>AI Lesson Planner</span>
                </button>
              </>
            )}

            {/* FINANCE / BURSAR ACTIONS */}
            {isFinance && (
              <>
                <button
                  onClick={() => onNavigate('fees')}
                  className="bg-[#C99A43] hover:bg-[#D8A74F] text-[#122C20] text-xs font-bold px-4 py-2.5 rounded-lg flex items-center space-x-2 transition-all shadow-sm"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Record M-Pesa Receipt</span>
                </button>
                <button
                  onClick={() => onNavigate('fees')}
                  className="bg-[#214E36] hover:bg-[#2B6043] border border-[#2F6D4C] text-[#FAF8F3] text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center space-x-2 transition-all"
                >
                  <PhoneCall className="w-4 h-4 text-[#F3D78A]" />
                  <span>Dispatch SMS Reminders</span>
                </button>
              </>
            )}

            {/* PARENT ACTIONS */}
            {isParent && (
              <>
                <button
                  onClick={() => onNavigate('cbc')}
                  className="bg-[#C99A43] hover:bg-[#D8A74F] text-[#122C20] text-xs font-bold px-4 py-2.5 rounded-lg flex items-center space-x-2 transition-all shadow-sm"
                >
                  <FileText className="w-4 h-4" />
                  <span>View Report Card</span>
                </button>
                <button
                  onClick={() => onNavigate('fees')}
                  className="bg-[#214E36] hover:bg-[#2B6043] border border-[#2F6D4C] text-[#FAF8F3] text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center space-x-2 transition-all"
                >
                  <CreditCard className="w-4 h-4 text-[#F3D78A]" />
                  <span>Pay Fees (Paybill 400200)</span>
                </button>
              </>
            )}

            {/* STUDENT ACTIONS */}
            {isStudent && (
              <>
                <button
                  onClick={() => onNavigate('cbc')}
                  className="bg-[#C99A43] hover:bg-[#D8A74F] text-[#122C20] text-xs font-bold px-4 py-2.5 rounded-lg flex items-center space-x-2 transition-all shadow-sm"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>My Report Card</span>
                </button>
                <button
                  onClick={() => onNavigate('timetable')}
                  className="bg-[#214E36] hover:bg-[#2B6043] border border-[#2F6D4C] text-[#FAF8F3] text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center space-x-2 transition-all"
                >
                  <Calendar className="w-4 h-4 text-[#F3D78A]" />
                  <span>My Timetable</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* METRIC CARDS GRID - Dynamic depending on Role */}
      {isStudent ? (
        /* STUDENT SPECIFIC METRIC CARDS */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#FAF8F3] p-5 rounded-xl border border-[#E2DCCB] shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#55695D] uppercase tracking-wider">My Student Profile</span>
              <div className="p-2 bg-[#EAE4D4] text-[#143626] rounded-lg">
                <GraduationCap className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-lg font-extrabold text-[#143626]">{roleScholar.firstName} {roleScholar.lastName}</div>
              <p className="text-[11px] text-[#55695D] mt-1">
                Adm: <span className="font-mono font-bold text-[#143626]">{roleScholar.admissionNo}</span> • Grade {roleScholar.grade} {roleScholar.stream}
              </p>
            </div>
          </div>

          <div className="bg-[#FAF8F3] p-5 rounded-xl border border-[#E2DCCB] shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#55695D] uppercase tracking-wider">My Fee Balance</span>
              <div className="p-2 bg-emerald-100 text-emerald-900 rounded-lg">
                <CreditCard className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-extrabold text-emerald-900">
                KSh {roleScholar.feeBalance.toLocaleString()}
              </div>
              <p className="text-[11px] text-emerald-700 font-medium mt-1">
                {roleScholar.feeBalance === 0 ? '✓ Fully Cleared for Term 2 (Paybill 400200)' : `Outstanding balance (Acc: ${roleScholar.admissionNo})`}
              </p>
            </div>
          </div>

          <div className="bg-[#FAF8F3] p-5 rounded-xl border border-[#E2DCCB] shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#55695D] uppercase tracking-wider">CBC Assessment Level</span>
              <div className="p-2 bg-blue-100 text-blue-900 rounded-lg">
                <Award className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-extrabold text-blue-900">EE (Exceeds)</div>
              <p className="text-[11px] text-[#55695D] mt-1">
                Top performance in Science, Tech & Math
              </p>
            </div>
          </div>

          <div className="bg-[#FAF8F3] p-5 rounded-xl border border-[#E2DCCB] shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#55695D] uppercase tracking-wider">My School House</span>
              <div className="p-2 bg-amber-100 text-amber-900 rounded-lg">
                <Building className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-extrabold text-amber-900">{roleScholar.house} House</div>
              <p className="text-[11px] text-[#55695D] mt-1">
                240 Pts • 98% Term Attendance
              </p>
            </div>
          </div>
        </div>
      ) : isParent ? (
        /* PARENT SPECIFIC SCHOLAR OVERVIEW CARDS */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#FAF8F3] p-5 rounded-xl border border-[#E2DCCB] shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#55695D] uppercase tracking-wider">Scholar Profile</span>
              <div className="p-2 bg-[#EAE4D4] text-[#143626] rounded-lg">
                <GraduationCap className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-lg font-extrabold text-[#143626]">{roleScholar.firstName} {roleScholar.lastName}</div>
              <p className="text-[11px] text-[#55695D] mt-1">
                Grade {roleScholar.grade} ({roleScholar.stream}) • {roleScholar.scholarType}
              </p>
            </div>
          </div>

          <div className="bg-[#FAF8F3] p-5 rounded-xl border border-[#E2DCCB] shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#55695D] uppercase tracking-wider">Term 2 Fee Position</span>
              <div className="p-2 bg-amber-100 text-amber-900 rounded-lg">
                <CreditCard className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-extrabold text-amber-900">KSh {roleScholar.feeBalance.toLocaleString()}</div>
              <p className="text-[11px] text-[#55695D] mt-1">
                Paybill: <span className="font-bold text-[#143626]">400200</span> • Acc: <span className="font-mono text-[#143626]">{roleScholar.admissionNo}</span>
              </p>
            </div>
          </div>

          <div className="bg-[#FAF8F3] p-5 rounded-xl border border-[#E2DCCB] shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#55695D] uppercase tracking-wider">Academic Level</span>
              <div className="p-2 bg-emerald-100 text-emerald-900 rounded-lg">
                <Award className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-extrabold text-emerald-900">EE (Exceeds)</div>
              <p className="text-[11px] text-[#55695D] mt-1">
                Top rating in Mathematics & Science
              </p>
            </div>
          </div>

          <div className="bg-[#FAF8F3] p-5 rounded-xl border border-[#E2DCCB] shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#55695D] uppercase tracking-wider">School House</span>
              <div className="p-2 bg-blue-100 text-blue-900 rounded-lg">
                <Building className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-extrabold text-[#143626]">{roleScholar.house} House</div>
              <p className="text-[11px] text-emerald-700 font-medium mt-1">
                240 Points • #1 in Inter-House
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* STAFF / ADMIN METRIC CARDS */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#FAF8F3] p-5 rounded-xl border border-[#E2DCCB] shadow-sm hover:border-[#143626] transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#55695D] uppercase tracking-wider">
                {isTeacher ? 'Grade 7 Stream' : isSuperAdmin ? 'Staff Accounts' : 'Total Enrollment'}
              </span>
              <div className="p-2 bg-[#EAE4D4] text-[#143626] rounded-lg">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-extrabold text-[#143626]">
                {isTeacher ? '32 Scholars' : isSuperAdmin ? '8 Provisioned Staff' : `${totalStudents} Scholars`}
              </div>
              <div className="text-[11px] text-[#425549] mt-1 flex items-center space-x-2">
                <span className="bg-pink-100 text-pink-800 px-1.5 py-0.5 rounded font-medium">52% Girls</span>
                <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-medium">48% Boys</span>
              </div>
            </div>
          </div>

          <div className="bg-[#FAF8F3] p-5 rounded-xl border border-[#E2DCCB] shadow-sm hover:border-[#143626] transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#55695D] uppercase tracking-wider">Class Tiers</span>
              <div className="p-2 bg-[#EAE4D4] text-[#143626] rounded-lg">
                <GraduationCap className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-extrabold text-[#143626]">Grade 1 to 10</div>
              <p className="text-[11px] text-[#55695D] mt-1">
                Lower & Upper Primary, JSS, Senior Sec
              </p>
            </div>
          </div>

          <div className="bg-[#FAF8F3] p-5 rounded-xl border border-[#E2DCCB] shadow-sm hover:border-[#143626] transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#55695D] uppercase tracking-wider">Term 2 Fee Ledger</span>
              <div className="p-2 bg-[#EAE4D4] text-emerald-800 rounded-lg">
                <CreditCard className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-extrabold text-[#143626]">{collectionPercentage}% <span className="text-xs text-emerald-700 font-semibold">Collected</span></div>
              <div className="w-full bg-[#E2DCCB] rounded-full h-2 mt-2">
                <div className="bg-[#143626] h-2 rounded-full" style={{ width: `${collectionPercentage}%` }}></div>
              </div>
              <div className="text-[10px] text-[#55695D] mt-1.5 flex justify-between">
                <span>Collected: KSh {(totalCollected / 1000).toFixed(0)}k</span>
                <span className="text-amber-800 font-medium">Pending: KSh {(totalBalance / 1000).toFixed(0)}k</span>
              </div>
            </div>
          </div>

          <div className="bg-[#FAF8F3] p-5 rounded-xl border border-[#E2DCCB] shadow-sm hover:border-[#143626] transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#55695D] uppercase tracking-wider">CBC Assessment</span>
              <div className="p-2 bg-[#EAE4D4] text-[#143626] rounded-lg">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-extrabold text-[#143626]">92% <span className="text-xs font-normal text-slate-500">Graded</span></div>
              <p className="text-[11px] text-emerald-700 mt-1 font-medium flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Report Cards Ready for Term 2</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Middle Layout Grid: Tailored for Student vs Staff/Admin */}
      {isStudent ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Schedule Preview for Student */}
          <div className="lg:col-span-2 bg-[#FAF8F3] p-5 rounded-xl border border-[#E2DCCB] shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E2D0] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#143626] font-serif-school">
                  My Grade 7 Subject Schedule (Today)
                </h3>
                <p className="text-xs text-[#55695D]">Vispa Junior Secondary School Timetable</p>
              </div>
              <button
                onClick={() => onNavigate('timetable')}
                className="text-xs font-bold text-[#143626] bg-[#EAE4D4] hover:bg-[#DCD5C3] px-3 py-1.5 rounded-lg flex items-center space-x-1"
              >
                <span>Full Timetable</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              <div className="p-3 bg-[#F3EFE6] rounded-lg border border-[#E2DCCB] flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3">
                  <span className="p-2 bg-[#143626] text-[#EAD8A6] rounded font-mono font-bold">08:00 AM</span>
                  <div>
                    <div className="font-bold text-[#143626]">Mathematics (Algebra & Geometry)</div>
                    <div className="text-[10px] text-[#55695D]">Tr. David Maina • JSS Class Block 7A</div>
                  </div>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">Active</span>
              </div>

              <div className="p-3 bg-[#F3EFE6] rounded-lg border border-[#E2DCCB] flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3">
                  <span className="p-2 bg-[#143626] text-[#EAD8A6] rounded font-mono font-bold">09:30 AM</span>
                  <div>
                    <div className="font-bold text-[#143626]">Integrated Science (Living Things)</div>
                    <div className="text-[10px] text-[#55695D]">Tr. Caroline Chebet • Science Lab 1</div>
                  </div>
                </div>
                <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded">Next</span>
              </div>

              <div className="p-3 bg-[#F3EFE6] rounded-lg border border-[#E2DCCB] flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3">
                  <span className="p-2 bg-[#143626] text-[#EAD8A6] rounded font-mono font-bold">11:10 AM</span>
                  <div>
                    <div className="font-bold text-[#143626]">Kiswahili Lugha na Insha</div>
                    <div className="text-[10px] text-[#55695D]">Tr. Samuel Omondi • Room 14</div>
                  </div>
                </div>
                <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">Upcoming</span>
              </div>
            </div>
          </div>

          {/* Student Homework & Reminders */}
          <div className="bg-[#FAF8F3] p-5 rounded-xl border border-[#E2DCCB] shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3 border-b border-[#E8E2D0] pb-2">
                <h3 className="text-base font-bold text-[#143626] font-serif-school">
                  Homework & Study Goals
                </h3>
                <span className="text-[10px] bg-purple-100 text-purple-900 font-bold px-2 py-0.5 rounded">
                  CBC Term 2
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3 bg-[#F3EFE6] rounded-lg border border-[#E2DCCB] space-y-1">
                  <div className="font-bold text-[#143626]">Science Project: Plant Photosynthesis</div>
                  <div className="text-[10px] text-[#55695D]">Due: Friday 25th July • Tr. Caroline</div>
                </div>

                <div className="p-3 bg-[#F3EFE6] rounded-lg border border-[#E2DCCB] space-y-1">
                  <div className="font-bold text-[#143626]">Math Exercise: Fractions & Decimals</div>
                  <div className="text-[10px] text-[#55695D]">Due: Tomorrow 08:00 AM • Tr. David</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('ai-antigravity')}
              className="w-full mt-4 bg-[#143626] hover:bg-[#214E36] text-[#FAF8F3] text-xs font-bold py-2.5 rounded-lg transition-all text-center flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4 text-[#C99A43]" />
              <span>Ask AI Tutor for Homework Help</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Grade Population Distribution */}
          <div className="lg:col-span-2 bg-[#FAF8F3] p-5 rounded-xl border border-[#E2DCCB] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#143626] font-serif-school">
                  Grade 1 to 10 Scholar Population Distribution
                </h3>
                <p className="text-xs text-[#55695D]">Mixed Day & Boarding Streams at Vispa Academy</p>
              </div>
              <button 
                onClick={() => onNavigate('students')}
                className="text-xs font-semibold text-[#143626] hover:underline flex items-center space-x-1"
              >
                <span>View Directory</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 text-center pt-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((g) => {
                const count = gradeCounts[g];
                const max = 100;
                const heightPct = Math.round((count / max) * 100);
                const isJss = g >= 7 && g <= 9;
                const isSenior = g === 10;
                const isMyClass = isTeacher && g === (currentRole.assignedGrade || 7);
                return (
                  <div key={g} className={`flex flex-col items-center group p-1 rounded-lg transition-all ${isMyClass ? 'bg-[#EAD8A6]/30 border border-[#C99A43]' : ''}`}>
                    <div className="text-[11px] font-bold text-[#143626] mb-1">{count}</div>
                    <div className="w-full bg-[#E8E2D0] rounded-t h-28 flex items-end p-1 relative overflow-hidden">
                      <div 
                        className={`w-full rounded-t transition-all ${
                          isSenior 
                            ? 'bg-[#C99A43]' 
                            : isJss 
                              ? 'bg-[#214E36]' 
                              : 'bg-[#3A6B50]'
                        }`}
                        style={{ height: `${heightPct}%` }}
                      ></div>
                    </div>
                    <div className="mt-2 text-xs font-bold text-[#2C3E35]">G{g}</div>
                    <div className="text-[9px] text-[#6B7A70]">
                      {isMyClass ? 'My Stream' : g <= 3 ? 'Lower' : g <= 6 ? 'Upper' : g <= 9 ? 'JSS' : 'Senior'}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 pt-3 border-t border-[#E8E2D0] flex flex-wrap items-center justify-between text-xs text-[#55695D] gap-2">
              <div className="flex items-center space-x-4">
                <span className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded bg-[#3A6B50]"></span>
                  <span>Primary (G1-6)</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded bg-[#214E36]"></span>
                  <span>JSS (G7-9)</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded bg-[#C99A43]"></span>
                  <span>Senior (G10)</span>
                </span>
              </div>
              <span className="font-semibold text-[#143626]">Average Stream Size: 41 Scholars</span>
            </div>
          </div>

          {/* Live M-Pesa Fee Collections Log */}
          <div className="bg-[#FAF8F3] p-5 rounded-xl border border-[#E2DCCB] shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 bg-[#143626] text-[#EAD8A6] rounded">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-[#143626] font-serif-school">
                    M-Pesa Paybill Receipts
                  </h3>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                  PAYBILL: 400200
                </span>
              </div>
              <p className="text-xs text-[#55695D] mb-4">Real-time payments received via Vispa M-Pesa account</p>

              <div className="space-y-3">
                {transactions.slice(0, 4).map((tx) => (
                  <div key={tx.id} className="p-3 bg-[#F3EFE6] rounded-lg border border-[#E2DCCB] flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-[#143626]">{tx.studentName}</div>
                      <div className="text-[10px] text-[#55695D] flex items-center space-x-2">
                        <span className="font-mono text-[#143626]">{tx.mpesaCode}</span>
                        <span>•</span>
                        <span>Grade {tx.grade}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-emerald-800">+ KSh {tx.amount.toLocaleString()}</div>
                      <div className="text-[9px] text-slate-500">{tx.timestamp.split(' ')[1]} {tx.timestamp.split(' ')[2]}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => onNavigate('fees')}
              className="w-full mt-4 bg-[#143626] hover:bg-[#214E36] text-[#FAF8F3] text-xs font-bold py-2 rounded-lg transition-all text-center"
            >
              {isParent ? 'View M-Pesa Payment Statement' : 'Open Full Fee Ledger'}
            </button>
          </div>
        </div>
      )}

      {/* Bottom Row: Upcoming School Events & Quick Management Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Vispa Events */}
        <div className="bg-[#FAF8F3] p-5 rounded-xl border border-[#E2DCCB] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-[#143626]" />
              <h3 className="text-base font-bold text-[#143626] font-serif-school">
                Vispa School Academic Calendar
              </h3>
            </div>
            <span className="text-xs text-[#55695D] font-medium">Term 2 - 2026</span>
          </div>

          <div className="space-y-3">
            {SCHOOL_EVENTS.map((ev) => (
              <div key={ev.id} className="p-3 bg-[#F3EFE6] rounded-lg border border-[#E2DCCB] flex items-start space-x-3">
                <div className="bg-[#143626] text-[#FAF8F3] p-2 rounded text-center min-w-[50px]">
                  <div className="text-[10px] uppercase font-bold text-[#C99A43]">{ev.date.split(' ')[0]}</div>
                  <div className="text-base font-extrabold leading-none">{ev.date.split(' ')[1].replace(',', '')}</div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-[#143626]">{ev.title}</h4>
                    <span className="text-[10px] bg-[#E2DCCB] text-[#143626] px-1.5 py-0.5 rounded font-semibold">
                      {ev.category}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#55695D] mt-1 flex items-center space-x-3">
                    <span>🕒 {ev.time}</span>
                    <span>📍 {ev.venue}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Shortcuts - TAILORED DYNAMICALLY PER ROLE */}
        <div className="bg-[#FAF8F3] p-5 rounded-xl border border-[#E2DCCB] shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-[#143626] font-serif-school mb-1">
              {isSuperAdmin && "Super Admin System Shortcuts"}
              {isPrincipal && "Headteacher Academic Shortcuts"}
              {isTeacher && "Teacher Portal Academic Actions"}
              {isFinance && "Bursar Financial Quick Actions"}
              {isParent && "Parent Portal Scholar Shortcuts"}
              {isStudent && "Student Portal Quick Access"}
              {isSupportStaff && "Departmental Operational Shortcuts"}
            </h3>
            <p className="text-xs text-[#55695D] mb-4">
              {isSuperAdmin && "Provision staff accounts and configure portal security"}
              {isPrincipal && "Oversee school enrollment, CBC reports, and teacher schedules"}
              {isTeacher && "Quick tools for CBC grading, timetables, and lesson plans"}
              {isFinance && "Paybill 400200 reconciliation and SMS reminders"}
              {isParent && "Access scholar report card, fee status, and school info"}
              {isStudent && "Access personal report card, class schedule, and AI tutor"}
              {isSupportStaff && "Access departmental logs and school information"}
            </p>

            <div className="grid grid-cols-2 gap-3">
              {/* SUPER ADMIN SHORTCUTS */}
              {isSuperAdmin && (
                <>
                  <button
                    onClick={() => onNavigate('users')}
                    className="p-3 bg-[#F3EFE6] hover:bg-[#EAE4D5] border border-[#E2DCCB] rounded-lg text-left transition-all group"
                  >
                    <div className="p-2 bg-[#143626] text-[#FAF8F3] rounded w-fit mb-2 group-hover:scale-105 transition-transform">
                      <UserCheck className="w-4 h-4 text-[#C99A43]" />
                    </div>
                    <div className="text-xs font-bold text-[#143626]">Create Staff Account</div>
                    <div className="text-[10px] text-[#55695D]">Provision Principal, Teachers, etc.</div>
                  </button>

                  <button
                    onClick={onOpenAddStudent}
                    className="p-3 bg-[#F3EFE6] hover:bg-[#EAE4D5] border border-[#E2DCCB] rounded-lg text-left transition-all group"
                  >
                    <div className="p-2 bg-[#C99A43] text-[#122C20] rounded w-fit mb-2 group-hover:scale-105 transition-transform">
                      <UserPlus className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold text-[#143626]">Enroll New Scholar</div>
                    <div className="text-[10px] text-[#55695D]">Register G1-10 student</div>
                  </button>

                  <button
                    onClick={() => onNavigate('cbc')}
                    className="p-3 bg-[#F3EFE6] hover:bg-[#EAE4D5] border border-[#E2DCCB] rounded-lg text-left transition-all group"
                  >
                    <div className="p-2 bg-[#214E36] text-[#FAF8F3] rounded w-fit mb-2 group-hover:scale-105 transition-transform">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold text-[#143626]">CBC Assessment Hub</div>
                    <div className="text-[10px] text-[#55695D]">Oversee all grade reports</div>
                  </button>

                  <button
                    onClick={() => onNavigate('users')}
                    className="p-3 bg-[#F3EFE6] hover:bg-[#EAE4D5] border border-[#E2DCCB] rounded-lg text-left transition-all group"
                  >
                    <div className="p-2 bg-[#3A6B50] text-[#FAF8F3] rounded w-fit mb-2 group-hover:scale-105 transition-transform">
                      <Users className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold text-[#143626]">Institutional Directory</div>
                    <div className="text-[10px] text-[#55695D]">Manage system accounts</div>
                  </button>
                </>
              )}

              {/* PRINCIPAL SHORTCUTS */}
              {isPrincipal && (
                <>
                  <button
                    onClick={onOpenAddStudent}
                    className="p-3 bg-[#F3EFE6] hover:bg-[#EAE4D5] border border-[#E2DCCB] rounded-lg text-left transition-all group"
                  >
                    <div className="p-2 bg-[#C99A43] text-[#122C20] rounded w-fit mb-2 group-hover:scale-105 transition-transform">
                      <UserPlus className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold text-[#143626]">Enroll New Scholar</div>
                    <div className="text-[10px] text-[#55695D]">Register G1-10 student</div>
                  </button>

                  <button
                    onClick={() => onNavigate('cbc')}
                    className="p-3 bg-[#F3EFE6] hover:bg-[#EAE4D5] border border-[#E2DCCB] rounded-lg text-left transition-all group"
                  >
                    <div className="p-2 bg-[#214E36] text-[#FAF8F3] rounded w-fit mb-2 group-hover:scale-105 transition-transform">
                      <GraduationCap className="w-4 h-4 text-[#C99A43]" />
                    </div>
                    <div className="text-xs font-bold text-[#143626]">CBC Assessment Hub</div>
                    <div className="text-[10px] text-[#55695D]">Review all class grades</div>
                  </button>

                  <button
                    onClick={() => onNavigate('timetable')}
                    className="p-3 bg-[#F3EFE6] hover:bg-[#EAE4D5] border border-[#E2DCCB] rounded-lg text-left transition-all group"
                  >
                    <div className="p-2 bg-[#143626] text-[#FAF8F3] rounded w-fit mb-2 group-hover:scale-105 transition-transform">
                      <BookOpen className="w-4 h-4 text-[#C99A43]" />
                    </div>
                    <div className="text-xs font-bold text-[#143626]">Master Timetable</div>
                    <div className="text-[10px] text-[#55695D]">Class schedules & venues</div>
                  </button>

                  <button
                    onClick={() => onNavigate('students')}
                    className="p-3 bg-[#F3EFE6] hover:bg-[#EAE4D5] border border-[#E2DCCB] rounded-lg text-left transition-all group"
                  >
                    <div className="p-2 bg-[#3A6B50] text-[#FAF8F3] rounded w-fit mb-2 group-hover:scale-105 transition-transform">
                      <Users className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold text-[#143626]">Students Directory</div>
                    <div className="text-[10px] text-[#55695D]">840 scholars & parents</div>
                  </button>
                </>
              )}

              {/* TEACHER SHORTCUTS */}
              {isTeacher && (
                <>
                  <button
                    onClick={() => onNavigate('cbc')}
                    className="p-3 bg-[#F3EFE6] hover:bg-[#EAE4D5] border border-[#E2DCCB] rounded-lg text-left transition-all group"
                  >
                    <div className="p-2 bg-[#143626] text-[#FAF8F3] rounded w-fit mb-2 group-hover:scale-105 transition-transform">
                      <GraduationCap className="w-4 h-4 text-[#C99A43]" />
                    </div>
                    <div className="text-xs font-bold text-[#143626]">Grade 7 Assessment</div>
                    <div className="text-[10px] text-[#55695D]">Enter EE/ME ratings</div>
                  </button>

                  <button
                    onClick={() => onNavigate('ai-antigravity')}
                    className="p-3 bg-[#F3EFE6] hover:bg-[#EAE4D5] border border-[#E2DCCB] rounded-lg text-left transition-all group"
                  >
                    <div className="p-2 bg-[#C99A43] text-[#122C20] rounded w-fit mb-2 group-hover:scale-105 transition-transform">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold text-[#143626]">AI Lesson Planner</div>
                    <div className="text-[10px] text-[#55695D]">Generate KICD schemes</div>
                  </button>

                  <button
                    onClick={() => onNavigate('timetable')}
                    className="p-3 bg-[#F3EFE6] hover:bg-[#EAE4D5] border border-[#E2DCCB] rounded-lg text-left transition-all group"
                  >
                    <div className="p-2 bg-[#214E36] text-[#FAF8F3] rounded w-fit mb-2 group-hover:scale-105 transition-transform">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold text-[#143626]">Class Timetable</div>
                    <div className="text-[10px] text-[#55695D]">View subject schedule</div>
                  </button>

                  <button
                    onClick={() => onNavigate('students')}
                    className="p-3 bg-[#F3EFE6] hover:bg-[#EAE4D5] border border-[#E2DCCB] rounded-lg text-left transition-all group"
                  >
                    <div className="p-2 bg-[#3A6B50] text-[#FAF8F3] rounded w-fit mb-2 group-hover:scale-105 transition-transform">
                      <Users className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold text-[#143626]">Grade 7 Directory</div>
                    <div className="text-[10px] text-[#55695D]">Scholar roster & parent contacts</div>
                  </button>
                </>
              )}

              {/* FINANCE / BURSAR SHORTCUTS */}
              {isFinance && (
                <>
                  <button
                    onClick={() => onNavigate('fees')}
                    className="p-3 bg-[#F3EFE6] hover:bg-[#EAE4D5] border border-[#E2DCCB] rounded-lg text-left transition-all group"
                  >
                    <div className="p-2 bg-[#143626] text-[#FAF8F3] rounded w-fit mb-2 group-hover:scale-105 transition-transform">
                      <CreditCard className="w-4 h-4 text-[#C99A43]" />
                    </div>
                    <div className="text-xs font-bold text-[#143626]">Record M-Pesa Receipt</div>
                    <div className="text-[10px] text-[#55695D]">Enter transaction code</div>
                  </button>

                  <button
                    onClick={() => onNavigate('fees')}
                    className="p-3 bg-[#F3EFE6] hover:bg-[#EAE4D5] border border-[#E2DCCB] rounded-lg text-left transition-all group"
                  >
                    <div className="p-2 bg-[#C99A43] text-[#122C20] rounded w-fit mb-2 group-hover:scale-105 transition-transform">
                      <PhoneCall className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold text-[#143626]">Bulk SMS Notice</div>
                    <div className="text-[10px] text-[#55695D]">Send fee balance reminders</div>
                  </button>

                  <button
                    onClick={() => onNavigate('students')}
                    className="p-3 bg-[#F3EFE6] hover:bg-[#EAE4D5] border border-[#E2DCCB] rounded-lg text-left transition-all group"
                  >
                    <div className="p-2 bg-[#214E36] text-[#FAF8F3] rounded w-fit mb-2 group-hover:scale-105 transition-transform">
                      <Users className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold text-[#143626]">Defaulters List</div>
                    <div className="text-[10px] text-[#55695D]">Pending balance directory</div>
                  </button>

                  <button
                    onClick={() => onNavigate('school-info')}
                    className="p-3 bg-[#F3EFE6] hover:bg-[#EAE4D5] border border-[#E2DCCB] rounded-lg text-left transition-all group"
                  >
                    <div className="p-2 bg-[#3A6B50] text-[#FAF8F3] rounded w-fit mb-2 group-hover:scale-105 transition-transform">
                      <Building className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold text-[#143626]">Bank & Paybill Specs</div>
                    <div className="text-[10px] text-[#55695D]">Coop Bank & Safaricom 400200</div>
                  </button>
                </>
              )}

              {/* PARENT SHORTCUTS */}
              {isParent && (
                <>
                  <button
                    onClick={() => onNavigate('cbc')}
                    className="p-3 bg-[#F3EFE6] hover:bg-[#EAE4D5] border border-[#E2DCCB] rounded-lg text-left transition-all group"
                  >
                    <div className="p-2 bg-[#143626] text-[#FAF8F3] rounded w-fit mb-2 group-hover:scale-105 transition-transform">
                      <FileText className="w-4 h-4 text-[#C99A43]" />
                    </div>
                    <div className="text-xs font-bold text-[#143626]">Scholar Report Card</div>
                    <div className="text-[10px] text-[#55695D]">View Term 2 CBC grades</div>
                  </button>

                  <button
                    onClick={() => onNavigate('fees')}
                    className="p-3 bg-[#F3EFE6] hover:bg-[#EAE4D5] border border-[#E2DCCB] rounded-lg text-left transition-all group"
                  >
                    <div className="p-2 bg-[#C99A43] text-[#122C20] rounded w-fit mb-2 group-hover:scale-105 transition-transform">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold text-[#143626]">Fee Balance & M-Pesa</div>
                    <div className="text-[10px] text-[#55695D]">Paybill 400200 instructions</div>
                  </button>

                  <button
                    onClick={() => onNavigate('timetable')}
                    className="p-3 bg-[#F3EFE6] hover:bg-[#EAE4D5] border border-[#E2DCCB] rounded-lg text-left transition-all group"
                  >
                    <div className="p-2 bg-[#214E36] text-[#FAF8F3] rounded w-fit mb-2 group-hover:scale-105 transition-transform">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold text-[#143626]">Grade 7 Timetable</div>
                    <div className="text-[10px] text-[#55695D]">Daily subject schedule</div>
                  </button>

                  <button
                    onClick={() => onNavigate('school-info')}
                    className="p-3 bg-[#F3EFE6] hover:bg-[#EAE4D5] border border-[#E2DCCB] rounded-lg text-left transition-all group"
                  >
                    <div className="p-2 bg-[#3A6B50] text-[#FAF8F3] rounded w-fit mb-2 group-hover:scale-105 transition-transform">
                      <School className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold text-[#143626]">School Directory</div>
                    <div className="text-[10px] text-[#55695D]">Hotline & location map</div>
                  </button>
                </>
              )}

              {/* STUDENT SHORTCUTS */}
              {isStudent && (
                <>
                  <button
                    onClick={() => onNavigate('cbc')}
                    className="p-3 bg-[#F3EFE6] hover:bg-[#EAE4D5] border border-[#E2DCCB] rounded-lg text-left transition-all group"
                  >
                    <div className="p-2 bg-[#143626] text-[#FAF8F3] rounded w-fit mb-2 group-hover:scale-105 transition-transform">
                      <GraduationCap className="w-4 h-4 text-[#C99A43]" />
                    </div>
                    <div className="text-xs font-bold text-[#143626]">My Report Card</div>
                    <div className="text-[10px] text-[#55695D]">View my CBC assessment</div>
                  </button>

                  <button
                    onClick={() => onNavigate('timetable')}
                    className="p-3 bg-[#F3EFE6] hover:bg-[#EAE4D5] border border-[#E2DCCB] rounded-lg text-left transition-all group"
                  >
                    <div className="p-2 bg-[#C99A43] text-[#122C20] rounded w-fit mb-2 group-hover:scale-105 transition-transform">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold text-[#143626]">My Subject Schedule</div>
                    <div className="text-[10px] text-[#55695D]">View daily class timetable</div>
                  </button>

                  <button
                    onClick={() => onNavigate('ai-antigravity')}
                    className="p-3 bg-[#F3EFE6] hover:bg-[#EAE4D5] border border-[#E2DCCB] rounded-lg text-left transition-all group"
                  >
                    <div className="p-2 bg-[#214E36] text-[#FAF8F3] rounded w-fit mb-2 group-hover:scale-105 transition-transform">
                      <Sparkles className="w-4 h-4 text-[#F3D78A]" />
                    </div>
                    <div className="text-xs font-bold text-[#143626]">AI Antigravity Study Tutor</div>
                    <div className="text-[10px] text-[#55695D]">Get instant homework help</div>
                  </button>

                  <button
                    onClick={() => onNavigate('school-info')}
                    className="p-3 bg-[#F3EFE6] hover:bg-[#EAE4D5] border border-[#E2DCCB] rounded-lg text-left transition-all group"
                  >
                    <div className="p-2 bg-[#3A6B50] text-[#FAF8F3] rounded w-fit mb-2 group-hover:scale-105 transition-transform">
                      <School className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold text-[#143626]">School Info & Houses</div>
                    <div className="text-[10px] text-[#55695D]">Simba House & Co-curriculars</div>
                  </button>
                </>
              )}

              {/* SUPPORT STAFF SHORTCUTS */}
              {isSupportStaff && (
                <>
                  <button
                    onClick={() => onNavigate('students')}
                    className="p-3 bg-[#F3EFE6] hover:bg-[#EAE4D5] border border-[#E2DCCB] rounded-lg text-left transition-all group"
                  >
                    <div className="p-2 bg-[#143626] text-[#FAF8F3] rounded w-fit mb-2 group-hover:scale-105 transition-transform">
                      <Users className="w-4 h-4 text-[#C99A43]" />
                    </div>
                    <div className="text-xs font-bold text-[#143626]">Students Roster</div>
                    <div className="text-[10px] text-[#55695D]">Departmental student lookup</div>
                  </button>

                  <button
                    onClick={() => onNavigate('school-info')}
                    className="p-3 bg-[#F3EFE6] hover:bg-[#EAE4D5] border border-[#E2DCCB] rounded-lg text-left transition-all group"
                  >
                    <div className="p-2 bg-[#3A6B50] text-[#FAF8F3] rounded w-fit mb-2 group-hover:scale-105 transition-transform">
                      <School className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold text-[#143626]">Facilities Directory</div>
                    <div className="text-[10px] text-[#55695D]">Sanatorium, Library, Front Desk</div>
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="mt-5 p-3 bg-[#143626] text-[#FAF8F3] rounded-lg text-xs flex items-center justify-between">
            <div>
              <span className="font-bold text-[#EAD8A6]">Vispa Helpdesk & Hotline:</span>
              <span className="ml-2 text-[#C3BDAD]">+254 700 847 721</span>
            </div>
            <button 
              onClick={() => onNavigate('school-info')}
              className="text-[#EAD8A6] underline font-semibold hover:text-white"
            >
              School Specs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

