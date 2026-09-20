import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext.jsx';

const PlacementDashboard = () => {
  const { user } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [jobPostings, setJobPostings] = useState([]);
  const [applications, setApplications] = useState([]);
  const [activeTab, setActiveTab] = useState('postings');
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(true);

  // New Company Form
  const [companyForm, setCompanyForm] = useState({
    name: '',
    website: '',
    industry: 'Technology',
    contactEmail: '',
  });

  // New Job Drive Form
  const [jobForm, setJobForm] = useState({
    companyId: '',
    title: '',
    description: '',
    ctcPackage: '',
    minCgpaCriteria: '7.0',
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  const loadPlacementData = async () => {
    try {
      setStatusMsg({ type: '', text: '' });
      const [compRes, jobsRes, appsRes] = await Promise.all([
        axiosClient.get('/placement/companies'),
        axiosClient.get('/placement/jobs'),
        axiosClient.get('/placement/applications'),
      ]);

      setCompanies(compRes.data);
      setJobPostings(jobsRes.data);
      setApplications(appsRes.data);

      if (compRes.data.length > 0 && !jobForm.companyId) {
        setJobForm((prev) => ({ ...prev, companyId: compRes.data[0].id }));
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.response?.data?.message || 'Failed to load placement data.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlacementData();
  }, []);

  const handleCreateCompany = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post('/placement/companies', companyForm);
      setStatusMsg({ type: 'success', text: `Company ${companyForm.name} onboarded successfully!` });
      setCompanyForm({ name: '', website: '', industry: 'Technology', contactEmail: '' });
      loadPlacementData();
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.response?.data?.message || 'Failed to create company.' });
    }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post('/placement/jobs', {
        ...jobForm,
        companyId: Number(jobForm.companyId),
        ctcPackage: Number(jobForm.ctcPackage),
        minCgpaCriteria: Number(jobForm.minCgpaCriteria),
      });
      setStatusMsg({ type: 'success', text: 'New job drive published!' });
      setJobForm({
        companyId: companies[0]?.id || '',
        title: '',
        description: '',
        ctcPackage: '',
        minCgpaCriteria: '7.0',
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      });
      loadPlacementData();
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.response?.data?.message || 'Failed to publish job drive.' });
    }
  };

  const handleApplicationStatus = async (appId, newStatus) => {
    try {
      await axiosClient.patch(`/placement/applications/${appId}/status`, { status: newStatus });
      setStatusMsg({ type: 'success', text: `Application marked as ${newStatus}` });
      loadPlacementData();
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.response?.data?.message || 'Update failed.' });
    }
  };

  if (loading) return <div style={{ padding: '24px' }}>Loading Placement Officer Console...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Campus Placement Officer Console</h2>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>
            Officer: <strong>{user?.fullName}</strong> | Active Drives: <strong>{jobPostings.length}</strong>
          </p>
        </div>
        <div>
          <span style={{ fontSize: '13px', color: '#64748b' }}>Total Student Candidates</span>
          <h2 style={{ color: '#059669' }}>{applications.length}</h2>
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
          onClick={() => setActiveTab('postings')}
          className="btn-primary"
          style={{ backgroundColor: activeTab === 'postings' ? '#2563eb' : '#94a3b8' }}
        >
          Job Drives & Openings
        </button>
        <button
          onClick={() => setActiveTab('companies')}
          className="btn-primary"
          style={{ backgroundColor: activeTab === 'companies' ? '#2563eb' : '#94a3b8' }}
        >
          Partner Companies
        </button>
        <button
          onClick={() => setActiveTab('candidates')}
          className="btn-primary"
          style={{ backgroundColor: activeTab === 'candidates' ? '#2563eb' : '#94a3b8' }}
        >
          Candidate Applications ({applications.length})
        </button>
      </div>

      {/* TAB 1: ACTIVE DRIVES & NEW POSTING FORM */}
      {activeTab === 'postings' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '24px' }}>
          <div className="card">
            <h3 style={{ marginBottom: '16px' }}>Publish Job Drive</h3>
            <form onSubmit={handleCreateJob}>
              <div className="input-group">
                <label>Recruiting Partner</label>
                <select
                  value={jobForm.companyId}
                  onChange={(e) => setJobForm({ ...jobForm, companyId: e.target.value })}
                  required
                >
                  {companies.map((comp) => (
                    <option key={comp.id} value={comp.id}>
                      {comp.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="input-group">
                <label>Role / Designation</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Associate Software Engineer"
                  value={jobForm.title}
                  onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                />
              </div>
              <div className="input-group">
                <label>CTC Package (LPA)</label>
                <input
                  type="number"
                  step="0.5"
                  required
                  placeholder="e.g. 12.5"
                  value={jobForm.ctcPackage}
                  onChange={(e) => setJobForm({ ...jobForm, ctcPackage: e.target.value })}
                />
              </div>
              <div className="input-group">
                <label>Minimum Eligibility CGPA</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  required
                  value={jobForm.minCgpaCriteria}
                  onChange={(e) => setJobForm({ ...jobForm, minCgpaCriteria: e.target.value })}
                />
              </div>
              <div className="input-group">
                <label>Application Deadline</label>
                <input
                  type="date"
                  required
                  value={jobForm.deadline}
                  onChange={(e) => setJobForm({ ...jobForm, deadline: e.target.value })}
                />
              </div>
              <div className="input-group">
                <label>Job Description & Requirements</label>
                <textarea
                  rows="3"
                  required
                  value={jobForm.description}
                  onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                  placeholder="Responsibilities, requirements, eligible departments..."
                />
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={companies.length === 0}>
                Post Recruitment Drive
              </button>
            </form>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '16px' }}>Current Drives</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                  <th style={{ padding: '10px' }}>Company</th>
                  <th style={{ padding: '10px' }}>Role</th>
                  <th style={{ padding: '10px' }}>Package</th>
                  <th style={{ padding: '10px' }}>Min CGPA</th>
                  <th style={{ padding: '10px' }}>Deadline</th>
                </tr>
              </thead>
              <tbody>
                {jobPostings.map((job) => (
                  <tr key={job.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px', fontWeight: 600 }}>{job.company?.name}</td>
                    <td style={{ padding: '10px' }}>{job.title}</td>
                    <td style={{ padding: '10px', color: '#059669', fontWeight: 600 }}>{job.ctcPackage} LPA</td>
                    <td style={{ padding: '10px' }}>{job.minCgpaCriteria}</td>
                    <td style={{ padding: '10px', color: '#64748b' }}>{job.deadline}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: PARTNER COMPANIES */}
      {activeTab === 'companies' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '24px' }}>
          <div className="card">
            <h3 style={{ marginBottom: '16px' }}>Register Partner Company</h3>
            <form onSubmit={handleCreateCompany}>
              <div className="input-group">
                <label>Company Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Google, Microsoft, TCS"
                  value={companyForm.name}
                  onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                />
              </div>
              <div className="input-group">
                <label>Industry</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Software / Cloud / Fintech"
                  value={companyForm.industry}
                  onChange={(e) => setCompanyForm({ ...companyForm, industry: e.target.value })}
                />
              </div>
              <div className="input-group">
                <label>Website URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={companyForm.website}
                  onChange={(e) => setCompanyForm({ ...companyForm, website: e.target.value })}
                />
              </div>
              <div className="input-group">
                <label>Contact Email</label>
                <input
                  type="email"
                  required
                  placeholder="hr@company.com"
                  value={companyForm.contactEmail}
                  onChange={(e) => setCompanyForm({ ...companyForm, contactEmail: e.target.value })}
                />
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                Add Company
              </button>
            </form>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '16px' }}>Corporate Roster</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                  <th style={{ padding: '10px' }}>Name</th>
                  <th style={{ padding: '10px' }}>Industry</th>
                  <th style={{ padding: '10px' }}>Contact</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((c) => (
                  <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px', fontWeight: 600 }}>{c.name}</td>
                    <td style={{ padding: '10px' }}>{c.industry}</td>
                    <td style={{ padding: '10px', color: '#64748b' }}>{c.contactEmail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: CANDIDATE APPLICANTS */}
      {activeTab === 'candidates' && (
        <div className="card">
          <h3 style={{ marginBottom: '16px' }}>Student Application Review</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                <th style={{ padding: '10px' }}>Student</th>
                <th style={{ padding: '10px' }}>Job Role</th>
                <th style={{ padding: '10px' }}>Company</th>
                <th style={{ padding: '10px' }}>Status</th>
                <th style={{ padding: '10px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.length > 0 ? (
                applications.map((app) => (
                  <tr key={app.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px', fontWeight: 600 }}>
                      {app.student?.user?.fullName} ({app.student?.rollNumber})
                    </td>
                    <td style={{ padding: '10px' }}>{app.jobPosting?.title}</td>
                    <td style={{ padding: '10px' }}>{app.jobPosting?.company?.name}</td>
                    <td style={{ padding: '10px' }}>
                      <span
                        style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          backgroundColor:
                            app.status === 'SELECTED' ? '#dcfce7' : app.status === 'REJECTED' ? '#fee2e2' : '#fef3c7',
                          color:
                            app.status === 'SELECTED' ? '#15803d' : app.status === 'REJECTED' ? '#b91c1c' : '#b45309',
                        }}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td style={{ padding: '10px', display: 'flex', gap: '6px', justifyContent: 'center' }}>
                      <button
                        onClick={() => handleApplicationStatus(app.id, 'SHORTLISTED')}
                        style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px' }}
                      >
                        Shortlist
                      </button>
                      <button
                        onClick={() => handleApplicationStatus(app.id, 'SELECTED')}
                        style={{ background: '#10b981', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px' }}
                      >
                        Select
                      </button>
                      <button
                        onClick={() => handleApplicationStatus(app.id, 'REJECTED')}
                        style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px' }}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ padding: '16px', textAlign: 'center', color: '#94a3b8' }}>
                    No student applications submitted yet.
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

export default PlacementDashboard;