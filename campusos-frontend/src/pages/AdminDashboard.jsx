import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Creation forms
  const [deptForm, setDeptForm] = useState({ name: '', code: '', description: '' });
  const [courseForm, setCourseForm] = useState({ name: '', code: '', totalSemesters: 8, departmentId: '' });

  // Timetable scheduling form
  const [timetableForm, setTimetableForm] = useState({
    courseId: '',
    semester: 1,
    subjectId: '',
    facultyId: '',
    dayOfWeek: 'MONDAY',
    startTime: '09:00:00',
    endTime: '10:00:00',
    roomNumber: 'LH-101',
  });
  const [timetableMsg, setTimetableMsg] = useState({ type: '', text: '' });

  const fetchData = async () => {
    try {
      setError('');
      const [statsRes, deptRes, courseRes, subjRes, facRes] = await Promise.all([
        axiosClient.get('/admin/dashboard/stats'),
        axiosClient.get('/academic/departments'),
        axiosClient.get('/academic/courses'),
        axiosClient.get('/subjects'),
        axiosClient.get('/profiles/faculty'),
      ]);

      setStats(statsRes.data);
      setDepartments(deptRes.data);
      setCourses(courseRes.data);
      setSubjects(subjRes.data);
      setFaculties(facRes.data);

      if (deptRes.data.length > 0 && !courseForm.departmentId) {
        setCourseForm((prev) => ({ ...prev, departmentId: deptRes.data[0].id }));
      }
      if (courseRes.data.length > 0 && !timetableForm.courseId) {
        setTimetableForm((prev) => ({ ...prev, courseId: courseRes.data[0].id }));
      }
      if (subjRes.data.length > 0 && !timetableForm.subjectId) {
        setTimetableForm((prev) => ({ ...prev, subjectId: subjRes.data[0].id }));
      }
      if (facRes.data.length > 0 && !timetableForm.facultyId) {
        setTimetableForm((prev) => ({ ...prev, facultyId: facRes.data[0].id }));
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateDepartment = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post('/academic/departments', deptForm);
      setDeptForm({ name: '', code: '', description: '' });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create department');
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post('/academic/courses', {
        ...courseForm,
        departmentId: Number(courseForm.departmentId),
        totalSemesters: Number(courseForm.totalSemesters),
      });
      setCourseForm({ name: '', code: '', totalSemesters: 8, departmentId: departments[0]?.id || '' });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create course');
    }
  };

  const handleScheduleLecture = async (e) => {
    e.preventDefault();
    setTimetableMsg({ type: '', text: '' });
    try {
      const formattedStartTime = timetableForm.startTime.length === 5 
        ? `${timetableForm.startTime}:00` 
        : timetableForm.startTime;
      const formattedEndTime = timetableForm.endTime.length === 5 
        ? `${timetableForm.endTime}:00` 
        : timetableForm.endTime;

      await axiosClient.post('/timetables/schedule', {
        courseId: Number(timetableForm.courseId),
        semester: Number(timetableForm.semester),
        subjectId: Number(timetableForm.subjectId),
        facultyId: Number(timetableForm.facultyId),
        dayOfWeek: timetableForm.dayOfWeek,
        startTime: formattedStartTime,
        endTime: formattedEndTime,
        roomNumber: timetableForm.roomNumber,
      });

      setTimetableMsg({ type: 'success', text: 'Lecture scheduled successfully!' });
    } catch (err) {
      setTimetableMsg({
        type: 'error',
        text: err.response?.data?.message || 'Failed to schedule lecture slot.',
      });
    }
  };

  if (loading) return <div style={{ padding: '24px' }}>Loading Admin Console...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
      <h2 style={{ textAlign: 'center', color: '#f8fafc' }}>Admin Control Center</h2>

      {error && (
        <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '12px', borderRadius: '6px' }}>
          {error}
        </div>
      )}

      {/* Metrics Grid */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
          <div className="card" style={{ borderLeft: '4px solid #2563eb' }}>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>STUDENTS</span>
            <h3 style={{ fontSize: '24px', marginTop: '6px' }}>{stats.totalStudents}</h3>
          </div>
          <div className="card" style={{ borderLeft: '4px solid #059669' }}>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>FACULTY</span>
            <h3 style={{ fontSize: '24px', marginTop: '6px' }}>{stats.totalFaculty}</h3>
          </div>
          <div className="card" style={{ borderLeft: '4px solid #d97706' }}>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>DEPARTMENTS</span>
            <h3 style={{ fontSize: '24px', marginTop: '6px' }}>{stats.totalDepartments}</h3>
          </div>
          <div className="card" style={{ borderLeft: '4px solid #7c3aed' }}>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>ACTIVE DRIVES</span>
            <h3 style={{ fontSize: '24px', marginTop: '6px' }}>{stats.totalActiveJobs}</h3>
          </div>
          <div className="card" style={{ borderLeft: '4px solid #e11d48' }}>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>PLACEMENT RATE</span>
            <h3 style={{ fontSize: '24px', marginTop: '6px' }}>{stats.overallPlacementRate}%</h3>
          </div>
        </div>
      )}

      {/* Forms Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>
        {/* Department Creator */}
        <div className="card">
          <h3 style={{ marginBottom: '16px' }}>Create Department</h3>
          <form onSubmit={handleCreateDepartment}>
            <div className="input-group">
              <label>Department Name</label>
              <input
                type="text"
                value={deptForm.name}
                onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
                required
                placeholder="e.g. Mechanical Engineering"
              />
            </div>
            <div className="input-group">
              <label>Code</label>
              <input
                type="text"
                value={deptForm.code}
                onChange={(e) => setDeptForm({ ...deptForm, code: e.target.value.toUpperCase() })}
                required
                placeholder="e.g. MECH"
              />
            </div>
            <div className="input-group">
              <label>Description</label>
              <input
                type="text"
                value={deptForm.description}
                onChange={(e) => setDeptForm({ ...deptForm, description: e.target.value })}
                placeholder="e.g. School of Mechanical Sciences"
              />
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%' }}>
              Add Department
            </button>
          </form>
        </div>

        {/* Course Creator */}
        <div className="card">
          <h3 style={{ marginBottom: '16px' }}>Create Course</h3>
          <form onSubmit={handleCreateCourse}>
            <div className="input-group">
              <label>Course Name</label>
              <input
                type="text"
                value={courseForm.name}
                onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                required
                placeholder="e.g. M.Tech Artificial Intelligence"
              />
            </div>
            <div className="input-group">
              <label>Code</label>
              <input
                type="text"
                value={courseForm.code}
                onChange={(e) => setCourseForm({ ...courseForm, code: e.target.value.toUpperCase() })}
                required
                placeholder="e.g. MTECH-AI"
              />
            </div>
            <div className="input-group">
              <label>Department</label>
              <select
                value={courseForm.departmentId}
                onChange={(e) => setCourseForm({ ...courseForm, departmentId: e.target.value })}
                required
              >
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name} ({dept.code})
                  </option>
                ))}
              </select>
            </div>
            <div className="input-group">
              <label>Total Semesters</label>
              <input
                type="number"
                min="1"
                max="12"
                value={courseForm.totalSemesters}
                onChange={(e) => setCourseForm({ ...courseForm, totalSemesters: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={departments.length === 0}>
              Add Course
            </button>
          </form>
        </div>
      </div>

      {/* Timetable Scheduler */}
      <div className="card" style={{ width: '100%', boxSizing: 'border-box' }}>
        <h3>Lecture Timetable Scheduler</h3>
        <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '16px' }}>
          Configure class routines, classroom allocations, and faculty slots.
        </p>

        {timetableMsg.text && (
          <div
            style={{
              padding: '10px',
              borderRadius: '6px',
              marginBottom: '14px',
              backgroundColor: timetableMsg.type === 'success' ? '#dcfce7' : '#fee2e2',
              color: timetableMsg.type === 'success' ? '#15803d' : '#b91c1c',
            }}
          >
            {timetableMsg.text}
          </div>
        )}

        <form onSubmit={handleScheduleLecture}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div className="input-group">
              <label>Course Program</label>
              <select
                value={timetableForm.courseId}
                onChange={(e) => setTimetableForm({ ...timetableForm, courseId: e.target.value })}
                required
              >
                <option value="">-- Select Course --</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label>Semester</label>
              <select
                value={timetableForm.semester}
                onChange={(e) => setTimetableForm({ ...timetableForm, semester: Number(e.target.value) })}
                required
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s}>
                    Semester {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label>Subject</label>
              <select
                value={timetableForm.subjectId}
                onChange={(e) => setTimetableForm({ ...timetableForm, subjectId: e.target.value })}
                required
              >
                <option value="">-- Select Subject --</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.code}) - Sem {s.semester}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label>Assigned Faculty</label>
              <select
                value={timetableForm.facultyId}
                onChange={(e) => setTimetableForm({ ...timetableForm, facultyId: e.target.value })}
                required
              >
                <option value="">-- Select Faculty --</option>
                {faculties.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.user?.fullName} ({f.employeeCode})
                  </option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label>Day of Week</label>
              <select
                value={timetableForm.dayOfWeek}
                onChange={(e) => setTimetableForm({ ...timetableForm, dayOfWeek: e.target.value })}
              >
                {['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'].map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label>Start Time</label>
              <input
                type="time"
                required
                value={timetableForm.startTime.substring(0, 5)}
                onChange={(e) => setTimetableForm({ ...timetableForm, startTime: `${e.target.value}:00` })}
              />
            </div>

            <div className="input-group">
              <label>End Time</label>
              <input
                type="time"
                required
                value={timetableForm.endTime.substring(0, 5)}
                onChange={(e) => setTimetableForm({ ...timetableForm, endTime: `${e.target.value}:00` })}
              />
            </div>

            <div className="input-group">
              <label>Room / Hall</label>
              <input
                type="text"
                required
                placeholder="e.g. LH-101, CS-Lab-2"
                value={timetableForm.roomNumber}
                onChange={(e) => setTimetableForm({ ...timetableForm, roomNumber: e.target.value })}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '14px' }}>
            Schedule Lecture Slot
          </button>
        </form>
      </div>

      {/* Directory Tables */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>
        <div className="card">
          <h3 style={{ marginBottom: '12px' }}>Registered Departments</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                <th style={{ padding: '8px' }}>Code</th>
                <th style={{ padding: '8px' }}>Name</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((d) => (
                <tr key={d.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '8px', fontWeight: 600 }}>{d.code}</td>
                  <td style={{ padding: '8px' }}>{d.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '12px' }}>Registered Courses</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                <th style={{ padding: '8px' }}>Code</th>
                <th style={{ padding: '8px' }}>Course</th>
                <th style={{ padding: '8px' }}>Dept</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '8px', fontWeight: 600 }}>{c.code}</td>
                  <td style={{ padding: '8px' }}>{c.name}</td>
                  <td style={{ padding: '8px', color: '#64748b' }}>{c.department?.code}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;