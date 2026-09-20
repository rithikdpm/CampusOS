import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext.jsx';

const Announcements = () => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  // Synced with CreateAnnouncementDto: title, content, targetAudience, important
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    targetAudience: 'ALL',
    important: false,
  });

  const canPost = user?.role === 'ROLE_ADMIN' || user?.role === 'ROLE_FACULTY';

  const fetchAnnouncements = async () => {
    try {
      setStatusMsg({ type: '', text: '' });
      const res = await axiosClient.get('/announcements');
      setAnnouncements(res.data);
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.response?.data?.message || 'Failed to load announcements.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post('/announcements', {
        title: formData.title,
        content: formData.content,
        targetAudience: formData.targetAudience,
        important: Boolean(formData.important),
      });

      setStatusMsg({ type: 'success', text: 'Announcement published successfully!' });
      setFormData({
        title: '',
        content: '',
        targetAudience: 'ALL',
        important: false,
      });
      fetchAnnouncements();
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.response?.data?.message || 'Failed to publish announcement.' });
    }
  };

  if (loading) return <div style={{ padding: '24px' }}>Loading Campus Bulletins...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h2>Campus Bulletins & Announcements</h2>

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

      <div style={{ display: 'grid', gridTemplateColumns: canPost ? '1fr 1.6fr' : '1fr', gap: '24px' }}>
        {/* Notice Creation Form (Admin / Faculty) */}
        {canPost && (
          <div className="card">
            <h3 style={{ marginBottom: '16px' }}>Broadcast New Notice</h3>
            <form onSubmit={handleCreateAnnouncement}>
              <div className="input-group">
                <label>Notice Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. End Semester Exam Timetable Released"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="input-group">
                <label>Target Audience</label>
                <select
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                >
                  <option value="ALL">Entire Campus (All)</option>
                  <option value="STUDENTS_ONLY">Students Only</option>
                  <option value="FACULTY_ONLY">Faculty & Staff</option>
                </select>
              </div>

              <div className="input-group" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
                <input
                  type="checkbox"
                  id="importantCheck"
                  checked={formData.important}
                  onChange={(e) => setFormData({ ...formData, important: e.target.checked })}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="importantCheck" style={{ marginBottom: 0, cursor: 'pointer', fontWeight: 600 }}>
                  Mark as Important / Urgent
                </label>
              </div>

              <div className="input-group" style={{ marginTop: '12px' }}>
                <label>Notice Content</label>
                <textarea
                  rows="4"
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Provide circular details, instructions, or exam guidelines..."
                />
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '8px' }}>
                Publish Notice
              </button>
            </form>
          </div>
        )}

        {/* Notices Board Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {announcements.length > 0 ? (
            announcements.map((item) => (
              <div
                key={item.id}
                className="card"
                style={{
                  borderLeft: item.important ? '5px solid #dc2626' : '5px solid #2563eb',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {item.important && (
                      <span
                        style={{
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 'bold',
                          backgroundColor: '#fee2e2',
                          color: '#b91c1c',
                          border: '1px solid #f87171',
                        }}
                      >
                        IMPORTANT
                      </span>
                    )}
                    <span style={{ fontSize: '12px', color: '#64748b' }}>
                      Audience: <strong>{item.targetAudience}</strong>
                    </span>
                  </div>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recent'}
                  </span>
                </div>

                <h3 style={{ marginBottom: '8px', color: '#0f172a' }}>{item.title}</h3>
                <p style={{ color: '#334155', fontSize: '14px', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                  {item.content}
                </p>

                <div style={{ marginTop: '12px', fontSize: '12px', color: '#64748b', textAlign: 'right' }}>
                  Posted by: <em>{item.publisher?.fullName || item.postedBy || 'Campus Administration'}</em>
                </div>
              </div>
            ))
          ) : (
            <div className="card" style={{ textAlign: 'center', color: '#94a3b8', padding: '36px' }}>
              No campus bulletins published yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Announcements;