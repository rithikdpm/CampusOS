import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const Timetable = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedSemester, setSelectedSemester] = useState(1);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);

  const daysOfWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axiosClient.get('/academic/courses');
        setCourses(res.data);
        if (res.data.length > 0) {
          setSelectedCourse(res.data[0].id);
        }
      } catch (err) {
        console.error('Failed to load courses', err);
      }
    };
    fetchCourses();
  }, []);

  const loadTimetable = async () => {
    if (!selectedCourse) return;
    setLoading(true);
    try {
      const res = await axiosClient.get(
        `/timetables/course/${selectedCourse}/semester/${selectedSemester}`
      );
      setSchedules(res.data);
    } catch (err) {
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTimetable();
  }, [selectedCourse, selectedSemester]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h2>Academic Schedule & Class Timetable</h2>

      {/* Filter Toolbar */}
      <div className="card" style={{ display: 'flex', gap: '20px', alignItems: 'flex-end' }}>
        <div className="input-group" style={{ marginBottom: 0, minWidth: '220px' }}>
          <label>Course Program</label>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.code})
              </option>
            ))}
          </select>
        </div>

        <div className="input-group" style={{ marginBottom: 0, minWidth: '140px' }}>
          <label>Semester</label>
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
              <option key={sem} value={sem}>
                Semester {sem}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Timetable Weekly Matrix */}
      {loading ? (
        <div style={{ padding: '24px' }}>Loading schedule...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {daysOfWeek.map((day) => {
            const daySchedules = schedules.filter((s) => s.dayOfWeek === day);
            return (
              <div key={day} className="card" style={{ borderTop: '4px solid #2563eb' }}>
                <h4 style={{ marginBottom: '12px', color: '#1e293b' }}>{day}</h4>
                {daySchedules.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {daySchedules.map((slot) => (
                      <div
                        key={slot.id}
                        style={{
                          backgroundColor: '#f8fafc',
                          padding: '10px',
                          borderRadius: '6px',
                          border: '1px solid #e2e8f0',
                        }}
                      >
                        <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#0f172a' }}>
                          {slot.subject?.name}
                        </div>
                        <div style={{ fontSize: '12px', color: '#2563eb', marginTop: '2px' }}>
                          ⏰ {slot.startTime} - {slot.endTime}
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                          🏛️ Room: <strong>{slot.classroomNumber || 'Lecture Hall'}</strong>
                        </div>
                        <div style={{ fontSize: '12px', color: '#475569' }}>
                          👨‍🏫 {slot.subject?.faculty?.user?.fullName || 'Assigned Instructor'}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: '13px', color: '#94a3b8', fontStyle: 'italic' }}>No lectures scheduled</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Timetable;