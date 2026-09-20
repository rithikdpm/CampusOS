import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext.jsx';

const StudentPortal = () => {
  const { user } = useAuth();
  const [studentProfile, setStudentProfile] = useState(null);
  const [transcript, setTranscript] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  const [activeTab, setActiveTab] = useState('transcript');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Leave Form State
  const [leaveForm, setLeaveForm] = useState({
    startDate: '',
    endDate: '',
    reason: '',
  });
  const [leaveStatusMsg, setLeaveStatusMsg] = useState({ type: '', text: '' });

  const fetchStudentData = async () => {
    try {
      setError('');
      // 1. Fetch student profile by authenticated User ID
      const profileRes = await axiosClient.get(`/profiles/students/user/${user.id}`);
      const profile = profileRes.data;
      setStudentProfile(profile);

      // 2. Load transcript, attendance, leave records, and job placement data
      const [transRes, attRes, leaveRes, jobRes, myAppsRes] = await Promise.all([
        axiosClient.get(`/marks/transcript/student/${profile.id}`),
        axiosClient.get(`/attendance/student/${profile.id}`),
        axiosClient.get(`/leaves/student/${profile.id}`),
        axiosClient.get('/placement/jobs'),
        axiosClient.get(`/placement/applications/student/${profile.id}`),
      ]);

      setTranscript(transRes.data);
      setAttendanceRecords(attRes.data);
      setLeaveHistory(leaveRes.data);
      setJobs(jobRes.data);
      setAppliedJobIds(myAppsRes.data.map((app) => app.jobPosting?.id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load student profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchStudentData();
    }
  }, [user]);

  const handleApplyLeave = async (e) => {
    e.preventDefault();
    setLeaveStatusMsg({ type: '', text: '' });

    if (!studentProfile) return;

    try {
      await axiosClient.post('/leaves/apply', {
        studentId: studentProfile.id,
        startDate: leaveForm.startDate,
        endDate: leaveForm.endDate,
        reason: leaveForm.reason,
      });

      setLeaveStatusMsg({ type: 'success', text: 'Leave application submitted successfully!' });
      setLeaveForm({ startDate: '', endDate: '', reason: '' });
      fetchStudentData();
    } catch (err) {
      setLeaveStatusMsg({
        type: 'error',
        text: err.response?.data?.message || 'Failed to submit leave request.',
      });
    }
  };

  const handleApplyJob = async (jobId) => {
    try {
      await axiosClient.post('/placement/applications/apply', {
        studentId: studentProfile.id,
        jobPostingId: jobId,
      });
      setAppliedJobIds((prev) => [...prev, jobId]);
      alert('Application submitted successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Application failed.');
    }
  };

  if (loading) return <div style={{ padding: '24px' }}>Loading Student Academic Records...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Profile Badge */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>{user?.fullName}</h2>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>
            Roll No: <strong>{studentProfile?.rollNumber || 'N/A'}</strong> | Course: {studentProfile?.course?.name} (Sem {studentProfile?.currentSemester})
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '13px', color: '#64748b' }}>Cumulative Academic Score</span>
          <h2 style={{ color: '#2563eb' }}>{transcript?.overallPercentage ? `${transcript.overallPercentage}%` : 'N/A'}</h2>
        </div>
      </div>

      {error && (
        <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '12px', borderRadius: '6px' }}>
          {error}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveTab('transcript')}
          className="btn-primary"
          style={{ backgroundColor: activeTab === 'transcript' ? '#2563eb' : '#94a3b8' }}
        >
          Grades & Marks
        </button>
        <button
          onClick={() => setActiveTab('attendance')}
          className="btn-primary"
          style={{ backgroundColor: activeTab === 'attendance' ? '#2563eb' : '#94a3b8' }}
        >
          Attendance Logs
        </button>
        <button
          onClick={() => setActiveTab('leave')}
          className="btn-primary"
          style={{ backgroundColor: activeTab === 'leave' ? '#2563eb' : '#94a3b8' }}
        >
          Leave Management
        </button>
        <button
          onClick={() => setActiveTab('jobs')}
          className="btn-primary"
          style={{ backgroundColor: activeTab === 'jobs' ? '#2563eb' : '#94a3b8' }}
        >
          Placement Job Board
        </button>
      </div>

      {/* TAB 1: ACADEMIC MARKS & TRANSCRIPT */}
      {activeTab === 'transcript' && (
        <div className="card">
          <h3 style={{ marginBottom: '16px' }}>Assessment Grades</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                <th style={{ padding: '10px' }}>Subject</th>
                <th style={{ padding: '10px' }}>Exam Type</th>
                <th style={{ padding: '10px' }}>Score</th>
                <th style={{ padding: '10px' }}>Grade</th>
                <th style={{ padding: '10px' }}>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {transcript?.marksList && transcript.marksList.length > 0 ? (
                transcript.marksList.map((m) => (
                  <tr key={m.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px', fontWeight: 500 }}>{m.subject?.name} ({m.subject?.code})</td>
                    <td style={{ padding: '10px' }}>{m.examType?.replace(/_/g, ' ')}</td>
                    <td style={{ padding: '10px' }}>{m.marksObtained} / {m.maxMarks}</td>
                    <td style={{ padding: '10px', fontWeight: 'bold', color: m.grade === 'F' ? '#dc2626' : '#16a34a' }}>
                      {m.grade}
                    </td>
                    <td style={{ padding: '10px', color: '#64748b' }}>{m.comments || '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ padding: '16px', textAlign: 'center', color: '#94a3b8' }}>
                    No assessment records published yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 2: ATTENDANCE LOGS */}
      {activeTab === 'attendance' && (
        <div className="card">
          <h3 style={{ marginBottom: '16px' }}>Attendance History</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                <th style={{ padding: '10px' }}>Date</th>
                <th style={{ padding: '10px' }}>Subject</th>
                <th style={{ padding: '10px' }}>Status</th>
                <th style={{ padding: '10px' }}>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {attendanceRecords.length > 0 ? (
                attendanceRecords.map((a) => (
                  <tr key={a.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px' }}>{a.attendanceDate}</td>
                    <td style={{ padding: '10px', fontWeight: 500 }}>{a.subject?.name}</td>
                    <td style={{ padding: '10px' }}>
                      <span
                        style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          backgroundColor: a.status === 'PRESENT' ? '#dcfce7' : '#fee2e2',
                          color: a.status === 'PRESENT' ? '#15803d' : '#b91c1c',
                        }}
                      >
                        {a.status}
                      </span>
                    </td>
                    <td style={{ padding: '10px', color: '#64748b' }}>{a.remarks || '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ padding: '16px', textAlign: 'center', color: '#94a3b8' }}>
                    No attendance records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3: LEAVE APPLICATION & STATUS */}
      {activeTab === 'leave' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Apply Form */}
          <div className="card">
            <h3 style={{ marginBottom: '16px' }}>Submit Leave Request</h3>
            {leaveStatusMsg.text && (
              <div
                style={{
                  padding: '10px',
                  borderRadius: '4px',
                  marginBottom: '14px',
                  backgroundColor: leaveStatusMsg.type === 'success' ? '#dcfce7' : '#fee2e2',
                  color: leaveStatusMsg.type === 'success' ? '#15803d' : '#b91c1c',
                }}
              >
                {leaveStatusMsg.text}
              </div>
            )}
            <form onSubmit={handleApplyLeave}>
              <div className="input-group">
                <label>Start Date</label>
                <input
                  type="date"
                  required
                  value={leaveForm.startDate}
                  onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                />
              </div>
              <div className="input-group">
                <label>End Date</label>
                <input
                  type="date"
                  required
                  value={leaveForm.endDate}
                  onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                />
              </div>
              <div className="input-group">
                <label>Reason for Absence</label>
                <textarea
                  rows="3"
                  required
                  style={{
                    padding: '10px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                  }}
                  value={leaveForm.reason}
                  onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                  placeholder="Medical emergency, family function, hackathon, etc."
                />
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                Submit Application
              </button>
            </form>
          </div>

          {/* Leave History */}
          <div className="card">
            <h3 style={{ marginBottom: '16px' }}>Leave Request Records</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                  <th style={{ padding: '8px' }}>Period</th>
                  <th style={{ padding: '8px' }}>Reason</th>
                  <th style={{ padding: '8px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {leaveHistory.length > 0 ? (
                  leaveHistory.map((l) => (
                    <tr key={l.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '8px', whiteSpace: 'nowrap' }}>
                        {l.startDate} to {l.endDate}
                      </td>
                      <td style={{ padding: '8px' }}>{l.reason}</td>
                      <td style={{ padding: '8px' }}>
                        <span
                          style={{
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 'bold',
                            backgroundColor:
                              l.status === 'APPROVED' ? '#dcfce7' : l.status === 'REJECTED' ? '#fee2e2' : '#fef3c7',
                            color:
                              l.status === 'APPROVED' ? '#15803d' : l.status === 'REJECTED' ? '#b91c1c' : '#b45309',
                          }}
                        >
                          {l.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" style={{ padding: '16px', textAlign: 'center', color: '#94a3b8' }}>
                      No prior leave applications.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: PLACEMENT JOB BOARD */}
      {activeTab === 'jobs' && (
        <div className="card">
          <h3 style={{ marginBottom: '16px' }}>Active Campus Recruitment Drives</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {jobs.length > 0 ? (
              jobs.map((j) => {
                const hasApplied = appliedJobIds.includes(j.id);
                return (
                  <div key={j.id} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
                    <h4 style={{ color: '#1e293b' }}>{j.title}</h4>
                    <p style={{ color: '#2563eb', fontWeight: 'bold' }}>{j.company?.name}</p>
                    <p style={{ fontSize: '13px', color: '#64748b', margin: '8px 0' }}>{j.description}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '12px' }}>
                      <span>Package: <strong>{j.ctcPackage} LPA</strong></span>
                      <span>Min CGPA: <strong>{j.minCgpaCriteria}</strong></span>
                    </div>
                    <button
                      onClick={() => handleApplyJob(j.id)}
                      disabled={hasApplied}
                      className="btn-primary"
                      style={{
                        width: '100%',
                        backgroundColor: hasApplied ? '#94a3b8' : '#2563eb',
                        cursor: hasApplied ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {hasApplied ? 'Applied' : 'Apply Now'}
                    </button>
                  </div>
                );
              })
            ) : (
              <p style={{ color: '#64748b', fontSize: '14px' }}>No recruitment drives active at the moment.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentPortal;