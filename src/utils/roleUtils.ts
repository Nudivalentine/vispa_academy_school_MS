import { Student, UserRole } from '../types';

/**
 * Finds all students linked to a user role (for Parent or Student).
 * Staff and Admins get all students.
 */
export function getStudentsForRole(role: UserRole, students: Student[]): Student[] {
  if (!students || students.length === 0) return [];

  if (role.id === 'student') {
    // Student role: match strictly by admissionNo or userName
    const matched = students.filter((s) => {
      if (role.admissionNo && s.admissionNo.toLowerCase().replace(/\s+/g, '') === role.admissionNo.toLowerCase().replace(/\s+/g, '')) {
        return true;
      }
      if (role.userName && `${s.firstName} ${s.lastName}`.toLowerCase().trim() === role.userName.toLowerCase().trim()) {
        return true;
      }
      return false;
    });

    if (matched.length > 0) return matched;
    // Fallback default for initial demo student
    const defaultStudent = students.find((s) => s.id === 'vis-001') || students[0];
    return [defaultStudent];
  }

  if (role.id === 'parent') {
    // Parent role: match students linked by admissionNo, phone, email, or guardianName
    const matched = students.filter((s) => {
      if (role.admissionNo && s.admissionNo.toLowerCase().replace(/\s+/g, '') === role.admissionNo.toLowerCase().replace(/\s+/g, '')) {
        return true;
      }
      const cleanRolePhone = (role.phone || '').replace(/\D/g, '');
      const cleanGuardianPhone = (s.guardianPhone || '').replace(/\D/g, '');
      if (cleanRolePhone.length >= 6 && cleanGuardianPhone.length >= 6 && cleanGuardianPhone.includes(cleanRolePhone)) {
        return true;
      }
      if (role.email && s.guardianEmail && s.guardianEmail.toLowerCase().trim() === role.email.toLowerCase().trim()) {
        return true;
      }
      if (role.userName && s.guardianName && (s.guardianName.toLowerCase().trim().includes(role.userName.toLowerCase().trim()) || role.userName.toLowerCase().trim().includes(s.guardianName.toLowerCase().trim()))) {
        return true;
      }
      return false;
    });

    if (matched.length > 0) return matched;
    // Fallback default for initial demo parent
    const defaultStudent = students.find((s) => s.id === 'vis-001') || students[0];
    return [defaultStudent];
  }

  return students;
}

/**
 * Returns the primary student for a given UserRole.
 */
export function getPrimaryStudentForRole(role: UserRole, students: Student[]): Student {
  const roleStudents = getStudentsForRole(role, students);
  return roleStudents[0] || students[0];
}
