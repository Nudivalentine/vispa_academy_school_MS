import React, { useState } from 'react';
import { UserRole, SystemRoleId } from '../types';
import { 
  Users, 
  ShieldCheck, 
  UserCheck, 
  CreditCard, 
  Search, 
  UserPlus, 
  Mail, 
  Phone, 
  Calendar, 
  Award, 
  Building,
  CheckCircle2,
  Lock,
  Copy,
  KeyRound,
  Stethoscope,
  BookOpen,
  Receipt,
  User,
  X
} from 'lucide-react';

interface RegisteredUsersViewProps {
  currentRole: UserRole;
  allRoles: UserRole[];
  onOpenAuthModal: () => void;
  onRegisterUser?: (newRole: UserRole) => void;
  onDeleteUser?: (email: string) => void;
}

export const RegisteredUsersView: React.FC<RegisteredUsersViewProps> = ({
  currentRole,
  allRoles,
  onOpenAuthModal,
  onRegisterUser,
  onDeleteUser
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [isProvisionModalOpen, setIsProvisionModalOpen] = useState(false);

  // Staff Creation State for Super Admin
  const [staffRole, setStaffRole] = useState<SystemRoleId>('teacher');
  const [staffName, setStaffName] = useState('');
  const [staffUsername, setStaffUsername] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffPhone, setStaffPhone] = useState('07');
  const [staffTscNo, setStaffTscNo] = useState('');
  const [createdTempInfo, setCreatedTempInfo] = useState<{ name: string; username: string; tempPass: string; role: string } | null>(null);

  const isSuperAdmin = currentRole.id === 'superadmin' || currentRole.id === 'admin';

  // Filter users
  const filteredUsers = allRoles.filter((u) => {
    const matchesSearch = 
      u.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.usernameOrEmail && u.usernameOrEmail.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.phone && u.phone.includes(searchTerm)) ||
      (u.tscNo && u.tscNo.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.admissionNo && u.admissionNo.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesRole = roleFilter === 'all' || u.id === roleFilter;

    return matchesSearch && matchesRole;
  });

  const totalUsers = allRoles.length;
  const staffCount = allRoles.filter(u => u.id !== 'parent' && u.id !== 'student').length;
  const parentCount = allRoles.filter(u => u.id === 'parent').length;
  const studentCount = allRoles.filter(u => u.id === 'student').length;

  const handleProvisionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffName || !staffUsername) return;

    const tempPassword = `Vispa#${Math.floor(1000 + Math.random() * 9000)}`;

    let roleLabel = 'School Staff';
    let roleSubtitle = 'Official Staff Account';

    switch (staffRole) {
      case 'principal':
        roleLabel = 'Principal';
        roleSubtitle = 'Executive Headteacher';
        break;
      case 'deputy_principal':
        roleLabel = 'Deputy Principal';
        roleSubtitle = 'Academic & Discipline';
        break;
      case 'finance':
        roleLabel = 'Finance Officer';
        roleSubtitle = 'M-Pesa & Fee Ledger';
        break;
      case 'teacher':
        roleLabel = 'Class Teacher';
        roleSubtitle = 'CBC Assessment Assessor';
        break;
      case 'receptionist':
        roleLabel = 'Receptionist';
        roleSubtitle = 'Front Desk & Admissions';
        break;
      case 'librarian':
        roleLabel = 'Librarian';
        roleSubtitle = 'CBC Learning Resources';
        break;
      case 'nurse':
        roleLabel = 'School Nurse';
        roleSubtitle = 'Sanatorium & First Aid';
        break;
      default:
        roleLabel = 'Staff Officer';
    }

    const newStaffUser: UserRole = {
      id: staffRole,
      label: roleLabel,
      subtitle: roleSubtitle,
      userName: staffName,
      avatar: staffName.charAt(0).toUpperCase(),
      usernameOrEmail: staffUsername,
      email: staffEmail || `${staffUsername.toLowerCase()}@vispa-academy.sc.ke`,
      phone: staffPhone,
      tscNo: staffTscNo || undefined,
      password: tempPassword,
      isTemporaryPassword: true,
      createdBySuperAdmin: true,
      registeredAt: new Date().toISOString().split('T')[0]
    };

    if (onRegisterUser) {
      onRegisterUser(newStaffUser);
    }

    setCreatedTempInfo({
      name: staffName,
      username: staffUsername,
      tempPass: tempPassword,
      role: roleLabel
    });

    setStaffName('');
    setStaffUsername('');
    setStaffEmail('');
    setStaffTscNo('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#143626] text-[#FAF8F3] rounded-2xl p-6 shadow-md border border-[#214E36] relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-[#EAD8A6] text-xs font-semibold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4 text-[#C99A43]" />
              <span>Super Administrator Access Control</span>
            </div>
            <h2 className="text-2xl font-bold font-serif-school text-[#FAF8F3]">
              Institutional User Directory
            </h2>
            <p className="text-xs text-[#C3BDAD] mt-1 max-w-xl">
              Super Admin manages and provisions official staff accounts (Principal, Deputy, Finance, Teachers, Receptionist, Librarian, Nurse). Staff receive temporary passwords for first login.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            {isSuperAdmin && (
              <button
                onClick={() => setIsProvisionModalOpen(true)}
                className="bg-[#C99A43] hover:bg-[#D8A74F] text-[#122C20] text-xs font-bold px-4 py-2.5 rounded-lg flex items-center space-x-2 transition-all shadow-sm"
              >
                <UserPlus className="w-4 h-4" />
                <span>Create Staff Account</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-[#FAF8F3] p-4 rounded-xl border border-[#E2DCCB] shadow-sm">
          <div className="text-xs font-bold text-[#55695D] uppercase tracking-wider">Total Accounts</div>
          <div className="text-2xl font-extrabold text-[#143626] mt-1">{totalUsers}</div>
          <div className="text-[11px] text-[#55695D] mt-0.5">Active Portal Users</div>
        </div>

        <div className="bg-[#FAF8F3] p-4 rounded-xl border border-[#E2DCCB] shadow-sm">
          <div className="text-xs font-bold text-[#55695D] uppercase tracking-wider">Provisioned Staff</div>
          <div className="text-2xl font-extrabold text-[#143626] mt-1">{staffCount}</div>
          <div className="text-[11px] text-[#55695D] mt-0.5">Super Admin Created</div>
        </div>

        <div className="bg-[#FAF8F3] p-4 rounded-xl border border-[#E2DCCB] shadow-sm">
          <div className="text-xs font-bold text-[#55695D] uppercase tracking-wider">Parents</div>
          <div className="text-2xl font-extrabold text-[#143626] mt-1">{parentCount}</div>
          <div className="text-[11px] text-[#55695D] mt-0.5">Log in via Phone Number</div>
        </div>

        <div className="bg-[#FAF8F3] p-4 rounded-xl border border-[#E2DCCB] shadow-sm">
          <div className="text-xs font-bold text-[#55695D] uppercase tracking-wider">Students</div>
          <div className="text-2xl font-extrabold text-[#143626] mt-1">{studentCount}</div>
          <div className="text-[11px] text-[#55695D] mt-0.5">Log in via Admission No</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#FAF8F3] p-4 rounded-xl border border-[#E2DCCB] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#55695D]" />
          <input
            type="text"
            placeholder="Search by name, username, phone, TSC or Admission..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#F3EFE6] border border-[#D5CEBC] rounded-lg pl-9 pr-3 py-2 text-xs font-medium focus:outline-none focus:border-[#143626]"
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto">
          <span className="text-xs font-bold text-[#143626]">Filter Role:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-[#F3EFE6] border border-[#D5CEBC] rounded-lg px-3 py-2 text-xs font-bold text-[#143626] focus:outline-none"
          >
            <option value="all">All Roles ({allRoles.length})</option>
            <option value="superadmin">Super Admin</option>
            <option value="principal">Principal</option>
            <option value="deputy_principal">Deputy Principal</option>
            <option value="finance">Finance Officer</option>
            <option value="teacher">Class Teachers</option>
            <option value="receptionist">Receptionist</option>
            <option value="librarian">Librarian</option>
            <option value="nurse">Nurse</option>
            <option value="parent">Parents</option>
            <option value="student">Students</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-[#FAF8F3] rounded-xl border border-[#E2DCCB] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#143626] text-[#FAF8F3] text-xs font-serif-school">
                <th className="p-3.5 pl-5">User Account</th>
                <th className="p-3.5">Role</th>
                <th className="p-3.5">Login Credentials</th>
                <th className="p-3.5">Contact Details</th>
                <th className="p-3.5">Security Status</th>
                <th className="p-3.5 pr-5 text-right">Created Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D0] text-xs text-[#143626]">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#55695D]">
                    No registered user accounts found matching your query.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, idx) => (
                  <tr key={idx} className="hover:bg-[#F3EFE6] transition-colors">
                    <td className="p-3.5 pl-5">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-full bg-[#143626] text-[#FAF8F3] font-bold text-sm flex items-center justify-center border border-[#C99A43]">
                          {user.avatar}
                        </div>
                        <div>
                          <div className="font-bold text-[#143626] text-sm">{user.userName}</div>
                          <div className="text-[10px] text-[#55695D]">{user.subtitle}</div>
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        user.id === 'superadmin' ? 'bg-purple-900 text-purple-100' :
                        user.id === 'principal' || user.id === 'admin' ? 'bg-[#143626] text-[#FAF8F3]' :
                        user.id === 'teacher' ? 'bg-blue-900 text-blue-100' :
                        user.id === 'finance' ? 'bg-amber-900 text-amber-100' :
                        user.id === 'parent' ? 'bg-emerald-800 text-emerald-100' :
                        user.id === 'student' ? 'bg-sky-800 text-sky-100' :
                        'bg-slate-700 text-slate-100'
                      }`}>
                        {user.label}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <div className="space-y-0.5 font-mono text-[11px]">
                        {user.usernameOrEmail && (
                          <div className="font-bold text-[#143626]">User: {user.usernameOrEmail}</div>
                        )}
                        {user.admissionNo && (
                          <div className="text-sky-900 font-bold">Adm: {user.admissionNo}</div>
                        )}
                        {user.phone && user.id === 'parent' && (
                          <div className="text-emerald-900 font-bold">Phone: {user.phone}</div>
                        )}
                      </div>
                    </td>

                    <td className="p-3.5">
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-1 text-[11px]">
                          <Mail className="w-3 h-3 text-[#55695D]" />
                          <span>{user.email || 'N/A'}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-[11px] text-[#55695D] font-mono">
                          <Phone className="w-3 h-3 text-[#55695D]" />
                          <span>{user.phone || 'N/A'}</span>
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5">
                      {user.isTemporaryPassword ? (
                        <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[10px] font-bold border border-amber-300">
                          Temp Password (Pending First Login)
                        </span>
                      ) : (
                        <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-300">
                          Permanent Active Password
                        </span>
                      )}
                    </td>

                    <td className="p-3.5 pr-5 text-right font-medium text-[#55695D]">
                      {user.registeredAt || 'Active'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SUPER ADMIN PROVISION STAFF MODAL */}
      {isProvisionModalOpen && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-sm">
          <div className="bg-[#FAF8F3] rounded-2xl max-w-md w-full border-2 border-[#143626] shadow-2xl overflow-hidden animate-fadeIn my-6">
            <div className="bg-[#143626] text-[#FAF8F3] p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-[#C99A43]" />
                <h3 className="font-bold text-sm font-serif-school">Super Admin: Create Staff Account</h3>
              </div>
              <button onClick={() => { setIsProvisionModalOpen(false); setCreatedTempInfo(null); }} className="text-white hover:text-[#C99A43]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs text-[#143626]">
              {createdTempInfo ? (
                <div className="space-y-4">
                  <div className="bg-emerald-100 border border-emerald-300 p-4 rounded-xl text-emerald-900 space-y-2">
                    <div className="font-bold text-sm flex items-center space-x-1.5 text-emerald-950">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      <span>Staff Account Created Successfully!</span>
                    </div>
                    <p className="text-xs">
                      Give these credentials to <strong>{createdTempInfo.name}</strong> ({createdTempInfo.role}). They will be prompted to set a permanent password upon first login.
                    </p>

                    <div className="bg-white p-3 rounded-lg border border-emerald-200 font-mono text-xs space-y-1">
                      <div>Username: <strong>{createdTempInfo.username}</strong></div>
                      <div>Temp Password: <strong className="text-red-700">{createdTempInfo.tempPass}</strong></div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setCreatedTempInfo(null)}
                    className="w-full bg-[#143626] text-white py-2.5 rounded-lg font-bold"
                  >
                    Create Another Staff Account
                  </button>
                </div>
              ) : (
                <form onSubmit={handleProvisionSubmit} className="space-y-3">
                  <div>
                    <label className="block font-bold text-[#55695D] uppercase text-[10px] mb-1">
                      Select Staff Role *
                    </label>
                    <select
                      value={staffRole}
                      onChange={(e) => setStaffRole(e.target.value as SystemRoleId)}
                      className="w-full bg-[#F3EFE6] border border-[#D5CEBC] rounded-lg p-2.5 font-bold"
                    >
                      <option value="principal">Principal</option>
                      <option value="deputy_principal">Deputy Principal</option>
                      <option value="finance">Finance Officer</option>
                      <option value="teacher">Class Teacher</option>
                      <option value="receptionist">Receptionist</option>
                      <option value="librarian">Librarian</option>
                      <option value="nurse">Nurse</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-[#55695D] uppercase text-[10px] mb-1">
                      Full Staff Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={staffName}
                      onChange={(e) => setStaffName(e.target.value)}
                      placeholder="e.g. Dr. Paul Ndegwa"
                      className="w-full bg-[#F3EFE6] border border-[#D5CEBC] rounded-lg p-2.5 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#55695D] uppercase text-[10px] mb-1">
                      Login Username *
                    </label>
                    <input
                      type="text"
                      required
                      value={staffUsername}
                      onChange={(e) => setStaffUsername(e.target.value)}
                      placeholder="e.g. principal, deputy, finance..."
                      className="w-full bg-[#F3EFE6] border border-[#D5CEBC] rounded-lg p-2.5 font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-[#55695D] uppercase text-[10px] mb-1">
                        Phone
                      </label>
                      <input
                        type="text"
                        value={staffPhone}
                        onChange={(e) => setStaffPhone(e.target.value)}
                        placeholder="07..."
                        className="w-full bg-[#F3EFE6] border border-[#D5CEBC] rounded-lg p-2.5 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#55695D] uppercase text-[10px] mb-1">
                        TSC No
                      </label>
                      <input
                        type="text"
                        value={staffTscNo}
                        onChange={(e) => setStaffTscNo(e.target.value)}
                        placeholder="TSC-..."
                        className="w-full bg-[#F3EFE6] border border-[#D5CEBC] rounded-lg p-2.5 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-[#55695D] uppercase text-[10px] mb-1">
                      Official Email
                    </label>
                    <input
                      type="email"
                      value={staffEmail}
                      onChange={(e) => setStaffEmail(e.target.value)}
                      placeholder="staff@vispa-academy.sc.ke"
                      className="w-full bg-[#F3EFE6] border border-[#D5CEBC] rounded-lg p-2.5 font-medium"
                    />
                  </div>

                  <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-200 text-[11px] text-amber-900 font-medium">
                    ⚡ Temporary password will be auto-generated and staff will be forced to change it on first login.
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#143626] hover:bg-[#214E36] text-[#FAF8F3] font-bold py-3 rounded-xl transition-all shadow-md flex items-center justify-center space-x-2"
                  >
                    <UserPlus className="w-4 h-4 text-[#C99A43]" />
                    <span>Generate Staff Account & Temp Password</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

