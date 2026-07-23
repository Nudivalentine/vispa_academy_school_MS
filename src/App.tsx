import React, { useState } from 'react';
import { UserRole, ActiveTab, Student, FeeTransaction } from './types';
import { INITIAL_STUDENTS, INITIAL_TRANSACTIONS, INITIAL_REGISTERED_USERS } from './data/mockData';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { StudentsView } from './components/StudentsView';
import { CbcAssessmentView } from './components/CbcAssessmentView';
import { FeeManagementView } from './components/FeeManagementView';
import { TimetableSubjectView } from './components/TimetableSubjectView';
import { SchoolInfoView } from './components/SchoolInfoView';
import { RegisteredUsersView } from './components/RegisteredUsersView';
import { StudentModal } from './components/StudentModal';
import { AuthModal } from './components/AuthModal';

const INITIAL_ROLES: UserRole[] = INITIAL_REGISTERED_USERS;

export default function App() {
  const [allRoles, setAllRoles] = useState<UserRole[]>(INITIAL_ROLES);
  const [currentRole, setCurrentRole] = useState<UserRole>(INITIAL_ROLES[0]);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [transactions, setTransactions] = useState<FeeTransaction[]>(INITIAL_TRANSACTIONS);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedReportStudentId, setSelectedReportStudentId] = useState<string | undefined>(undefined);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(true); // Opens on initial link launch!

  // Handlers
  const handleAddStudent = (newStudent: Student) => {
    setStudents((prev) => [newStudent, ...prev]);
  };

  const handleAddTransaction = (newTx: FeeTransaction) => {
    setTransactions((prev) => [newTx, ...prev]);
  };

  const handleUpdateFeeBalance = (studentId: string, amountPaid: number) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          return {
            ...s,
            feeBalance: Math.max(0, s.feeBalance - amountPaid)
          };
        }
        return s;
      })
    );
  };

  const handleOpenStudentReport = (studentId: string) => {
    setSelectedReportStudentId(studentId);
    setActiveTab('cbc');
  };

  const handleRegisterUser = (newRole: UserRole) => {
    setAllRoles((prev) => [newRole, ...prev]);
    setCurrentRole(newRole);
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    setIsAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F3] text-[#18221D] flex flex-col font-sans">
      {/* Top Header */}
      <Header
        currentRole={currentRole}
        allRoles={allRoles}
        onRoleChange={setCurrentRole}
        activeTab={activeTab}
        onNavigate={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <div className="flex flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        {/* Sidebar */}
        <Sidebar
          currentRole={currentRole}
          activeTab={activeTab}
          onNavigate={setActiveTab}
          studentCount={students.length}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onLogout={handleLogout}
        />

        {/* Content View */}
        <main className="flex-1 min-w-0">
          {activeTab === 'dashboard' && (
            <DashboardView
              currentRole={currentRole}
              students={students}
              transactions={transactions}
              onNavigate={setActiveTab}
              onOpenAddStudent={() => setIsAddStudentOpen(true)}
              onOpenAuthModal={() => setIsAuthModalOpen(true)}
            />
          )}

          {activeTab === 'users' && (
            <RegisteredUsersView
              currentRole={currentRole}
              allRoles={allRoles}
              onOpenAuthModal={() => setIsAuthModalOpen(true)}
              onRegisterUser={(newStaffRole) => setAllRoles((prev) => [newStaffRole, ...prev])}
            />
          )}

          {activeTab === 'students' && (
            <StudentsView
              currentRole={currentRole}
              students={students}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onOpenAddStudent={() => setIsAddStudentOpen(true)}
              onSelectReportCard={handleOpenStudentReport}
            />
          )}

          {activeTab === 'cbc' && (
            <CbcAssessmentView
              currentRole={currentRole}
              students={students}
              selectedStudentId={selectedReportStudentId}
            />
          )}

          {activeTab === 'fees' && (
            <FeeManagementView
              currentRole={currentRole}
              students={students}
              transactions={transactions}
              onAddTransaction={handleAddTransaction}
              onUpdateFeeBalance={handleUpdateFeeBalance}
            />
          )}

          {activeTab === 'timetable' && <TimetableSubjectView currentRole={currentRole} />}

          {activeTab === 'school-info' && <SchoolInfoView />}
        </main>
      </div>

      {/* Add Student Modal */}
      <StudentModal
        isOpen={isAddStudentOpen}
        onClose={() => setIsAddStudentOpen(false)}
        onAddStudent={handleAddStudent}
      />

      {/* Role Authentication & Registration Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentRole={currentRole}
        allRoles={allRoles}
        students={students}
        onSelectRole={(role) => {
          setCurrentRole(role);
          setIsAuthModalOpen(false);
        }}
        onRegisterUser={handleRegisterUser}
        onUpdateUserPassword={(roleId, newPass) => {
          setAllRoles((prev) =>
            prev.map((r) =>
              r.id === roleId ? { ...r, password: newPass, isTemporaryPassword: false } : r
            )
          );
        }}
      />

      {/* Footer */}
      <footer className="bg-[#143626] text-[#A9BBAF] text-xs py-4 border-t border-[#214E36] mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center sm:flex sm:justify-between sm:items-center space-y-2 sm:space-y-0">
          <p>© 2026 Vispa Academy Mixed School • Grade 1 to 10 CBC System (Kenya)</p>
          <p className="text-[#EAD8A6]">Vispa Mixed Primary & Junior Secondary School</p>
        </div>
      </footer>
    </div>
  );
}

