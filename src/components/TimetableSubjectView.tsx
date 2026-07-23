import React, { useState } from 'react';
import { GradeLevel, TimetableEntry, UserRole } from '../types';
import { INITIAL_TIMETABLE } from '../data/mockData';
import { Calendar, Clock, MapPin, UserCheck, Plus, Lock, ShieldAlert } from 'lucide-react';

interface TimetableSubjectViewProps {
  currentRole?: UserRole;
}

export const TimetableSubjectView: React.FC<TimetableSubjectViewProps> = ({ currentRole }) => {
  const userRole = currentRole || { id: 'student' as const, label: 'Student', subtitle: 'Student', userName: 'Scholar', avatar: 'ST' };
  // Default grade based on user role (Parent/Student grade vs default Grade 1)
  const userGrade = userRole.assignedGrade || (userRole.id === 'parent' || userRole.id === 'student' ? 1 : 1);
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>(userGrade as GradeLevel);
  const [selectedDay, setSelectedDay] = useState<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'>('Monday');
  const [timetable, setTimetable] = useState<TimetableEntry[]>(INITIAL_TIMETABLE);

  // Form state for adding new entry
  const [newSubject, setNewSubject] = useState('');
  const [newTimeSlot, setNewTimeSlot] = useState('11:00 AM - 11:40 AM');
  const [newTeacher, setNewTeacher] = useState('Tr. David Maina');
  const [newVenue, setNewVenue] = useState('Vispa Class Block');

  const canEditTimetable = 
    userRole.id === 'superadmin' || 
    userRole.id === 'admin' || 
    userRole.id === 'principal' || 
    userRole.id === 'deputy_principal' || 
    userRole.id === 'teacher';

  const filteredEntries = timetable.filter(
    (t) => t.grade === selectedGrade && t.day === selectedDay
  );

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEditTimetable || !newSubject) return;

    const entry: TimetableEntry = {
      id: `tt-${Date.now()}`,
      grade: selectedGrade,
      day: selectedDay,
      timeSlot: newTimeSlot,
      subject: newSubject,
      teacherName: newTeacher,
      venue: newVenue
    };

    setTimetable((prev) => [...prev, entry]);
    setNewSubject('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#FAF8F3] p-5 rounded-xl border border-[#E2DCCB] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#55695D] uppercase tracking-wider mb-1">
            <Calendar className="w-4 h-4 text-[#143626]" />
            <span>Vispa Academy Master Class Schedule</span>
            {!canEditTimetable && (
              <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-2 py-0.5 rounded flex items-center space-x-1">
                <Lock className="w-3 h-3 text-amber-700" />
                <span>Read-Only View</span>
              </span>
            )}
          </div>
          <h2 className="text-2xl font-bold font-serif-school text-[#143626]">
            Grade 1 to 10 Subject Timetables
          </h2>
          <p className="text-xs text-[#55695D]">
            {canEditTimetable
              ? "Managing daily lessons, laboratory sessions, and CBC practicals"
              : "Read-only view of published class schedules and teacher assignments for scholars and parents"}
          </p>
        </div>

        {/* Grade Selector */}
        <div className="flex items-center space-x-2">
          <label className="text-xs font-bold text-[#143626]">Grade Level:</label>
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(Number(e.target.value) as GradeLevel)}
            className="bg-[#143626] text-[#FAF8F3] text-xs font-bold px-3 py-2 rounded-lg border border-[#214E36] focus:outline-none"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((g) => (
              <option key={g} value={g}>
                Grade {g} {g <= 3 ? '(Lower Primary)' : g <= 6 ? '(Upper Primary)' : g <= 9 ? '(JSS)' : '(Senior)'}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Day Selector Pills */}
      <div className="flex items-center space-x-2 border-b border-[#E2DCCB] pb-3 overflow-x-auto">
        {(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const).map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              selectedDay === day
                ? 'bg-[#143626] text-[#FAF8F3] shadow-sm'
                : 'bg-[#F3EFE6] text-[#2C3E35] hover:bg-[#E2DCCB]'
            }`}
          >
            {day} Schedule
          </button>
        ))}
      </div>

      {/* Main Grid: Timetable List + Add Entry Form (Or Info Box for Non-Editors) */}
      <div className={`grid grid-cols-1 ${canEditTimetable ? 'lg:grid-cols-3' : 'lg:grid-cols-1'} gap-6`}>
        {/* Timetable List */}
        <div className={`${canEditTimetable ? 'lg:col-span-2' : 'lg:col-span-1'} bg-[#FAF8F3] p-5 rounded-xl border border-[#E2DCCB] shadow-sm space-y-4`}>
          <div className="flex items-center justify-between border-b border-[#E8E2D0] pb-3">
            <h3 className="text-base font-bold text-[#143626] font-serif-school">
              Grade {selectedGrade} • {selectedDay} Class Schedule
            </h3>
            <span className="text-xs font-semibold text-[#55695D]">
              {filteredEntries.length} Scheduled Lessons
            </span>
          </div>

          {filteredEntries.length === 0 ? (
            <div className="py-12 text-center text-[#55695D] space-y-2">
              <Clock className="w-8 h-8 text-[#143626] mx-auto opacity-40" />
              <p className="text-xs font-medium">No lessons logged for Grade {selectedGrade} on {selectedDay} yet.</p>
              {canEditTimetable && (
                <p className="text-[11px]">Use the quick scheduler form on the right to add lessons.</p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredEntries.map((slot) => (
                <div
                  key={slot.id}
                  className="p-4 bg-[#F3EFE6] rounded-xl border border-[#E2DCCB] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-[#143626] transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 bg-[#143626] text-[#EAD8A6] rounded-lg text-center min-w-[100px]">
                      <Clock className="w-4 h-4 mx-auto mb-1 text-[#C99A43]" />
                      <div className="text-[10px] font-mono font-bold leading-none">{slot.timeSlot}</div>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-[#143626] font-serif-school">
                        {slot.subject}
                      </h4>
                      <div className="text-xs text-[#55695D] flex items-center space-x-3 mt-1">
                        <span className="flex items-center space-x-1">
                          <UserCheck className="w-3.5 h-3.5 text-emerald-800" />
                          <span>{slot.teacherName}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-3.5 h-3.5 text-amber-800" />
                          <span>{slot.venue}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="bg-[#143626] text-[#FAF8F3] text-[10px] font-bold px-2.5 py-1 rounded">
                    Active Session
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Lesson Slot Scheduler - ONLY SHOWN TO ACADEMIC STAFF */}
        {canEditTimetable ? (
          <div className="bg-[#FAF8F3] p-5 rounded-xl border border-[#E2DCCB] shadow-sm space-y-4">
            <div className="border-b border-[#E8E2D0] pb-3">
              <h3 className="text-base font-bold text-[#143626] font-serif-school">
                Add Timetable Slot
              </h3>
              <p className="text-xs text-[#55695D]">Assign subject, teacher, and venue</p>
            </div>

            <form onSubmit={handleAddEntry} className="space-y-3 text-xs text-[#143626]">
              <div>
                <label className="block font-bold text-[#55695D] uppercase text-[10px] mb-1">Subject Name *</label>
                <input
                  type="text"
                  required
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="e.g. Integrated Science, Kiswahili..."
                  className="w-full bg-[#F3EFE6] border border-[#D5CEBC] rounded-lg p-2 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#55695D] uppercase text-[10px] mb-1">Time Slot *</label>
                <input
                  type="text"
                  required
                  value={newTimeSlot}
                  onChange={(e) => setNewTimeSlot(e.target.value)}
                  placeholder="08:20 AM - 09:00 AM"
                  className="w-full bg-[#F3EFE6] border border-[#D5CEBC] rounded-lg p-2 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-[#55695D] uppercase text-[10px] mb-1">Teacher *</label>
                <input
                  type="text"
                  required
                  value={newTeacher}
                  onChange={(e) => setNewTeacher(e.target.value)}
                  placeholder="Tr. Caroline Chebet"
                  className="w-full bg-[#F3EFE6] border border-[#D5CEBC] rounded-lg p-2 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#55695D] uppercase text-[10px] mb-1">Room / Venue *</label>
                <input
                  type="text"
                  required
                  value={newVenue}
                  onChange={(e) => setNewVenue(e.target.value)}
                  placeholder="JSS Science Lab 1"
                  className="w-full bg-[#F3EFE6] border border-[#D5CEBC] rounded-lg p-2 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#143626] hover:bg-[#214E36] text-[#FAF8F3] font-bold py-2.5 rounded-lg transition-all flex items-center justify-center space-x-2 shadow-sm"
              >
                <Plus className="w-4 h-4 text-[#C99A43]" />
                <span>Schedule Slot for G{selectedGrade}</span>
              </button>
            </form>
          </div>
        ) : null}
      </div>
    </div>
  );
};
