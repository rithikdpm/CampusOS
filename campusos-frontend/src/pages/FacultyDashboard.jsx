import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext.jsx';

const FacultyDashboard = () => {
  const { user } = useAuth();
  const [facultyProfile, setFacultyProfile] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [activeTab, setActiveTab] = useState('attendance');
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(true);

  // Attendance Form
  const [attForm, setAttForm] = useState({
    subjectId: '',
    studentId: '',
    attendanceDate: new Date().toISOString().split('T')[0],
    status: 'PRESENT',
    remarks: 'Present',
  });

  // Marks Form
  const [marksForm, setMarksForm] = useState({
    studentId: '',
    subjectId: '',
    examType: 'INTERNAL_ASSESSMENT_1',
    marksObtained: '',
    maxMarks: '100',
    comments: '',
  });

  // Review Form
  const [reviewRemark, setReviewRemark] = useState({});

  const loadFacultyData = async () => {
    try {
      setStatusMsg({ type: '', text: '' });
      // 1. Fetch Faculty Profile by User ID
      const profileRes = await axiosClient.get(`/profiles/faculty/user/${user.id}`);
      const profile = profileRes.data;
      setFacultyProfile(profile);

      // 2. Fetch Subjects, Students, and Pending Leaves
      const [subjRes, stuRes, leaveRes] = await Promise.all([
        axiosClient.get('/subjects'),
        axiosClient.get('/profiles/students'),
        axiosClient.get('/leaves/status/PENDING'),
      ]);

      setSubjects(subjRes.data || []);
      setStudents(stuRes.data || []);
      setPendingLeaves(leaveRes.data || []);

      if (subjRes.data?.length > 0) {
        setAttForm((prev) => ({ ...prev, subjectId: prev.subjectId || subjRes.data[0].id }));
        setMarksForm((prev) => ({ ...prev, subjectId: prev.subjectId || subjRes.data[0].id }));
      }
      if (stuRes.data?.length > 0) {
        setAttForm((prev) => ({ ...prev, studentId: prev.studentId || stuRes.data[0].id }));
        setMarksForm((prev) => ({ ...prev, studentId: prev.studentId || stuRes.data[0].id }));
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.response?.data?.message || 'Failed to initialize faculty portal.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadFacultyData();
    }
  }, [user]);

 const handleMarkAttendance = async (e) => {
    e.preventDefault();
    setStatusMsg({ type: '', text: '' });
    try {
      const payload = {
        studentId: Number(attForm.studentId),
        subjectId: Number(attForm.subjectId),
        date: attForm.attendanceDate,           // standard
        attendanceDate: attForm.attendanceDate, // alias
        status: attForm.status,
        remarks: attForm.remarks || '',
      };
      
      console.log('Submitting Attendance Payload:', payload);
      await axiosClient.post('/attendance/mark', payload);
      setStatusMsg({ type: 'success', text: 'Attendance logged successfully!' });
      setAttForm((prev) => ({ ...prev, remarks: '' }));
    } catch (err) {
      console.error('Attendance Error Response:', err.response?.data);
      const serverMsg = err.response?.data?.message 
        || (typeof err.response?.data === 'string' ? err.response?.data : null)
        || 'Attendance entry failed.';
      setStatusMsg({ type: 'error', text: serverMsg });
    }
  };

  const handlePublishMarks = async (e) => {
    e.preventDefault();
    setStatusMsg({ type: '', text: '' });
    try {
      await axiosClient.post('/marks/entry', {
        studentId: Number(marksForm.studentId),
        subjectId: Number(marksForm.subjectId),
        examType: marksForm.examType,
        marksObtained: Number(marksForm.marksObtained),
        maxMarks: Number(marksForm.maxMarks),
        comments: marksForm.comments,
      });
      setStatusMsg({ type: 'success', text: 'Academic marks evaluated and published!' });
      setMarksForm((prev) => ({ ...prev, marksObtained: '', comments: '' }));
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.response?.data?.message || 'Marks entry failed.' });
    }
  };

  const handleLeaveDecision = async (leaveRequestId, decisionStatus) => {
    if (!facultyProfile) return;
    setStatusMsg({ type: '', text: '' });
    try {
      await axiosClient.post('/leaves/review', {
        leaveRequestId: leaveRequestId,
        facultyId: facultyProfile.id,
        status: decisionStatus,
        reviewRemarks: reviewRemark[leaveRequestId] || `${decisionStatus} by faculty advisor`,
      });
      setStatusMsg({ type: 'success', text: `Leave application marked as ${decisionStatus}` });
      loadFacultyData();
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.response?.data?.message || 'Leave review update failed.' });
    }
  };

  if (loading) return <div style={{ padding: '24px' }}>Loading Faculty Control Center...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
      {/* Faculty Profile Banner */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>{user?.fullName}</h2>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>
            {facultyProfile?.designation} | Code: <strong>{facultyProfile?.employeeCode}</strong> | Dept: {facultyProfile?.department?.name}
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '13px', color: '#64748b' }}>Actionable Leave Requests</span>
          <h2 style={{ color: '#d97706' }}>{pendingLeaves.length}</h2>
        </div>
      </div>

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

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={() => setActiveTab('attendance')}
          className="btn-primary"
          style={{ backgroundColor: activeTab === 'attendance' ? '#2563eb' : '#64748b' }}
        >
          Log Attendance
        </button>
        <button
          onClick={() => setActiveTab('marks')}
          className="btn-primary"
          style={{ backgroundColor: activeTab === 'marks' ? '#2563eb' : '#64748b' }}
        >
          Publish Assessment Marks
        </button>
        <button
          onClick={() => setActiveTab('leaves')}
          className="btn-primary"
          style={{ backgroundColor: activeTab === 'leaves' ? '#2563eb' : '#64748b' }}
        >
          Student Leave Approvals ({pendingLeaves.length})
        </button>
      </div>

      {/* TAB 1: LOG ATTENDANCE */}
      {activeTab === 'attendance' && (
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
          <h3 style={{ marginBottom: '16px', textAlign: 'center' }}>Record Lecture Attendance</h3>
          <form onSubmit={handleMarkAttendance}>
            <div className="input-group">
              <label>Subject</label>
              <select
                value={attForm.subjectId}
                onChange={(e) => setAttForm({ ...attForm, subjectId: e.target.value })}
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
              <label>Student</label>
              <select
                value={attForm.studentId}
                onChange={(e) => setAttForm({ ...attForm, studentId: e.target.value })}
                required
              >
                <option value="">-- Select Student --</option>
                {students.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.user?.fullName} ({st.rollNumber})
                  </option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label>Date</label>
              <input
                type="date"
                required
                value={attForm.attendanceDate}
                onChange={(e) => setAttForm({ ...attForm, attendanceDate: e.target.value })}
              />
            </div>

            <div className="input-group">
              <label>Status</label>
              <select
                value={attForm.status}
                onChange={(e) => setAttForm({ ...attForm, status: e.target.value })}
              >
                <option value="PRESENT">PRESENT</option>
                <option value="ABSENT">ABSENT</option>
                <option value="EXCUSED">EXCUSED</option>
              </select>
            </div>

            <div className="input-group">
              <label>Remarks</label>
              <input
                type="text"
                value={attForm.remarks}
                onChange={(e) => setAttForm({ ...attForm, remarks: e.target.value })}
                placeholder="Optional observation or session note"
              />
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>
              Submit Attendance Log
            </button>
          </form>
        </div>
      )}

      {/* TAB 2: MARKS & EVALUATIONS */}
      {activeTab === 'marks' && (
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
          <h3 style={{ marginBottom: '16px', textAlign: 'center' }}>Publish Student Marks</h3>
          <form onSubmit={handlePublishMarks}>
            <div className="input-group">
              <label>Subject</label>
              <select
                value={marksForm.subjectId}
                onChange={(e) => setMarksForm({ ...marksForm, subjectId: e.target.value })}
                required
              >
                <option value="">-- Select Subject --</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.code})
                  </option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label>Student</label>
              <select
                value={marksForm.studentId}
                onChange={(e) => setMarksForm({ ...marksForm, studentId: e.target.value })}
                required
              >
                <option value="">-- Select Student --</option>
                {students.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.user?.fullName} ({st.rollNumber})
                  </option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label>Assessment Type</label>
              <select
                value={marksForm.examType}
                onChange={(e) => setMarksForm({ ...marksForm, examType: e.target.value })}
              >
                <option value="INTERNAL_ASSESSMENT_1">Internal Assessment 1</option>
                <option value="INTERNAL_ASSESSMENT_2">Internal Assessment 2</option>
                <option value="MID_TERM">Mid Term</option>
                <option value="END_SEMESTER">End Semester Final</option>
                <option value="LAB_PRACTICAL">Lab Practical Examination</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="input-group">
                <label>Marks Scored</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={marksForm.marksObtained}
                  onChange={(e) => setMarksForm({ ...marksForm, marksObtained: e.target.value })}
                  placeholder="e.g. 88.5"
                />
              </div>
              <div className="input-group">
                <label>Maximum Marks</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={marksForm.maxMarks}
                  onChange={(e) => setMarksForm({ ...marksForm, maxMarks: e.target.value })}
                />
              </div>
            </div>

            <div className="input-group">
              <label>Feedback / Evaluator Notes</label>
              <input
                type="text"
                value={marksForm.comments}
                onChange={(e) => setMarksForm({ ...marksForm, comments: e.target.value })}
                placeholder="e.g. Excellent algorithmic optimization"
              />
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>
              Submit Grade Evaluation
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: LEAVE APPROVAL DESK */}
      {activeTab === 'leaves' && (
        <div className="card" style={{ width: '100%', boxSizing: 'border-box' }}>
          <h3 style={{ marginBottom: '16px' }}>Pending Student Leave Requests</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                <th style={{ padding: '10px' }}>Student</th>
                <th style={{ padding: '10px' }}>Duration</th>
                <th style={{ padding: '10px' }}>Reason</th>
                <th style={{ padding: '10px' }}>Advisor Remark</th>
                <th style={{ padding: '10px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingLeaves.length > 0 ? (
                pendingLeaves.map((req) => (
                  <tr key={req.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px', fontWeight: 500 }}>
                      {req.student?.user?.fullName} ({req.student?.rollNumber})
                    </td>
                    <td style={{ padding: '10px', whiteSpace: 'nowrap' }}>
                      {req.startDate} to {req.endDate}
                    </td>
                    <td style={{ padding: '10px' }}>{req.reason}</td>
                    <td style={{ padding: '10px' }}>
                      <input
                        type="text"
                        placeholder="Optional remarks"
                        style={{ padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                        value={reviewRemark[req.id] || ''}
                        onChange={(e) => setReviewRemark({ ...reviewRemark, [req.id]: e.target.value })}
                      />
                    </td>
                    <td style={{ padding: '10px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button
                        onClick={() => handleLeaveDecision(req.id, 'APPROVED')}
                        style={{
                          backgroundColor: '#16a34a',
                          color: '#fff',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                        }}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleLeaveDecision(req.id, 'REJECTED')}
                        style={{
                          backgroundColor: '#dc2626',
                          color: '#fff',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                        }}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ padding: '16px', textAlign: 'center', color: '#94a3b8' }}>
                    No pending leave requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FacultyDashboard;