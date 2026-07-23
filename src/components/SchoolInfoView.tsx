import React from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Award, 
  Users, 
  BookOpen, 
  CheckCircle2, 
  Phone, 
  Mail, 
  MapPin, 
  Sparkles
} from 'lucide-react';
import logoImg from '../assets/images/vispa_school_logo_1784781059330.jpg';

export const SchoolInfoView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* School Overview Hero */}
      <div className="bg-[#143626] text-[#FAF8F3] rounded-2xl p-6 sm:p-8 shadow-md border border-[#214E36] relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center space-x-5">
            <img 
              src={logoImg} 
              alt="Vispa Academy Logo" 
              className="w-24 h-24 rounded-full border-4 border-[#C99A43] object-cover bg-white shadow-xl"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-3xl font-extrabold font-serif-school text-[#FAF8F3]">
                  VISPA ACADEMY
                </h1>
                <span className="bg-[#C99A43] text-[#122C20] text-xs font-bold px-2.5 py-0.5 rounded uppercase">
                  MIXED G1 - 10
                </span>
              </div>
              <p className="text-sm text-[#EAD8A6] font-medium mt-1">
                Kenya Competency-Based Curriculum (CBC) Primary & Junior/Senior Secondary School
              </p>
              <p className="text-xs text-[#C3BDAD] mt-1">
                MOE Registration No: K/SCH/2021/8842 • Kiambu/Nairobi County, Kenya
              </p>
            </div>
          </div>

          <div className="bg-[#214E36] p-4 rounded-xl border border-[#2F6D4C] text-center sm:text-right text-xs">
            <p className="text-[#C99A43] font-serif-school italic font-bold text-sm">"Virtue, Knowledge & Excellence"</p>
            <p className="text-[#A9BBAF] mt-1">Established 2014 • Co-educational Mixed Day & Boarding</p>
          </div>
        </div>
      </div>

      {/* Facilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#FAF8F3] p-5 rounded-xl border border-[#E2DCCB] shadow-sm space-y-3">
          <div className="p-2.5 bg-[#143626] text-[#EAD8A6] rounded-lg w-fit">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-[#143626] font-serif-school">
            Integrated Science & Tech Labs
          </h3>
          <p className="text-xs text-[#55695D] leading-relaxed">
            Fully equipped CBC laboratories for JSS Integrated Science, Physics, Chemistry, and Agriculture practicals.
          </p>
        </div>

        <div className="bg-[#FAF8F3] p-5 rounded-xl border border-[#E2DCCB] shadow-sm space-y-3">
          <div className="p-2.5 bg-[#143626] text-[#EAD8A6] rounded-lg w-fit">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-[#143626] font-serif-school">
            ICT & Coding Innovation Hub
          </h3>
          <p className="text-xs text-[#55695D] leading-relaxed">
            High-speed internet, Chromebooks, and robotics tools training Grade 1 to Grade 10 scholars in digital literacy.
          </p>
        </div>

        <div className="bg-[#FAF8F3] p-5 rounded-xl border border-[#E2DCCB] shadow-sm space-y-3">
          <div className="p-2.5 bg-[#143626] text-[#EAD8A6] rounded-lg w-fit">
            <Building2 className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-[#143626] font-serif-school">
            Boarding Dormitories & Dining
          </h3>
          <p className="text-xs text-[#55695D] leading-relaxed">
            Secure, separate hostels for boys and girls with resident matrons, patrons, 24/7 security, and balanced hot meals.
          </p>
        </div>
      </div>

      {/* House System Details */}
      <div className="bg-[#FAF8F3] p-6 rounded-xl border border-[#E2DCCB] shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#E8E2D0] pb-3">
          <div>
            <h3 className="text-lg font-bold text-[#143626] font-serif-school">
              Vispa Inter-House Championship
            </h3>
            <p className="text-xs text-[#55695D]">Fostering team spirit, sportsmanship, and leadership</p>
          </div>
          <span className="text-xs font-bold text-[#143626] bg-[#E2DCCB] px-3 py-1 rounded">
            4 House System
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="bg-[#F3EFE6] p-4 rounded-xl border border-[#E2DCCB]">
            <div className="font-bold text-amber-900 text-sm">Simba House (Yellow)</div>
            <p className="text-[#55695D] mt-1 text-[11px]">Motto: "Brave & Strong"</p>
            <div className="mt-3 pt-2 border-t border-[#E2DCCB] flex justify-between font-bold">
              <span>Points: 240</span>
              <span className="text-emerald-800">Rank #1</span>
            </div>
          </div>

          <div className="bg-[#F3EFE6] p-4 rounded-xl border border-[#E2DCCB]">
            <div className="font-bold text-emerald-900 text-sm">Chui House (Green)</div>
            <p className="text-[#55695D] mt-1 text-[11px]">Motto: "Swift & Wise"</p>
            <div className="mt-3 pt-2 border-t border-[#E2DCCB] flex justify-between font-bold">
              <span>Points: 225</span>
              <span className="text-emerald-800">Rank #2</span>
            </div>
          </div>

          <div className="bg-[#F3EFE6] p-4 rounded-xl border border-[#E2DCCB]">
            <div className="font-bold text-blue-900 text-sm">Kifaru House (Blue)</div>
            <p className="text-[#55695D] mt-1 text-[11px]">Motto: "Resilient & True"</p>
            <div className="mt-3 pt-2 border-t border-[#E2DCCB] flex justify-between font-bold">
              <span>Points: 210</span>
              <span className="text-[#55695D]">Rank #3</span>
            </div>
          </div>

          <div className="bg-[#F3EFE6] p-4 rounded-xl border border-[#E2DCCB]">
            <div className="font-bold text-stone-900 text-sm">Nyati House (Red)</div>
            <p className="text-[#55695D] mt-1 text-[11px]">Motto: "United We Conquer"</p>
            <div className="mt-3 pt-2 border-t border-[#E2DCCB] flex justify-between font-bold">
              <span>Points: 195</span>
              <span className="text-[#55695D]">Rank #4</span>
            </div>
          </div>
        </div>
      </div>

      {/* School Contact Footer Box */}
      <div className="bg-[#143626] text-[#FAF8F3] p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="space-y-1">
          <div className="font-bold text-[#EAD8A6] text-sm">Vispa Academy Admissions & Administration</div>
          <div className="flex items-center space-x-4 text-[#C3BDAD]">
            <span className="flex items-center space-x-1"><Phone className="w-3.5 h-3.5" /> <span>+254 700 847 721</span></span>
            <span className="flex items-center space-x-1"><Mail className="w-3.5 h-3.5" /> <span>info@vispa-academy.sc.ke</span></span>
          </div>
        </div>
        <div className="bg-[#214E36] px-4 py-2 rounded-lg border border-[#2F6D4C] text-[#FAF8F3] font-bold">
          M-Pesa Paybill: 400200
        </div>
      </div>
    </div>
  );
};
