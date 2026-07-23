import React from 'react';
import { ActiveTab, UserRole } from '../types';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  CreditCard, 
  Calendar, 
  Building2, 
  BookOpen, 
  Award,
  ChevronRight,
  UserPlus,
  KeyRound,
  ShieldCheck,
  UserCheck,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  currentRole?: UserRole;
  activeTab: ActiveTab;
  onNavigate: (tab: ActiveTab) => void;
  studentCount: number;
  onOpenAuthModal?: () => void;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentRole, activeTab, onNavigate, studentCount, onOpenAuthModal, onLogout }) => {
  const isSuperAdmin = currentRole?.id === 'superadmin' || currentRole?.id === 'admin';

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string; desc: string }[] = [
    {
      id: 'dashboard',
      label: 'School Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
      desc: 'Overview & metrics'
    },
    ...(isSuperAdmin ? [{
      id: 'users' as ActiveTab,
      label: 'Registered Users',
      icon: <ShieldCheck className="w-4 h-4 text-[#C99A43]" />,
      desc: 'Super Admin Directory'
    }] : []),
    {
      id: 'students',
      label: currentRole?.id === 'parent' ? 'My Scholar Profile' : currentRole?.id === 'student' ? 'My Student Profile' : 'Students (G1 - G10)',
      icon: <Users className="w-4 h-4" />,
      badge: currentRole?.id === 'parent' || currentRole?.id === 'student' ? '1' : `${studentCount}`,
      desc: currentRole?.id === 'parent' ? 'Child records & details' : currentRole?.id === 'student' ? 'My personal record' : 'Directory & profiles'
    },
    {
      id: 'cbc',
      label: currentRole?.id === 'student' ? 'My Report Card' : 'CBC Report Cards',
      icon: <GraduationCap className="w-4 h-4" />,
      desc: 'EE / ME / AE / BE Assessment'
    },
    {
      id: 'fees',
      label: currentRole?.id === 'student' ? 'My Fee Status' : 'Fee & M-Pesa Ledger',
      icon: <CreditCard className="w-4 h-4" />,
      desc: 'Paybill 400200 tracking'
    },
    {
      id: 'timetable',
      label: 'Class Timetable',
      icon: <Calendar className="w-4 h-4" />,
      desc: 'Schedules & venues'
    },
    {
      id: 'school-info',
      label: 'Vispa Academy Info',
      icon: <Building2 className="w-4 h-4" />,
      desc: 'Facilities & Co-curriculars'
    }
  ];

  return (
    <aside className="w-64 bg-[#F3EFE6] border-r border-[#D9D3C2] flex-shrink-0 min-h-[calc(100vh-4.5rem)] p-4 hidden md:block">
      {/* Grade Tier Quick Banner */}
      <div className="bg-[#143626] text-[#FAF8F3] p-3 rounded-xl mb-5 shadow-sm border border-[#214E36]">
        <div className="flex items-center space-x-2 text-xs font-semibold text-[#EAD8A6] uppercase tracking-wider mb-1">
          <BookOpen className="w-3.5 h-3.5 text-[#C99A43]" />
          <span>Curriculum Hierarchy</span>
        </div>
        <p className="text-[11px] text-[#C3BDAD] leading-relaxed">
          Lower Primary (G1-3) • Upper Primary (G4-6) • JSS (G7-9) • Senior (G10)
        </p>
      </div>

      {/* Main Nav Links */}
      <nav className="space-y-1.5">
        <p className="text-[10px] font-bold text-[#6B7A70] uppercase tracking-wider px-3 mb-2">
          Management Modules
        </p>
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all ${
                isActive
                  ? 'bg-[#143626] text-[#FAF8F3] font-semibold shadow-sm border border-[#214E36]'
                  : 'text-[#2C3E35] hover:bg-[#E6E0D0] hover:text-[#122C20]'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`${isActive ? 'text-[#C99A43]' : 'text-[#4A5D52]'}`}>
                  {item.icon}
                </div>
                <div>
                  <div className="text-xs font-medium leading-none">{item.label}</div>
                  <div className={`text-[10px] mt-0.5 ${isActive ? 'text-[#A9BBAF]' : 'text-[#6B7A70]'}`}>
                    {item.desc}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      isActive
                        ? 'bg-[#C99A43] text-[#122C20]'
                        : 'bg-[#DCD5C3] text-[#2C3E35]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-[#C99A43]" />}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Role Active Status Box */}
      {onOpenAuthModal && (
        <div className="mt-6 p-3 bg-[#EAD8A6]/20 border border-[#C99A43]/40 rounded-xl space-y-2 text-xs text-[#143626]">
          <div className="flex items-center justify-between font-bold">
            <span className="flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-[#143626]" />
              <span>Active Session</span>
            </span>
            <span className="text-[10px] bg-[#143626] text-[#FAF8F3] px-2 py-0.5 rounded font-bold">
              {currentRole?.label || 'Guest'}
            </span>
          </div>
          <p className="text-[11px] text-[#55695D]">
            User: <span className="font-bold text-[#143626]">{currentRole?.userName || 'Anonymous'}</span>
          </p>
          <div className="flex items-center space-x-2 pt-1">
            <button
              onClick={onOpenAuthModal}
              className="flex-1 bg-[#143626] hover:bg-[#214E36] text-[#FAF8F3] py-2 rounded-lg font-bold text-center transition-all flex items-center justify-center space-x-1 shadow-sm text-xs"
            >
              {isSuperAdmin ? (
                <>
                  <UserCheck className="w-3.5 h-3.5 text-[#C99A43]" />
                  <span>User Control</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-3.5 h-3.5 text-[#C99A43]" />
                  <span>Switch Role</span>
                </>
              )}
            </button>

            {onLogout && (
              <button
                onClick={onLogout}
                className="bg-red-900 hover:bg-red-800 text-white p-2 rounded-lg transition-all shadow-sm flex items-center justify-center"
                title="Log Out"
              >
                <LogOut className="w-4 h-4 text-red-200" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* House System Badge */}
      <div className="mt-6 pt-4 border-t border-[#D5CEBC]">
        <div className="flex items-center justify-between text-xs font-bold text-[#143626] mb-2">
          <span className="flex items-center space-x-1">
            <Award className="w-3.5 h-3.5 text-[#C99A43]" />
            <span>School Houses</span>
          </span>
          <span className="text-[10px] text-[#55695D]">Inter-House</span>
        </div>
        <div className="grid grid-cols-2 gap-1.5 text-[11px]">
          <div className="bg-[#FAF8F3] p-1.5 rounded border border-[#E0D8C6] flex items-center justify-between">
            <span className="font-semibold text-amber-900">Simba</span>
            <span className="text-[10px] bg-amber-100 text-amber-800 px-1 rounded">240</span>
          </div>
          <div className="bg-[#FAF8F3] p-1.5 rounded border border-[#E0D8C6] flex items-center justify-between">
            <span className="font-semibold text-emerald-900">Chui</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1 rounded">225</span>
          </div>
          <div className="bg-[#FAF8F3] p-1.5 rounded border border-[#E0D8C6] flex items-center justify-between">
            <span className="font-semibold text-blue-900">Kifaru</span>
            <span className="text-[10px] bg-blue-100 text-blue-800 px-1 rounded">210</span>
          </div>
          <div className="bg-[#FAF8F3] p-1.5 rounded border border-[#E0D8C6] flex items-center justify-between">
            <span className="font-semibold text-stone-900">Nyati</span>
            <span className="text-[10px] bg-stone-100 text-stone-800 px-1 rounded">195</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

