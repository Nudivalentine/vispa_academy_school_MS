import React, { useState } from 'react';
import { UserRole, GradeLevel, Student } from '../types';
import { 
  X, 
  ShieldCheck, 
  UserCheck, 
  CreditCard, 
  Users, 
  KeyRound, 
  Lock, 
  Mail, 
  Phone, 
  CheckCircle2, 
  UserPlus,
  LogIn,
  AlertTriangle,
  GraduationCap,
  Sparkles,
  RefreshCw,
  Building2,
  Stethoscope,
  BookOpen,
  Receipt
} from 'lucide-react';
import logoImg from '../assets/images/vispa_school_logo_1784781059330.jpg';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: UserRole;
  allRoles: UserRole[];
  students: Student[];
  onSelectRole: (role: UserRole) => void;
  onRegisterUser: (newRole: UserRole) => void;
  onUpdateUserPassword?: (userId: string, newPass: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentRole,
  allRoles,
  students,
  onSelectRole,
  onRegisterUser,
  onUpdateUserPassword
}) => {
  const [activeMode, setActiveMode] = useState<'login' | 'register'>('login');
  
  // Login Category Tab
  const [loginCategory, setLoginCategory] = useState<'staff' | 'student' | 'parent'>('staff');

  // Credentials State
  const [identifier, setIdentifier] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Temporary Password Intercept State
  const [pendingUser, setPendingUser] = useState<UserRole | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passError, setPassError] = useState<string | null>(null);

  // Self-Registration State (ONLY Parents and Students)
  const [regType, setRegType] = useState<'parent' | 'student'>('parent');
  const [regName, setRegName] = useState('');
  const [regAdmissionNo, setRegAdmissionNo] = useState('');
  const [regPhone, setRegPhone] = useState('07');
  const [regEmail, setRegEmail] = useState('');
  const [regGrade, setRegGrade] = useState<GradeLevel>(1);
  const [regPassword, setRegPassword] = useState('');
  const [regError, setRegError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Handle Login Submit
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const term = identifier.trim().toLowerCase();
    const pass = passwordInput.trim();

    let matchedUser: UserRole | undefined;

    if (loginCategory === 'staff') {
      // Username or Email match for Staff & Super Admin
      matchedUser = allRoles.find((r) => {
        const emailMatch = r.email && r.email.toLowerCase() === term;
        const userMatch = r.usernameOrEmail && r.usernameOrEmail.toLowerCase() === term;
        const isStaffRole = r.id !== 'parent' && r.id !== 'student';
        return isStaffRole && (emailMatch || userMatch || r.userName.toLowerCase().includes(term));
      });
    } else if (loginCategory === 'student') {
      // Admission Number match for Students
      matchedUser = allRoles.find((r) => {
        const admMatch = r.admissionNo && r.admissionNo.toLowerCase().replace(/\s+/g, '') === term.replace(/\s+/g, '');
        return r.id === 'student' && admMatch;
      });

      // Fallback: check if admission matches students list
      if (!matchedUser) {
        const foundStudent = students.find((s) => s.admissionNo.toLowerCase().replace(/\s+/g, '') === term.replace(/\s+/g, ''));
        if (foundStudent) {
          matchedUser = {
            id: 'student',
            label: 'Student / Scholar',
            subtitle: `Grade ${foundStudent.grade} - ${foundStudent.stream}`,
            userName: `${foundStudent.firstName} ${foundStudent.lastName}`,
            avatar: 'ST',
            admissionNo: foundStudent.admissionNo,
            assignedGrade: foundStudent.grade,
            password: 'student123',
            isTemporaryPassword: false
          };
        }
      }
    } else if (loginCategory === 'parent') {
      // Phone Number match for Parents
      matchedUser = allRoles.find((r) => {
        const cleanPhoneInput = term.replace(/\D/g, '');
        const cleanUserPhone = (r.phone || '').replace(/\D/g, '');
        const phoneMatch = cleanPhoneInput.length > 5 && cleanUserPhone.includes(cleanPhoneInput);
        return r.id === 'parent' && phoneMatch;
      });

      // Fallback check in student guardian list
      if (!matchedUser) {
        const cleanPhoneInput = term.replace(/\D/g, '');
        const foundStudent = students.find((s) => s.guardianPhone.replace(/\D/g, '').includes(cleanPhoneInput));
        if (foundStudent) {
          matchedUser = {
            id: 'parent',
            label: 'Parent / Guardian',
            subtitle: `Guardian of ${foundStudent.firstName} ${foundStudent.lastName}`,
            userName: foundStudent.guardianName,
            avatar: 'PAR',
            phone: foundStudent.guardianPhone,
            email: foundStudent.guardianEmail,
            admissionNo: foundStudent.admissionNo,
            password: 'parent123',
            isTemporaryPassword: false
          };
        }
      }
    }

    if (!matchedUser) {
      setLoginError(
        loginCategory === 'staff'
          ? 'Invalid staff username or email. Staff accounts are created strictly by the Super Administrator.'
          : loginCategory === 'student'
          ? 'No student found matching this Admission Number. Please verify or self-register.'
          : 'No parent account found matching this Phone Number. Please check or self-register.'
      );
      return;
    }

    // Password Check
    if (matchedUser.password && pass && matchedUser.password !== pass) {
      setLoginError('Incorrect password entered. Please try again.');
      return;
    }

    // Check if First Login Temporary Password flag is set!
    if (matchedUser.isTemporaryPassword) {
      setPendingUser(matchedUser);
      return;
    }

    // Successful Direct Login
    onSelectRole(matchedUser);
    setSuccessMsg(`Authenticated successfully as ${matchedUser.userName} (${matchedUser.label})`);
    setTimeout(() => {
      setSuccessMsg(null);
      onClose();
    }, 1000);
  };

  // Handle Temporary Password Update Submit
  const handlePasswordChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPassError(null);

    if (newPassword.length < 6) {
      setPassError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPassError('New passwords do not match. Please re-enter carefully.');
      return;
    }

    if (!pendingUser) return;

    const updatedUser: UserRole = {
      ...pendingUser,
      password: newPassword,
      isTemporaryPassword: false
    };

    if (onUpdateUserPassword) {
      onUpdateUserPassword(pendingUser.id, newPassword);
    }

    onSelectRole(updatedUser);
    setSuccessMsg(`Password updated successfully! Welcome to your dashboard, ${updatedUser.userName}.`);
    setPendingUser(null);

    setTimeout(() => {
      setSuccessMsg(null);
      onClose();
    }, 1200);
  };

  // Handle Self-Registration Submit (Parents & Students ONLY)
  const handleSelfRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    if (!regName || !regPassword) {
      setRegError('Please fill in all required fields.');
      return;
    }

    if (regType === 'parent') {
      // Validate linked student admission number
      const cleanAdm = regAdmissionNo.trim().toLowerCase().replace(/\s+/g, '');
      const validStudent = students.find(
        (s) => s.admissionNo.toLowerCase().replace(/\s+/g, '') === cleanAdm
      );

      if (!validStudent) {
        setRegError(
          `Invalid Admission Number (${regAdmissionNo}). Parents must be linked to a valid student registered at Vispa Academy (e.g. VIS/2024/012).`
        );
        return;
      }

      const newParentRole: UserRole = {
        id: 'parent',
        label: 'Parent / Scholar Guardian',
        subtitle: `Parent of ${validStudent.firstName} ${validStudent.lastName}`,
        userName: regName,
        avatar: 'PAR',
        phone: regPhone,
        email: regEmail || validStudent.guardianEmail,
        admissionNo: validStudent.admissionNo,
        password: regPassword,
        isTemporaryPassword: false,
        registeredAt: new Date().toISOString().split('T')[0]
      };

      onRegisterUser(newParentRole);
      onSelectRole(newParentRole);
      setSuccessMsg(`Parent registration successful! Welcome, ${regName}.`);
      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
      }, 1200);

    } else if (regType === 'student') {
      // Validate student admission number
      const cleanAdm = regAdmissionNo.trim().toLowerCase().replace(/\s+/g, '');
      const validStudent = students.find(
        (s) => s.admissionNo.toLowerCase().replace(/\s+/g, '') === cleanAdm
      );

      if (!validStudent) {
        setRegError(
          `Admission Number (${regAdmissionNo}) not found in Vispa Academy register. Only enrolled students with a valid admission number can register.`
        );
        return;
      }

      const newStudentRole: UserRole = {
        id: 'student',
        label: 'Student / Scholar',
        subtitle: `Grade ${validStudent.grade} - ${validStudent.stream}`,
        userName: `${validStudent.firstName} ${validStudent.lastName}`,
        avatar: 'ST',
        admissionNo: validStudent.admissionNo,
        assignedGrade: validStudent.grade,
        password: regPassword,
        isTemporaryPassword: false,
        registeredAt: new Date().toISOString().split('T')[0]
      };

      onRegisterUser(newStudentRole);
      onSelectRole(newStudentRole);
      setSuccessMsg(`Student registration complete! Welcome to Vispa Learning Portal, ${newStudentRole.userName}.`);
      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-sm">
      <div className="bg-[#FAF8F3] rounded-2xl max-w-xl w-full border-2 border-[#143626] shadow-2xl overflow-hidden animate-fadeIn my-6">
        
        {/* Header Banner */}
        <div className="bg-[#143626] text-[#FAF8F3] p-5 flex items-center justify-between border-b border-[#214E36]">
          <div className="flex items-center space-x-3">
            <img 
              src={logoImg} 
              alt="Vispa Crest" 
              className="w-10 h-10 rounded-full border-2 border-[#C99A43] object-cover bg-white"
              referrerPolicy="no-referrer"
            />
            <div>
              <h3 className="text-base font-bold font-serif-school text-[#FAF8F3]">
                Vispa Academy Authentication Portal
              </h3>
              <p className="text-xs text-[#EAD8A6]">
                Institutional Security & Role Access Management
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-[#214E36] rounded text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Alert Banner */}
        {successMsg && (
          <div className="bg-emerald-800 text-[#FAF8F3] p-3 text-xs font-bold flex items-center justify-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-[#C99A43]" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* SCREEN 1: TEMPORARY PASSWORD CHANGE REQUIRED */}
        {pendingUser ? (
          <div className="p-6 space-y-5">
            <div className="bg-amber-100 border border-amber-300 p-4 rounded-xl text-amber-900 text-xs space-y-1">
              <div className="font-bold flex items-center space-x-1 text-sm">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                <span>First Login: Password Change Required</span>
              </div>
              <p>
                Hello <strong>{pendingUser.userName}</strong> ({pendingUser.label}). Your account was provisioned with a temporary password. For security compliance, please set your permanent password before accessing the dashboard.
              </p>
            </div>

            <form onSubmit={handlePasswordChangeSubmit} className="space-y-4 text-xs text-[#143626]">
              <div>
                <label className="block font-bold text-[#55695D] uppercase text-[10px] mb-1">
                  New Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#55695D]" />
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full bg-[#F3EFE6] border border-[#D5CEBC] rounded-lg pl-9 p-2.5 font-medium focus:outline-none focus:border-[#143626]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#55695D] uppercase text-[10px] mb-1">
                  Confirm New Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#55695D]" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-type new password"
                    className="w-full bg-[#F3EFE6] border border-[#D5CEBC] rounded-lg pl-9 p-2.5 font-medium focus:outline-none focus:border-[#143626]"
                  />
                </div>
              </div>

              {passError && (
                <p className="text-red-800 bg-red-100 p-2 rounded text-[11px] font-bold">
                  {passError}
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-[#143626] hover:bg-[#214E36] text-[#FAF8F3] font-bold py-3 rounded-xl transition-all shadow-md flex items-center justify-center space-x-2"
              >
                <RefreshCw className="w-4 h-4 text-[#C99A43]" />
                <span>Save Password & Proceed to Dashboard</span>
              </button>
            </form>
          </div>
        ) : (
          /* SCREEN 2: MAIN SIGN IN OR SELF-REGISTER */
          <div>
            {/* Mode Toggle Bar */}
            <div className="bg-[#F3EFE6] border-b border-[#E2DCCB] p-2 flex space-x-2">
              <button
                onClick={() => setActiveMode('login')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center space-x-2 ${
                  activeMode === 'login'
                    ? 'bg-[#143626] text-[#FAF8F3] shadow-sm'
                    : 'text-[#55695D] hover:bg-[#E2DCCB]'
                }`}
              >
                <LogIn className="w-4 h-4 text-[#C99A43]" />
                <span>Sign In to Account</span>
              </button>

              <button
                onClick={() => setActiveMode('register')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center space-x-2 ${
                  activeMode === 'register'
                    ? 'bg-[#143626] text-[#FAF8F3] shadow-sm'
                    : 'text-[#55695D] hover:bg-[#E2DCCB]'
                }`}
              >
                <UserPlus className="w-4 h-4 text-[#C99A43]" />
                <span>Parent / Student Self-Registration</span>
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* MODE A: LOGIN FORM */}
              {activeMode === 'login' && (
                <div className="space-y-4">
                  {/* Category Selector Tabs */}
                  <div className="grid grid-cols-3 gap-2 bg-[#E2DCCB]/40 p-1.5 rounded-xl border border-[#D5CEBC]">
                    <button
                      type="button"
                      onClick={() => { setLoginCategory('staff'); setIdentifier(''); }}
                      className={`py-2 px-1 text-center rounded-lg font-bold text-xs transition-all flex items-center justify-center space-x-1 ${
                        loginCategory === 'staff'
                          ? 'bg-[#143626] text-[#FAF8F3] shadow'
                          : 'text-[#55695D] hover:text-[#143626]'
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-[#C99A43]" />
                      <span>Staff / Admin</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => { setLoginCategory('student'); setIdentifier('VIS/2024/012'); }}
                      className={`py-2 px-1 text-center rounded-lg font-bold text-xs transition-all flex items-center justify-center space-x-1 ${
                        loginCategory === 'student'
                          ? 'bg-[#143626] text-[#FAF8F3] shadow'
                          : 'text-[#55695D] hover:text-[#143626]'
                      }`}
                    >
                      <GraduationCap className="w-3.5 h-3.5 text-[#C99A43]" />
                      <span>Student</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => { setLoginCategory('parent'); setIdentifier('0722345678'); }}
                      className={`py-2 px-1 text-center rounded-lg font-bold text-xs transition-all flex items-center justify-center space-x-1 ${
                        loginCategory === 'parent'
                          ? 'bg-[#143626] text-[#FAF8F3] shadow'
                          : 'text-[#55695D] hover:text-[#143626]'
                      }`}
                    >
                      <Users className="w-3.5 h-3.5 text-[#C99A43]" />
                      <span>Parent</span>
                    </button>
                  </div>

                  <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs text-[#143626]">
                    <div>
                      <label className="block font-bold text-[#55695D] uppercase text-[10px] mb-1">
                        {loginCategory === 'staff' && 'Username or Official Email *'}
                        {loginCategory === 'student' && 'Student Admission Number *'}
                        {loginCategory === 'parent' && 'Parent M-Pesa Phone Number *'}
                      </label>
                      <div className="relative">
                        {loginCategory === 'staff' && <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#55695D]" />}
                        {loginCategory === 'student' && <GraduationCap className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#55695D]" />}
                        {loginCategory === 'parent' && <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#55695D]" />}
                        
                        <input
                          type="text"
                          required
                          value={identifier}
                          onChange={(e) => setIdentifier(e.target.value)}
                          placeholder={
                            loginCategory === 'staff' ? '...' :
                            loginCategory === 'student' ? 'e.g. VIS/2024/012' :
                            'e.g. 0722345678'
                          }
                          className="w-full bg-[#F3EFE6] border border-[#D5CEBC] rounded-lg pl-9 p-2.5 font-medium focus:outline-none focus:border-[#143626]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-[#55695D] uppercase text-[10px] mb-1">
                        Password *
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#55695D]" />
                        <input
                          type="password"
                          required
                          value={passwordInput}
                          onChange={(e) => setPasswordInput(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full bg-[#F3EFE6] border border-[#D5CEBC] rounded-lg pl-9 p-2.5 font-medium focus:outline-none focus:border-[#143626]"
                        />
                      </div>
                    </div>

                    {loginError && (
                      <p className="text-red-800 bg-red-100 p-2.5 rounded-lg text-[11px] font-bold border border-red-200">
                        {loginError}
                      </p>
                    )}

                    <button
                      type="submit"
                      className="w-full bg-[#143626] hover:bg-[#214E36] text-[#FAF8F3] font-bold py-3 rounded-xl transition-all shadow-md flex items-center justify-center space-x-2"
                    >
                      <LogIn className="w-4 h-4 text-[#C99A43]" />
                      <span>Sign In to {loginCategory.toUpperCase()} Dashboard</span>
                    </button>
                  </form>

                  {/* Institutional Security Notice */}
                  <div className="bg-[#F3EFE6] p-3 rounded-xl border border-[#D5CEBC] text-[11px] text-[#55695D] space-y-1">
                    <div className="font-bold text-[#143626] flex items-center space-x-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#C99A43]" />
                      <span>Institutional Access Security Notice</span>
                    </div>
                    <p>
                      Staff accounts (Principal, Deputy Principal, Finance, Teachers, Receptionist, Librarian, Nurse) are strictly created by the <strong>Super Administrator</strong>. Staff receive temporary passwords and are prompted to set a new password on first login.
                    </p>
                  </div>
                </div>
              )}

              {/* MODE B: SELF-REGISTRATION (PARENTS & STUDENTS ONLY) */}
              {activeMode === 'register' && (
                <div className="space-y-4">
                  {/* Strict Staff Registration Ban Notice */}
                  <div className="bg-amber-50 border border-amber-300 p-3.5 rounded-xl text-amber-900 text-[11px] space-y-1">
                    <div className="font-bold flex items-center space-x-1 text-xs text-amber-950">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                      <span>Strict Self-Registration Constraint</span>
                    </div>
                    <p>
                      Self-registration is restricted strictly to <strong>Parents</strong> and <strong>Students</strong>. School staff members (Principal, Deputy, Finance, Teachers, Receptionist, Librarian, Nurse) <strong>NEVER self-register</strong>—their accounts are created by the Super Administrator.
                    </p>
                  </div>

                  {/* Toggle Parent vs Student Self-Register */}
                  <div className="grid grid-cols-2 gap-2 bg-[#E2DCCB]/40 p-1.5 rounded-xl border border-[#D5CEBC]">
                    <button
                      type="button"
                      onClick={() => setRegType('parent')}
                      className={`py-2 text-center rounded-lg font-bold text-xs transition-all flex items-center justify-center space-x-1.5 ${
                        regType === 'parent'
                          ? 'bg-[#143626] text-[#FAF8F3] shadow'
                          : 'text-[#55695D] hover:text-[#143626]'
                      }`}
                    >
                      <Users className="w-3.5 h-3.5 text-[#C99A43]" />
                      <span>Parent Self-Register</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRegType('student')}
                      className={`py-2 text-center rounded-lg font-bold text-xs transition-all flex items-center justify-center space-x-1.5 ${
                        regType === 'student'
                          ? 'bg-[#143626] text-[#FAF8F3] shadow'
                          : 'text-[#55695D] hover:text-[#143626]'
                      }`}
                    >
                      <GraduationCap className="w-3.5 h-3.5 text-[#C99A43]" />
                      <span>Student Self-Register</span>
                    </button>
                  </div>

                  <form onSubmit={handleSelfRegisterSubmit} className="space-y-3 text-xs text-[#143626]">
                    {regType === 'parent' && (
                      <>
                        <div>
                          <label className="block font-bold text-[#55695D] uppercase text-[10px] mb-1">
                            Parent Full Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={regName}
                            onChange={(e) => setRegName(e.target.value)}
                            placeholder="e.g. Peter Mwangi"
                            className="w-full bg-[#F3EFE6] border border-[#D5CEBC] rounded-lg p-2.5 font-medium focus:outline-none"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block font-bold text-[#55695D] uppercase text-[10px] mb-1">
                              Parent Phone (M-Pesa Login) *
                            </label>
                            <input
                              type="text"
                              required
                              value={regPhone}
                              onChange={(e) => setRegPhone(e.target.value)}
                              placeholder="0722345678"
                              className="w-full bg-[#F3EFE6] border border-[#D5CEBC] rounded-lg p-2.5 font-mono focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block font-bold text-[#55695D] uppercase text-[10px] mb-1">
                              Scholar Admission No *
                            </label>
                            <input
                              type="text"
                              required
                              value={regAdmissionNo}
                              onChange={(e) => setRegAdmissionNo(e.target.value)}
                              placeholder="e.g. VIS/2024/012"
                              className="w-full bg-[#F3EFE6] border border-[#D5CEBC] rounded-lg p-2.5 font-mono focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block font-bold text-[#55695D] uppercase text-[10px] mb-1">
                              Email Address (Optional)
                            </label>
                            <input
                              type="email"
                              value={regEmail}
                              onChange={(e) => setRegEmail(e.target.value)}
                              placeholder="parent@gmail.com"
                              className="w-full bg-[#F3EFE6] border border-[#D5CEBC] rounded-lg p-2.5 font-medium focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block font-bold text-[#55695D] uppercase text-[10px] mb-1">
                              Create Password *
                            </label>
                            <input
                              type="password"
                              required
                              value={regPassword}
                              onChange={(e) => setRegPassword(e.target.value)}
                              placeholder="••••••••••••"
                              className="w-full bg-[#F3EFE6] border border-[#D5CEBC] rounded-lg p-2.5 font-medium focus:outline-none"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {regType === 'student' && (
                      <>
                        <div>
                          <label className="block font-bold text-[#55695D] uppercase text-[10px] mb-1">
                            Student Admission Number *
                          </label>
                          <input
                            type="text"
                            required
                            value={regAdmissionNo}
                            onChange={(e) => setRegAdmissionNo(e.target.value)}
                            placeholder="e.g. VIS/2024/012"
                            className="w-full bg-[#F3EFE6] border border-[#D5CEBC] rounded-lg p-2.5 font-mono focus:outline-none"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block font-bold text-[#55695D] uppercase text-[10px] mb-1">
                              Student Full Name *
                            </label>
                            <input
                              type="text"
                              required
                              value={regName}
                              onChange={(e) => setRegName(e.target.value)}
                              placeholder="e.g. Amani Mwangi"
                              className="w-full bg-[#F3EFE6] border border-[#D5CEBC] rounded-lg p-2.5 font-medium focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block font-bold text-[#55695D] uppercase text-[10px] mb-1">
                              Create Student Password *
                            </label>
                            <input
                              type="password"
                              required
                              value={regPassword}
                              onChange={(e) => setRegPassword(e.target.value)}
                              placeholder="••••••••••••"
                              className="w-full bg-[#F3EFE6] border border-[#D5CEBC] rounded-lg p-2.5 font-medium focus:outline-none"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {regError && (
                      <p className="text-red-800 bg-red-100 p-2.5 rounded-lg text-[11px] font-bold border border-red-200">
                        {regError}
                      </p>
                    )}

                    <button
                      type="submit"
                      className="w-full bg-[#143626] hover:bg-[#214E36] text-[#FAF8F3] font-bold py-3 rounded-xl transition-all shadow-md flex items-center justify-center space-x-2"
                    >
                      <UserPlus className="w-4 h-4 text-[#C99A43]" />
                      <span>Complete {regType === 'parent' ? 'Parent' : 'Student'} Registration</span>
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

