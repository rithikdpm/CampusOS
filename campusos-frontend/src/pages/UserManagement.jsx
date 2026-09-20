import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const UserManagement = () => {
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [activeTab, setActiveTab] = useState('student');
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  // Student Form State
  const [studentForm, setStudentForm] = useState({
    fullName: '',
    email: '',
    password: '',
    rollNumber: '',
    courseId: '',
    currentSemester: 1,
    admissionDate: new Date().toISOString().split('T')[0],
    phone: '',
  });

  // Faculty Form State
  const [facultyForm, setFacultyForm] = useState({
    fullName: '',
    email: '',
    password: '',
    employeeCode: '',
    designation: 'Assistant Professor',
    departmentId: '',
    joiningDate: new Date().toISOString().split('T')[0],
    phone: '',
  });

  // Subject Allocation State
  const [allocForm, setAllocForm] = useState({
    subjectId: '',
    facultyId: '',
  });

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [cRes, dRes, sRes] = await Promise.all([
          axiosClient.get('/academic/courses'),
          axiosClient.get('/academic/departments'),
          axiosClient.get('/subjects'),
        ]);
        setCourses(cRes.data);
        setDepartments(dRes.data);
        setSubjects(sRes.data);

        if (cRes.data.length > 0) {
          setStudentForm((prev) => ({ ...prev, courseId: cRes.data[0].id }));
        }
        if (dRes.data.length > 0) {
          setFacultyForm((prev) => ({ ...prev, departmentId: dRes.data[0].id }));
        }
      } catch (err) {
        setStatusMsg({ type: 'error', text: 'Failed to load system metadata.' });
      }
    };
    fetchMetadata();
  }, []);

  const handleRegisterStudent = async (e) => {
    e.preventDefault();
    setStatusMsg({ type: '', text: '' });
    try {
      await axiosClient.post('/auth/register', {
        fullName: studentForm.fullName,
        email: studentForm.email,
        password: studentForm.password,
        role: 'ROLE_STUDENT',
      });

      const loginRes = await axiosClient.post('/auth/login', {
        email: studentForm.email,
        password: studentForm.password,
      });
      const newUserId = loginRes.data.id;

      await axiosClient.post('/profiles/students', {
        userId: newUserId,
        rollNumber: studentForm.rollNumber,
        courseId: Number(studentForm.courseId),
        currentSemester: Number(studentForm.currentSemester),
        admissionDate: studentForm.admissionDate,
        phone: studentForm.phone,
      });

      setStatusMsg({ type: 'success', text: `Student ${studentForm.fullName} enrolled successfully!` });
      setStudentForm({
        fullName: '',
        email: '',
        password: '',
        rollNumber: '',
        courseId: courses[0]?.id || '',
        currentSemester: 1,
        admissionDate: new Date().toISOString().split('T')[0],
        phone: '',
      });
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.response?.data?.message || 'Failed to enroll student.' });
    }
  };

  const handleRegisterFaculty = async (e) => {
    e.preventDefault();
    setStatusMsg({ type: '', text: '' });
    try {
      await axiosClient.post('/auth/register', {
        fullName: facultyForm.fullName,
        email: facultyForm.email,
        password: facultyForm.password,
        role: 'ROLE_FACULTY',
      });

      const loginRes = await axiosClient.post('/auth/login', {
        email: facultyForm.email,
        password: facultyForm.password,
      });
      const newUserId = loginRes.data.id;

      await axiosClient.post('/profiles/faculty', {
        userId: newUserId,
        employeeCode: facultyForm.employeeCode,
        designation: facultyForm.designation,
        departmentId: Number(facultyForm.departmentId),
        joiningDate: facultyForm.joiningDate,
        phone: facultyForm.phone,
      });

      setStatusMsg({ type: 'success', text: `Faculty member ${facultyForm.fullName} registered successfully!` });
      setFacultyForm({
        fullName: '',
        email: '',
        password: '',
        employeeCode: '',
        designation: 'Assistant Professor',
        departmentId: departments[0]?.id || '',
        joiningDate: new Date().toISOString().split('T')[0],
        phone: '',
      });
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.response?.data?.message || 'Failed to register faculty.' });
    }
  };

  const handleAssignFaculty = async (e) => {
    e.preventDefault();
    setStatusMsg({ type: '', text: '' });
    try {
      await axiosClient.post('/subjects/assign-faculty', {
        subjectId: Number(allocForm.subjectId),
        facultyId: Number(allocForm.facultyId),
      });
      setStatusMsg({ type: 'success', text: 'Faculty assigned to subject successfully!' });
      setAllocForm({ subjectId: '', facultyId: '' });
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.response?.data?.message || 'Allocation failed.' });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h2>Academic User Administration</h2>

      {statusMsg.text && (
        <div
          style={{
            padding: '12px',
            borderRadius: '6px',
            backgroundColor: statusMsg.type === 'success' ? '#dcfce7' : '#fee2e2',
            color: statusMsg.type === 'success' ? '#15803d' : '#b91c1c',
          }}
        >
          {statusMsg.text}
        </div>
      )}

      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={() => setActiveTab('student')}
          className="btn-primary"
          style={{ backgroundColor: activeTab === 'student' ? '#2563eb' : '#94a3b8' }}
        >
          Student Onboarding
        </button>
        <button
          onClick={() => setActiveTab('faculty')}
          className="btn-primary"
          style={{ backgroundColor: activeTab === 'faculty' ? '#2563eb' : '#94a3b8' }}
        >
          Faculty Onboarding
        </button>
        <button
          onClick={() => setActiveTab('alloc')}
          className="btn-primary"
          style={{ backgroundColor: activeTab === 'alloc' ? '#2563eb' : '#94a3b8' }}
        >
          Subject Allocation
        </button>
      </div>

      {activeTab === 'student' && (
        <div className="card">
          <h3 style={{ marginBottom: '16px' }}>Student Admission Form</h3>
          <form onSubmit={handleRegisterStudent} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="input-group">
              <label>Full Name</label>
              <input
                type="text"
                required
                value={studentForm.fullName}
                onChange={(e) => setStudentForm({ ...studentForm, fullName: e.target.value })}
                placeholder="Jane Doe"
              />
            </div>
            <div className="input-group">
              <label>Institutional Email</label>
              <input
                type="email"
                required
                value={studentForm.email}
                onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                placeholder="jane@campusos.com"
              />
            </div>
            <div className="input-group">
              <label>Initial Password</label>
              <input
                type="password"
                required
                value={studentForm.password}
                onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })}
                placeholder="••••••••"
              />
            </div>
            <div className="input-group">
              <label>Roll / Matriculation Number</label>
              <input
                type="text"
                required
                value={studentForm.rollNumber}
                onChange={(e) => setStudentForm({ ...studentForm, rollNumber: e.target.value })}
                placeholder="CS2026-002"
              />
            </div>
            <div className="input-group">
              <label>Course</label>
              <select
                value={studentForm.courseId}
                onChange={(e) => setStudentForm({ ...studentForm, courseId: e.target.value })}
                required
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
            </div>
            <div className="input-group">
              <label>Current Semester</label>
              <input
                type="number"
                min="1"
                max="8"
                required
                value={studentForm.currentSemester}
                onChange={(e) => setStudentForm({ ...studentForm, currentSemester: e.target.value })}
              />
            </div>
            <div className="input-group">
              <label>Admission Date</label>
              <input
                type="date"
                required
                value={studentForm.admissionDate}
                onChange={(e) => setStudentForm({ ...studentForm, admissionDate: e.target.value })}
              />
            </div>
            <div className="input-group">
              <label>Contact Phone</label>
              <input
                type="tel"
                required
                value={studentForm.phone}
                onChange={(e) => setStudentForm({ ...studentForm, phone: e.target.value })}
                placeholder="+919876543210"
              />
            </div>
            <button type="submit" className="btn-primary" style={{ gridColumn: 'span 2', marginTop: '10px' }}>
              Complete Admission
            </button>
          </form>
        </div>
      )}

      {activeTab === 'faculty' && (
        <div className="card">
          <h3 style={{ marginBottom: '16px' }}>Faculty Appointment Form</h3>
          <form onSubmit={handleRegisterFaculty} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="input-group">
              <label>Full Name</label>
              <input
                type="text"
                required
                value={facultyForm.fullName}
                onChange={(e) => setFacultyForm({ ...facultyForm, fullName: e.target.value })}
                placeholder="Dr. Katherine Johnson"
              />
            </div>
            <div className="input-group">
              <label>Institutional Email</label>
              <input
                type="email"
                required
                value={facultyForm.email}
                onChange={(e) => setFacultyForm({ ...facultyForm, email: e.target.value })}
                placeholder="kjohnson@campusos.com"
              />
            </div>
            <div className="input-group">
              <label>Initial Password</label>
              <input
                type="password"
                required
                value={facultyForm.password}
                onChange={(e) => setFacultyForm({ ...facultyForm, password: e.target.value })}
                placeholder="••••••••"
              />
            </div>
            <div className="input-group">
              <label>Employee Code</label>
              <input
                type="text"
                required
                value={facultyForm.employeeCode}
                onChange={(e) => setFacultyForm({ ...facultyForm, employeeCode: e.target.value })}
                placeholder="FAC-CSE-002"
              />
            </div>
            <div className="input-group">
              <label>Designation</label>
              <select
                value={facultyForm.designation}
                onChange={(e) => setFacultyForm({ ...facultyForm, designation: e.target.value })}
              >
                <option value="Assistant Professor">Assistant Professor</option>
                <option value="Associate Professor">Associate Professor</option>
                <option value="Professor">Professor</option>
                <option value="Head of Department">Head of Department</option>
              </select>
            </div>
            <div className="input-group">
              <label>Department</label>
              <select
                value={facultyForm.departmentId}
                onChange={(e) => setFacultyForm({ ...facultyForm, departmentId: e.target.value })}
                required
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.code})
                  </option>
                ))}
              </select>
            </div>
            <div className="input-group">
              <label>Joining Date</label>
              <input
                type="date"
                required
                value={facultyForm.joiningDate}
                onChange={(e) => setFacultyForm({ ...facultyForm, joiningDate: e.target.value })}
              />
            </div>
            <div className="input-group">
              <label>Contact Phone</label>
              <input
                type="tel"
                required
                value={facultyForm.phone}
                onChange={(e) => setFacultyForm({ ...facultyForm, phone: e.target.value })}
                placeholder="+919876543212"
              />
            </div>
            <button type="submit" className="btn-primary" style={{ gridColumn: 'span 2', marginTop: '10px' }}>
              Complete Appointment
            </button>
          </form>
        </div>
      )}

      {activeTab === 'alloc' && (
        <div className="card" style={{ maxWidth: '500px' }}>
          <h3 style={{ marginBottom: '16px' }}>Assign Faculty to Subject</h3>
          <form onSubmit={handleAssignFaculty}>
            <div className="input-group">
              <label>Subject</label>
              <select
                value={allocForm.subjectId}
                onChange={(e) => setAllocForm({ ...allocForm, subjectId: e.target.value })}
                required
              >
                <option value="">-- Choose Subject --</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.code}) - Sem {s.semester}
                  </option>
                ))}
              </select>
            </div>
            <div className="input-group">
              <label>Faculty Member ID</label>
              <input
                type="number"
                required
                value={allocForm.facultyId}
                onChange={(e) => setAllocForm({ ...allocForm, facultyId: e.target.value })}
                placeholder="Enter Faculty ID (e.g. 1)"
              />
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>
              Assign Instructor
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default UserManagement;