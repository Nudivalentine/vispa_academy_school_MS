import React, { useState } from 'react';
import { Student, ReportCard, SubjectScore, CbcRating, UserRole } from '../types';
import { INITIAL_REPORTS } from '../data/mockData';
import { getStudentsForRole, getPrimaryStudentForRole } from '../utils/roleUtils';
import { 
  GraduationCap, 
  Sparkles, 
  FileText, 
  Printer, 
  CheckCircle2, 
  Search, 
  Edit3, 
  User, 
  Award, 
  Loader2,
  Building,
  ShieldCheck
} from 'lucide-react';
import logoImg from '../assets/images/vispa_school_logo_1784781059330.jpg';

interface CbcAssessmentViewProps {
  currentRole: UserRole;
  students: Student[];
  selectedStudentId?: string;
}

export const CbcAssessmentView: React.FC<CbcAssessmentViewProps> = ({
  currentRole,
  students,
  selectedStudentId
}) => {
  const isParent = currentRole.id === 'parent';
  const isStudent = currentRole.id === 'student';
  const isTeacher = currentRole.id === 'teacher';
  const isAdmin = currentRole.id === 'superadmin' || currentRole.id === 'admin' || currentRole.id === 'principal';

  const roleScholars = getStudentsForRole(currentRole, students);
  const primaryScholar = getPrimaryStudentForRole(currentRole, students);

  const [activeStudentId, setActiveStudentId] = useState<string>(
    selectedStudentId || (isParent || isStudent ? primaryScholar.id : (students[0]?.id || primaryScholar.id))
  );
  const [reports, setReports] = useState<Record<string, ReportCard>>(INITIAL_REPORTS);
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [isPrintMode, setIsPrintMode] = useState<boolean>(isParent);

  const student = students.find((s) => s.id === activeStudentId) || primaryScholar;

  // Helper to construct a default report if not existing
  const currentReport: ReportCard = reports[activeStudentId] || {
    id: `rep-${activeStudentId}`,
    studentId: activeStudentId,
    term: 'Term 2',
    year: 2026,
    daysPresent: 64,
    totalDays: 65,
    conduct: 'Exemplary',
    issueDate: '18th July 2026',
    overallTeacherRemarks: `${student?.firstName} has shown commendable focus and dedication this term. Continues to make solid progress across core subjects.`,
    formativeGuidance: 'Consistent revision in mathematical problem solving is encouraged.',
    headTeacherRemarks: 'Satisfactory academic effort and good discipline.',
    subjectScores: student?.grade >= 7 
      ? [
          { subjectName: 'Mathematics', category: 'Core', score: 85, rating: 'EE', teacherComment: 'Strong problem-solving capability.' },
          { subjectName: 'English', category: 'Core', score: 79, rating: 'ME', teacherComment: 'Good oral and written expression.' },
          { subjectName: 'Kiswahili', category: 'Core', score: 76, rating: 'ME', teacherComment: 'Mawazo mazuri katika insha.' },
          { subjectName: 'Integrated Science', category: 'Core', score: 88, rating: 'EE', teacherComment: 'Active participation in lab work.' },
          { subjectName: 'Agriculture & Nutrition', category: 'Core', score: 82, rating: 'EE', teacherComment: 'Enthusiastic in field activities.' },
          { subjectName: 'Pre-Technical Studies', category: 'Applied', score: 80, rating: 'ME', teacherComment: 'Good technical drawing foundation.' },
          { subjectName: 'Computer Science', category: 'Applied', score: 90, rating: 'EE', teacherComment: 'Excellent computing logic.' }
        ]
      : [
          { subjectName: 'Mathematical Activities', category: 'Core', score: 88, rating: 'EE', teacherComment: 'Mastered number concepts.' },
          { subjectName: 'English Language Activities', category: 'Core', score: 82, rating: 'EE', teacherComment: 'Confident reader.' },
          { subjectName: 'Kiswahili Language Activities', category: 'Core', score: 75, rating: 'ME', teacherComment: 'Anatambua maneno vyema.' },
          { subjectName: 'Environmental Activities', category: 'Core', score: 84, rating: 'ME', teacherComment: 'Observant in outdoor learning.' },
          { subjectName: 'Creative Activities', category: 'Core', score: 90, rating: 'EE', teacherComment: 'Talented in drawing & music.' }
        ]
  };

  // Generate AI Teacher Remarks using Express + Gemini Endpoint
  const handleGenerateAiRemarks = async () => {
    setIsGeneratingAi(true);
    try {
      const response = await fetch('/api/gemini/cbc-remarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: `${student.firstName} ${student.lastName}`,
          grade: student.grade,
          stream: student.stream,
          performanceData: currentReport.subjectScores,
          teacherNotes: `Demonstrates ${currentReport.conduct} behavior in ${student.house} House.`
        })
      });

      if (response.ok) {
        const data = await response.json();
        setReports((prev) => ({
          ...prev,
          [activeStudentId]: {
            ...currentReport,
            overallTeacherRemarks: data.remarks || currentReport.overallTeacherRemarks,
            formativeGuidance: data.formativeGuidance || currentReport.formativeGuidance
          }
        }));
      }
    } catch (err) {
      console.error('Failed to generate AI remarks:', err);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleScoreChange = (index: number, newScore: number) => {
    let newRating: CbcRating = 'BE';
    if (newScore >= 80) newRating = 'EE';
    else if (newScore >= 65) newRating = 'ME';
    else if (newScore >= 50) newRating = 'AE';

    const updatedScores = [...currentReport.subjectScores];
    updatedScores[index] = {
      ...updatedScores[index],
      score: newScore,
      rating: newRating
    };

    setReports((prev) => ({
      ...prev,
      [activeStudentId]: {
        ...currentReport,
        subjectScores: updatedScores
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Top Header Controls */}
      <div className="bg-[#FAF8F3] p-5 rounded-xl border border-[#E2DCCB] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#55695D] uppercase tracking-wider mb-1">
            <GraduationCap className="w-4 h-4 text-[#143626]" />
            <span>Kenya Competency-Based Curriculum (CBC)</span>
          </div>
          <h2 className="text-2xl font-bold font-serif-school text-[#143626]">
            Academic Report Card & Performance Strands
          </h2>
          <p className="text-xs text-[#55695D]">
            Exceeding Expectations (EE) • Meeting Expectations (ME) • Approaching Expectations (AE) • Below Expectations (BE)
          </p>
        </div>

        {/* Scholar Selector */}
        <div className="flex items-center space-x-3">
          <label className="text-xs font-bold text-[#143626]">
            {isParent ? 'My Scholar:' : isStudent ? 'My Record:' : 'Select Scholar:'}
          </label>
          <select
            value={activeStudentId}
            onChange={(e) => setActiveStudentId(e.target.value)}
            disabled={(isParent || isStudent) && roleScholars.length <= 1}
            className="bg-[#143626] text-[#FAF8F3] text-xs font-bold px-3 py-2 rounded-lg border border-[#214E36] focus:outline-none disabled:opacity-90"
          >
            {isParent || isStudent ? (
              roleScholars.map((s) => (
                <option key={s.id} value={s.id}>
                  Grade {s.grade} - {s.firstName} {s.lastName} ({s.admissionNo})
                </option>
              ))
            ) : (
              students.map((s) => (
                <option key={s.id} value={s.id}>
                  Grade {s.grade} - {s.firstName} {s.lastName} ({s.admissionNo})
                </option>
              ))
            )}
          </select>

          <button
            onClick={() => setIsPrintMode(!isPrintMode)}
            className="bg-[#214E36] hover:bg-[#2B6043] text-[#FAF8F3] text-xs font-bold px-3 py-2 rounded-lg flex items-center space-x-1.5 transition-colors"
          >
            <Printer className="w-4 h-4 text-[#C99A43]" />
            <span>{isPrintMode ? 'Edit Mode' : 'Official Print View'}</span>
          </button>
        </div>
      </div>

      {/* Main Report Card Container */}
      <div className="bg-[#FAF8F3] rounded-2xl border-2 border-[#143626] shadow-xl p-6 sm:p-8 space-y-6 relative">
        {/* Official Header Banner */}
        <div className="border-b-2 border-[#143626] pb-5 flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-4">
          <div className="flex items-center space-x-4">
            <img 
              src={logoImg} 
              alt="Vispa Academy Crest" 
              className="w-20 h-20 rounded-full border-2 border-[#C99A43] object-cover bg-white shadow-md"
              referrerPolicy="no-referrer"
            />
            <div>
              <h1 className="text-2xl font-black text-[#143626] font-serif-school tracking-tight">
                VISPA ACADEMY
              </h1>
              <p className="text-xs font-bold text-[#55695D] uppercase tracking-wider">
                Mixed Primary & Junior Secondary School (Grade 1 - 10)
              </p>
              <p className="text-[11px] text-[#55695D]">
                Ministry of Education Reg: K/SCH/2021/8842 • Kiambu/Nairobi, Kenya
              </p>
              <p className="text-[10px] text-[#C99A43] font-serif-school italic font-bold">
                Motto: "Virtue, Knowledge & Excellence"
              </p>
            </div>
          </div>

          <div className="bg-[#143626] text-[#FAF8F3] p-3 rounded-xl border border-[#214E36] text-right text-xs">
            <div className="text-[#EAD8A6] font-bold text-sm font-serif-school uppercase">TERM 2 ASSESSMENT REPORT</div>
            <div>Academic Year: <span className="font-bold">{currentReport.year}</span></div>
            <div>Issue Date: <span className="font-bold">{currentReport.issueDate}</span></div>
          </div>
        </div>

        {/* Scholar Meta Information Grid */}
        <div className="bg-[#F3EFE6] p-4 rounded-xl border border-[#E2DCCB] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-[#143626]">
          <div>
            <span className="text-[10px] text-[#55695D] uppercase font-bold block">Learner Full Name</span>
            <span className="font-extrabold text-sm text-[#143626]">{student.firstName} {student.lastName}</span>
          </div>
          <div>
            <span className="text-[10px] text-[#55695D] uppercase font-bold block">Grade & Stream</span>
            <span className="font-bold">Grade {student.grade} ({student.stream})</span>
          </div>
          <div>
            <span className="text-[10px] text-[#55695D] uppercase font-bold block">Admission & NEMIS No</span>
            <span className="font-mono font-bold">{student.admissionNo} / {student.nemisNo}</span>
          </div>
          <div>
            <span className="text-[10px] text-[#55695D] uppercase font-bold block">Scholar Category & House</span>
            <span className="font-bold">{student.scholarType} • {student.house} House</span>
          </div>
        </div>

        {/* Learning Areas Performance Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#143626] text-[#FAF8F3] uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3 border border-[#214E36]">CBC Learning Area / Subject</th>
                <th className="py-2.5 px-3 border border-[#214E36] text-center w-24">Score %</th>
                <th className="py-2.5 px-3 border border-[#214E36] text-center w-32">CBC Rating</th>
                <th className="py-2.5 px-3 border border-[#214E36]">Teacher Assessment Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2DCCB] text-[#143626]">
              {currentReport.subjectScores.map((subj, idx) => (
                <tr key={idx} className="hover:bg-[#F3EFE6] transition-colors">
                  <td className="py-2.5 px-3 border border-[#E2DCCB] font-bold">
                    {subj.subjectName}
                    <span className="block text-[9px] text-[#55695D] font-normal">{subj.category} Learning Area</span>
                  </td>

                  <td className="py-2.5 px-3 border border-[#E2DCCB] text-center font-bold">
                    {!isPrintMode ? (
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={subj.score}
                        onChange={(e) => handleScoreChange(idx, Number(e.target.value))}
                        className="w-16 text-center bg-white border border-[#D5CEBC] rounded py-1 font-bold text-[#143626] focus:outline-none"
                      />
                    ) : (
                      <span className="text-sm font-extrabold">{subj.score}%</span>
                    )}
                  </td>

                  <td className="py-2.5 px-3 border border-[#E2DCCB] text-center">
                    <span className={`px-2 py-1 rounded text-[11px] font-extrabold ${
                      subj.rating === 'EE' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                      subj.rating === 'ME' ? 'bg-blue-100 text-blue-900 border border-blue-300' :
                      subj.rating === 'AE' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                      'bg-red-100 text-red-900 border border-red-300'
                    }`}>
                      {subj.rating} ({subj.rating === 'EE' ? 'Exceeding' : subj.rating === 'ME' ? 'Meeting' : subj.rating === 'AE' ? 'Approaching' : 'Below'})
                    </span>
                  </td>

                  <td className="py-2.5 px-3 border border-[#E2DCCB] text-[11px] text-[#2C3E35]">
                    {subj.teacherComment}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* AI Remarks Generation & Teacher Summary */}
        <div className="bg-[#F3EFE6] p-5 rounded-xl border border-[#E2DCCB] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8E2D0] pb-3">
            <h3 className="text-sm font-bold text-[#143626] font-serif-school flex items-center space-x-2">
              <Award className="w-4 h-4 text-[#C99A43]" />
              <span>Formative Assessment & Teacher Remarks</span>
            </h3>

            {!isPrintMode && (
              <button
                onClick={handleGenerateAiRemarks}
                disabled={isGeneratingAi}
                className="bg-[#143626] hover:bg-[#214E36] text-[#FAF8F3] text-xs font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all shadow-sm disabled:opacity-50"
              >
                {isGeneratingAi ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#C99A43]" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-[#F3D78A]" />
                )}
                <span>Generate AI Remarks (Antigravity)</span>
              </button>
            )}
          </div>

          <div className="space-y-3 text-xs text-[#143626]">
            <div>
              <span className="font-bold text-[#143626] uppercase text-[10px] block mb-1">Class Teacher Remarks:</span>
              <p className="p-3 bg-white rounded-lg border border-[#E2DCCB] leading-relaxed text-[#2C3E35]">
                "{currentReport.overallTeacherRemarks}"
              </p>
            </div>

            <div>
              <span className="font-bold text-[#143626] uppercase text-[10px] block mb-1">Formative Guidance & Target Improvement Areas:</span>
              <p className="p-3 bg-white rounded-lg border border-[#E2DCCB] text-[#2C3E35]">
                {currentReport.formativeGuidance}
              </p>
            </div>
          </div>
        </div>

        {/* Official Signatures & Stamp Section */}
        <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-[#143626]">
          <div className="border-t border-[#143626] pt-2">
            <span className="font-bold block">Class Teacher:</span>
            <span className="text-[11px] text-[#55695D]">Tr. Samuel Otieno</span>
            <span className="block italic text-[10px] text-emerald-800 mt-1">✓ Signed electronically</span>
          </div>

          <div className="border-t border-[#143626] pt-2">
            <span className="font-bold block">Headteacher:</span>
            <span className="text-[11px] text-[#55695D]">Mr. Boniface Ndegwa</span>
            <span className="block italic text-[10px] text-emerald-800 mt-1">✓ Approved for Term 2</span>
          </div>

          <div className="col-span-2 sm:col-span-1 flex items-center justify-center">
            <div className="border-2 border-[#143626] rounded-full p-3 text-center rotate-[-6deg] bg-emerald-50 text-[#143626]">
              <div className="font-black text-[10px] uppercase tracking-widest">VISPA ACADEMY</div>
              <div className="text-[8px] font-bold">APPROVED STAMP</div>
              <div className="text-[9px] font-mono">18 JUL 2026</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
