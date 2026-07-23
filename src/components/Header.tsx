import React from 'react';
import { UserRole, ActiveTab } from '../types';
import { Shield, Search, UserPlus, KeyRound, LogOut, ShieldCheck, User } from 'lucide-react';
import logoImg from '../assets/images/vispa_school_logo_1784781059330.jpg';

interface HeaderProps {
  currentRole: UserRole;
  allRoles: UserRole[];
  onRoleChange: (role: UserRole) => void;
  activeTab: ActiveTab;
  onNavigate: (tab: ActiveTab) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenAuthModal: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  allRoles,
  onRoleChange,
  activeTab,
  onNavigate,
  searchQuery,
  onSearchChange,
  onOpenAuthModal,
  onLogout
}) => {
  const isAdmin = currentRole.id === 'admin';

  return (
    <header className="bg-[#143626] text-[#FAF8F3] border-b border-[#2A523C] sticky top-0 z-30 shadow-md">
      {/* Top Banner with Motto and Quick Info */}
      <div className="bg-[#0D2419] px-4 py-1.5 text-xs text-[#D8D2C2] border-b border-[#1E4230] flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center space-x-3">
          <span className="bg-[#214E36] text-[#EAD8A6] font-semibold px-2 py-0.5 rounded text-[11px] tracking-wide uppercase">
            MOE REG: K/SCH/2021/8842
          </span>
          <span className="hidden sm:inline text-[#C3BDAD]">
            Vispa Mixed Primary & Junior Secondary School • Kiambu / Nairobi, Kenya
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-[#EAD8A6] font-bold text-xs">
            Logged in: <span className="text-white">{currentRole.userName}</span> ({currentRole.label})
          </span>
          <button
            onClick={onLogout}
            className="text-red-300 hover:text-white font-bold flex items-center space-x-1 underline decoration-red-400 underline-offset-2 text-xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('dashboard')}>
          <div className="relative">
            <img 
              src={logoImg} 
              alt="Vispa Academy Crest" 
              className="w-12 h-12 rounded-full border-2 border-[#C99A43] object-cover shadow-sm bg-[#FAF8F3]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-1 -right-1 bg-[#C99A43] text-[#122C20] p-0.5 rounded-full" title="Mixed School Kenya">
              <Shield className="w-3 h-3 fill-current" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold tracking-tight text-[#FAF8F3] font-serif-school">
                VISPA ACADEMY
              </h1>
              <span className="bg-[#C99A43]/20 border border-[#C99A43]/50 text-[#F3D78A] text-[10px] px-1.5 py-0.5 rounded font-semibold uppercase">
                MIXED G1 - 10
              </span>
            </div>
            <p className="text-xs text-[#A9BBAF]">
              Grade 1 to 10 CBC School Portal
            </p>
          </div>
        </div>

        {/* Global Search */}
        <div className="hidden lg:flex flex-1 max-w-md mx-4 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#889B8F]" />
          <input
            type="text"
            placeholder={
              currentRole.id === 'parent'
                ? "Search scholar details..."
                : "Search student by name, NEMIS, admission no..."
            }
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-[#1C4431] border border-[#2B5E44] text-[#FAF8F3] text-xs rounded-lg pl-9 pr-4 py-2 placeholder-[#889B8F] focus:outline-none focus:border-[#C99A43] transition-colors"
          />
        </div>

        {/* Action Controls & User Profile */}
        <div className="flex items-center space-x-3">
          {isAdmin && (
            <button
              onClick={() => onNavigate('users')}
              className={`hidden sm:flex items-center space-x-1.5 text-xs font-semibold px-3 py-2 rounded-lg border transition-all ${
                activeTab === 'users'
                  ? 'bg-[#C99A43] text-[#122C20] border-[#E8BF68] shadow'
                  : 'bg-[#214E36] text-[#FAF8F3] border-[#2A523C] hover:bg-[#2B6043]'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#F3D78A]" />
              <span>Registered Users</span>
            </button>
          )}

          {/* Logout Header Button */}
          <button
            onClick={onLogout}
            className="flex items-center space-x-1.5 text-xs font-bold px-3 py-2 rounded-lg bg-red-900/80 hover:bg-red-800 text-white border border-red-700/60 transition-all shadow-sm"
            title="Sign Out of Vispa Portal"
          >
            <LogOut className="w-3.5 h-3.5 text-red-200" />
            <span className="hidden sm:inline">Log Out</span>
          </button>
        </div>
      </div>
    </header>
  );
};


