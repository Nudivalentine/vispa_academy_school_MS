import React, { useState } from 'react';
import { Student, FeeTransaction, UserRole } from '../types';
import { 
  CreditCard, 
  Send, 
  CheckCircle2, 
  Clock, 
  PhoneCall, 
  DollarSign, 
  ShieldCheck, 
  Download, 
  PlusCircle, 
  Search,
  MessageSquare,
  Building,
  Smartphone,
  Info
} from 'lucide-react';

interface FeeManagementViewProps {
  currentRole: UserRole;
  students: Student[];
  transactions: FeeTransaction[];
  onAddTransaction: (tx: FeeTransaction) => void;
  onUpdateFeeBalance: (studentId: string, amountPaid: number) => void;
}

export const FeeManagementView: React.FC<FeeManagementViewProps> = ({
  currentRole,
  students,
  transactions,
  onAddTransaction,
  onUpdateFeeBalance
}) => {
  const isSuperAdmin = currentRole.id === 'superadmin' || currentRole.id === 'admin';
  const isFinance = currentRole.id === 'finance' || currentRole.id === 'bursar' || isSuperAdmin;
  const isParent = currentRole.id === 'parent';
  const isStudent = currentRole.id === 'student';

  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [paymentAmount, setPaymentAmount] = useState<string>('5000');
  const [paymentType, setPaymentType] = useState<FeeTransaction['paymentType']>('Tuition Fee');
  const [smsStatus, setSmsStatus] = useState<string | null>(null);

  // Handle Parent & Student Scope Isolation
  const visibleTransactions = isParent || isStudent
    ? transactions.filter((tx) => tx.studentId === 'vis-001' || tx.studentId === selectedStudentId || (currentRole.admissionNo && tx.admissionNo.toLowerCase() === currentRole.admissionNo.toLowerCase()))
    : transactions;

  const visibleStudents = isParent || isStudent
    ? students.filter((s) => s.id === 'vis-001' || (currentRole.admissionNo && s.admissionNo.toLowerCase() === currentRole.admissionNo.toLowerCase()))
    : students;

  const selectedStudent = students.find((s) => s.id === selectedStudentId) || students[0];

  // Handle new payment simulation
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !paymentAmount) return;

    const amount = Number(paymentAmount);
    if (isNaN(amount) || amount <= 0) return;

    // Generate random M-Pesa Code (e.g. SGH982104A)
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomMpesa = 'S' + letters.charAt(Math.floor(Math.random() * 26)) + letters.charAt(Math.floor(Math.random() * 26)) + Math.floor(1000000 + Math.random() * 9000000);

    const now = new Date();
    const timestamp = now.toISOString().split('T')[0] + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newTx: FeeTransaction = {
      id: `tx-${Date.now()}`,
      studentId: selectedStudent.id,
      studentName: `${selectedStudent.firstName} ${selectedStudent.lastName}`,
      admissionNo: selectedStudent.admissionNo,
      grade: selectedStudent.grade,
      amount,
      paymentType,
      mpesaCode: randomMpesa,
      timestamp,
      status: 'Confirmed',
      payerPhone: selectedStudent.guardianPhone
    };

    onAddTransaction(newTx);
    onUpdateFeeBalance(selectedStudent.id, amount);

    setSmsStatus(`M-Pesa Receipt ${randomMpesa} confirmed! KSh ${amount.toLocaleString()} received for ${selectedStudent.firstName}. SMS receipt sent to ${selectedStudent.guardianPhone}.`);
    setTimeout(() => setSmsStatus(null), 8000);
  };

  // Bulk SMS Fee Reminder
  const handleSendBulkSms = () => {
    const debtorsCount = students.filter((s) => s.feeBalance > 0).length;
    setSmsStatus(`Bulk M-Pesa Fee Notice dispatched to ${debtorsCount} parents via Safaricom SMS Gateway!`);
    setTimeout(() => setSmsStatus(null), 6000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#FAF8F3] p-5 rounded-xl border border-[#E2DCCB] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#55695D] uppercase tracking-wider mb-1">
            <CreditCard className="w-4 h-4 text-[#143626]" />
            <span>Vispa Academy Bursar Office & Safaricom M-Pesa • Portal Role: {currentRole.label}</span>
          </div>
          <h2 className="text-2xl font-bold font-serif-school text-[#143626]">
            Fee Ledger & Paybill 400200 Portal
          </h2>
          <p className="text-xs text-[#55695D]">
            Official school Paybill: <span className="font-bold text-[#143626]">400200</span> • Account: <span className="font-mono font-bold text-[#143626]">Learner NEMIS / Admission Number</span>
          </p>
        </div>

        {isFinance && (
          <button
            onClick={handleSendBulkSms}
            className="bg-[#143626] hover:bg-[#214E36] text-[#FAF8F3] text-xs font-bold px-4 py-2.5 rounded-lg flex items-center space-x-2 transition-all shadow-sm"
          >
            <MessageSquare className="w-4 h-4 text-[#C99A43]" />
            <span>Dispatch Bulk SMS Reminders</span>
          </button>
        )}
      </div>

      {smsStatus && (
        <div className="bg-emerald-800 text-[#FAF8F3] p-4 rounded-xl text-xs font-bold flex items-center space-x-3 shadow-md animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-[#C99A43] flex-shrink-0" />
          <span>{smsStatus}</span>
        </div>
      )}

      {/* Main Grid: Payment Simulator + Fee Structure */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* M-Pesa Payment Entry Form */}
        <div className="bg-[#FAF8F3] p-5 rounded-xl border border-[#E2DCCB] shadow-sm space-y-4">
          <div className="flex items-center space-x-2 border-b border-[#E8E2D0] pb-3">
            <div className="p-1.5 bg-[#143626] text-[#EAD8A6] rounded">
              <PlusCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#143626] font-serif-school">
                Simulate M-Pesa Receipt
              </h3>
              <p className="text-[11px] text-[#55695D]">Receive fee payment for Grade 1-10 scholar</p>
            </div>
          </div>

          <form onSubmit={handlePaymentSubmit} className="space-y-3 text-xs text-[#143626]">
            <div>
              <label className="block font-bold text-[#55695D] uppercase text-[10px] mb-1">
                Select Scholar *
              </label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                disabled={isParent}
                className="w-full bg-[#F3EFE6] border border-[#D5CEBC] rounded-lg p-2 font-bold focus:outline-none disabled:opacity-80"
              >
                {visibleStudents.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.firstName} {s.lastName} (Grade {s.grade} - Bal: KSh {s.feeBalance.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-[#55695D] uppercase text-[10px] mb-1">
                  Amount Paid (KES) *
                </label>
                <input
                  type="number"
                  required
                  min={100}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full bg-[#F3EFE6] border border-[#D5CEBC] rounded-lg p-2 font-bold text-[#143626] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#55695D] uppercase text-[10px] mb-1">
                  Payment Category *
                </label>
                <select
                  value={paymentType}
                  onChange={(e) => setPaymentType(e.target.value as any)}
                  className="w-full bg-[#F3EFE6] border border-[#D5CEBC] rounded-lg p-2 font-medium focus:outline-none"
                >
                  <option value="Tuition Fee">Tuition Fee</option>
                  <option value="Lunch Program">Lunch Program</option>
                  <option value="Transport">Transport Service</option>
                  <option value="Boarding Amenities">Boarding Amenities</option>
                  <option value="CBC Activity Materials">CBC Activity Materials</option>
                </select>
              </div>
            </div>

            {selectedStudent && (
              <div className="p-3 bg-[#F3EFE6] rounded-lg border border-[#E2DCCB] space-y-1 text-[11px]">
                <div className="flex justify-between text-[#55695D]">
                  <span>Current Outstanding:</span>
                  <span className="font-bold text-amber-800">KSh {selectedStudent.feeBalance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#55695D]">
                  <span>New Balance After Payment:</span>
                  <span className="font-bold text-emerald-800">
                    KSh {Math.max(0, selectedStudent.feeBalance - Number(paymentAmount || 0)).toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#143626] hover:bg-[#214E36] text-[#FAF8F3] font-bold py-2.5 rounded-lg transition-all shadow-sm flex items-center justify-center space-x-2"
            >
              <Send className="w-4 h-4 text-[#C99A43]" />
              <span>Confirm & Generate M-Pesa Receipt</span>
            </button>
          </form>
        </div>

        {/* Vispa Term 2 Fee Structure Reference */}
        <div className="lg:col-span-2 bg-[#FAF8F3] p-5 rounded-xl border border-[#E2DCCB] shadow-sm">
          <div className="flex items-center justify-between mb-4 border-b border-[#E8E2D0] pb-3">
            <div>
              <h3 className="text-base font-bold text-[#143626] font-serif-school">
                Vispa Academy Approved Term Fee Structure (KES)
              </h3>
              <p className="text-xs text-[#55695D]">Official fees per grade tier & scholar category</p>
            </div>
            <span className="text-xs font-bold text-[#143626] bg-[#E2DCCB] px-2.5 py-1 rounded">
              Academic Year 2026
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#143626] text-[#FAF8F3] uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 px-3 border border-[#214E36]">Grade Level Tier</th>
                  <th className="py-2.5 px-3 border border-[#214E36]">Day Scholar Term Fee</th>
                  <th className="py-2.5 px-3 border border-[#214E36]">Boarding Scholar Term Fee</th>
                  <th className="py-2.5 px-3 border border-[#214E36]">Includes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2DCCB] text-[#143626]">
                <tr className="hover:bg-[#F3EFE6]">
                  <td className="py-2.5 px-3 border border-[#E2DCCB] font-bold">
                    Lower Primary (Grade 1 - 3)
                  </td>
                  <td className="py-2.5 px-3 border border-[#E2DCCB] font-bold text-emerald-800">
                    KSh 24,000 / term
                  </td>
                  <td className="py-2.5 px-3 border border-[#E2DCCB] font-bold text-amber-800">
                    KSh 42,000 / term
                  </td>
                  <td className="py-2.5 px-3 border border-[#E2DCCB] text-[11px] text-[#55695D]">
                    Tuition, CBC workbook activities, Hot tea & lunch
                  </td>
                </tr>

                <tr className="hover:bg-[#F3EFE6]">
                  <td className="py-2.5 px-3 border border-[#E2DCCB] font-bold">
                    Upper Primary (Grade 4 - 6)
                  </td>
                  <td className="py-2.5 px-3 border border-[#E2DCCB] font-bold text-emerald-800">
                    KSh 28,000 / term
                  </td>
                  <td className="py-2.5 px-3 border border-[#E2DCCB] font-bold text-amber-800">
                    KSh 42,000 / term
                  </td>
                  <td className="py-2.5 px-3 border border-[#E2DCCB] text-[11px] text-[#55695D]">
                    Tuition, Science practicals, Computer Lab access
                  </td>
                </tr>

                <tr className="hover:bg-[#F3EFE6]">
                  <td className="py-2.5 px-3 border border-[#E2DCCB] font-bold">
                    Junior Secondary (Grade 7 - 9 JSS)
                  </td>
                  <td className="py-2.5 px-3 border border-[#E2DCCB] font-bold text-emerald-800">
                    KSh 32,000 / term
                  </td>
                  <td className="py-2.5 px-3 border border-[#E2DCCB] font-bold text-amber-800">
                    KSh 48,000 / term
                  </td>
                  <td className="py-2.5 px-3 border border-[#E2DCCB] text-[11px] text-[#55695D]">
                    JSS Science lab chemicals, Agriculture project plot, Tech workshop
                  </td>
                </tr>

                <tr className="hover:bg-[#F3EFE6]">
                  <td className="py-2.5 px-3 border border-[#E2DCCB] font-bold">
                    Senior Secondary (Grade 10)
                  </td>
                  <td className="py-2.5 px-3 border border-[#E2DCCB] font-bold text-emerald-800">
                    N/A (Full Boarding)
                  </td>
                  <td className="py-2.5 px-3 border border-[#E2DCCB] font-bold text-amber-800">
                    KSh 52,000 / term
                  </td>
                  <td className="py-2.5 px-3 border border-[#E2DCCB] text-[11px] text-[#55695D]">
                    Full boarding facilities, Evening prep, Coding & ICT Hub
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Transaction History Table */}
      <div className="bg-[#FAF8F3] rounded-xl border border-[#E2DCCB] shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[#143626] font-serif-school">
            Recent M-Pesa Transaction Log
          </h3>
          <span className="text-xs text-[#55695D] font-medium">
            Total Logged: {visibleTransactions.length} Payments
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#143626]">
            <thead className="bg-[#143626] text-[#FAF8F3] uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Scholar Name</th>
                <th className="py-3 px-4">Admission</th>
                <th className="py-3 px-4">Grade</th>
                <th className="py-3 px-4">M-Pesa Code</th>
                <th className="py-3 px-4">Payment Category</th>
                <th className="py-3 px-4">Amount (KES)</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2DCCB]">
              {visibleTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-[#F3EFE6] transition-colors">
                  <td className="py-3 px-4 font-bold">{tx.studentName}</td>
                  <td className="py-3 px-4 font-mono">{tx.admissionNo}</td>
                  <td className="py-3 px-4 font-semibold">Grade {tx.grade}</td>
                  <td className="py-3 px-4 font-mono font-bold text-emerald-800">{tx.mpesaCode}</td>
                  <td className="py-3 px-4 text-[#55695D]">{tx.paymentType}</td>
                  <td className="py-3 px-4 font-extrabold text-emerald-800">+ KSh {tx.amount.toLocaleString()}</td>
                  <td className="py-3 px-4 text-[11px] text-[#55695D]">{tx.timestamp}</td>
                  <td className="py-3 px-4 text-right">
                    <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded font-bold text-[10px]">
                      ✓ {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
