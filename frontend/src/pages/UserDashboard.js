import { useState, useEffect, useCallback } from 'react';
import { uploadResume } from '../services/resumeApi';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0a0a0f;
    --surface: #13131a;
    --border: rgba(255,255,255,0.07);
    --accent: #c8f542;
    --accent2: #42f5c8;
    --text: #f0f0f0;
    --muted: rgba(240,240,240,0.45);
  }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
  }

  .noise {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    opacity: 0.03;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size: 200px;
  }

  .glow-blob {
    position: fixed;
    border-radius: 50%;
    filter: blur(120px);
    pointer-events: none;
    z-index: 0;
  }
  .glow-blob.g1 {
    width: 500px; height: 500px;
    background: rgba(200,245,66,0.07);
    top: -100px; left: -100px;
  }
  .glow-blob.g2 {
    width: 400px; height: 400px;
    background: rgba(66,245,200,0.06);
    bottom: -80px; right: -80px;
  }

  nav {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 48px;
    background: rgba(10,10,15,0.75);
    backdrop-filter: blur(18px);
    border-bottom: 1px solid var(--border);
  }

  .logo {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 1.3rem;
    letter-spacing: -0.5px;
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
  }
  .logo-dot { color: var(--accent); }
  .logo-badge {
    font-size: 0.6rem;
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    background: rgba(200,245,66,0.12);
    color: var(--accent);
    border: 1px solid rgba(200,245,66,0.25);
    padding: 2px 8px;
    border-radius: 20px;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  .nav-actions { display: flex; gap: 12px; align-items: center; }

  .btn {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem;
    font-weight: 500;
    padding: 10px 22px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    letter-spacing: 0.2px;
    text-decoration: none;
    display: inline-block;
    border: none;
    background: transparent;
    color: var(--muted);
    border: 1px solid var(--border);
  }
  .btn:hover {
    border-color: rgba(255,255,255,0.2);
    color: var(--text);
  }
  .btn-danger {
    background: rgba(255,59,48,0.15);
    color: #ff6b6b;
    border: 1px solid rgba(255,59,48,0.3);
  }
  .btn-danger:hover {
    background: rgba(255,59,48,0.25);
  }

  .container {
    position: relative;
    z-index: 1;
    max-width: 1200px;
    margin: 0 auto;
    padding: 100px 24px 40px;
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 40px;
    flex-wrap: wrap;
    gap: 20px;
  }

  .header-left h1 {
    font-family: 'Syne', sans-serif;
    font-size: 2rem;
    font-weight: 800;
    letter-spacing: -1px;
    margin-bottom: 8px;
  }

  .header-left p {
    color: var(--muted);
    font-size: 0.95rem;
  }

  .upload-section {
    background: rgba(255,255,255,0.035);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 40px;
    margin-bottom: 48px;
    position: relative;
  }

  .upload-area {
    border: 2px dashed var(--border);
    border-radius: 8px;
    padding: 40px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    background: rgba(200,245,66,0.02);
  }

  .upload-area:hover {
    border-color: var(--accent);
    background: rgba(200,245,66,0.06);
  }

  .upload-area.drag-active {
    border-color: var(--accent);
    background: rgba(200,245,66,0.1);
  }

  .upload-icon {
    font-size: 3rem;
    margin-bottom: 16px;
  }

  .upload-area p {
    color: var(--text);
    font-size: 1rem;
    margin-bottom: 8px;
    font-weight: 500;
  }

  .upload-area span {
    color: var(--muted);
    font-size: 0.9rem;
  }

  input[type="file"] {
    display: none;
  }

  .button {
    background: var(--accent);
    color: var(--bg);
    border: none;
    padding: 12px 24px;
    border-radius: 6px;
    font-family: 'Syne', sans-serif;
    font-weight: 600;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 16px;
  }

  .button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(200,245,66,0.2);
  }

  .button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  .file-name {
    margin-top: 12px;
    padding: 12px;
    background: rgba(255,255,255,0.05);
    border-radius: 6px;
    color: var(--accent);
    font-size: 0.9rem;
  }

  .loading {
    display: inline-block;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .error {
    background: rgba(255,100,100,0.1);
    border: 1px solid rgba(255,100,100,0.3);
    color: #ff6464;
    padding: 12px;
    border-radius: 6px;
    margin-bottom: 16px;
    font-size: 0.9rem;
  }

  .success {
    background: rgba(66,245,200,0.1);
    border: 1px solid rgba(66,245,200,0.3);
    color: var(--accent2);
    padding: 12px;
    border-radius: 6px;
    margin-bottom: 16px;
    font-size: 0.9rem;
  }

  .matches-section {
    margin-top: 40px;
    padding: 20px;
    background: rgba(200,245,66,0.08);
    border: 1px solid rgba(200,245,66,0.2);
    border-radius: 8px;
  }

  .matches-section h3 {
    color: var(--accent);
    margin-bottom: 20px;
    font-size: 1.2rem;
  }

  .match-score {
    background: rgba(66,245,200,0.2);
    color: var(--accent2);
    padding: 4px 12px;
    border-radius: 4px;
    font-size: 0.9rem;
    font-weight: 600;
  }

  .section-divider {
    margin: 60px 0 40px 0;
    padding: 20px 0;
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
  }

  .section-divider h2 {
    font-family: 'Syne', sans-serif;
    font-size: 1.8rem;
    font-weight: 800;
    margin-bottom: 8px;
  }

  .search-box {
    display: flex;
    gap: 8px;
    margin-bottom: 30px;
    flex-wrap: wrap;
  }

  .search-box input {
    flex: 1;
    min-width: 250px;
    background: rgba(255,255,255,0.05);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 12px 16px;
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    transition: all 0.2s ease;
  }

  .search-box input::placeholder {
    color: rgba(240,240,240,0.3);
  }

  .search-box input:focus {
    outline: none;
    border-color: var(--accent);
    background: rgba(255,255,255,0.08);
    box-shadow: 0 0 0 3px rgba(200,245,66,0.1);
  }

  .jobs-grid {
    display: grid;
    gap: 20px;
  }

  .job-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 15px;
    padding: 24px;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
    cursor: pointer;
  }
  .job-card:hover {
    border-color: var(--accent);
    box-shadow: 0 8px 32px rgba(200,245,66,0.1);
    transform: translateY(-2px);
  }

  .job-header {
    display: flex;
    justify-content: space-between;
    align-items: start;
    margin-bottom: 16px;
    gap: 12px;
  }

  .job-info {
    flex: 1;
  }

  .job-title {
    font-size: 1.3rem;
    font-weight: 700;
    margin-bottom: 4px;
    color: var(--text);
  }

  .job-company {
    color: var(--accent);
    font-size: 0.9rem;
    margin-bottom: 8px;
    font-weight: 600;
  }

  .job-meta {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    margin: 16px 0;
    padding: 16px 0;
    border-bottom: 1px solid var(--border);
  }

  .meta-item {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .meta-label {
    color: var(--muted);
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 600;
  }

  .meta-value {
    color: var(--text);
    font-weight: 600;
    font-size: 0.9rem;
  }

  .job-description {
    color: var(--muted);
    font-size: 0.9rem;
    line-height: 1.6;
    margin-bottom: 12px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .job-skills {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 16px;
  }

  .skill-tag {
    background: rgba(200,245,66,0.1);
    color: var(--accent);
    border: 1px solid rgba(200,245,66,0.2);
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 500;
  }

  .job-actions {
    display: flex;
    gap: 10px;
  }

  .btn-view {
    background: var(--accent);
    color: #0a0a0f;
    border: 1px solid var(--accent);
    font-weight: 600;
  }
  .btn-view:hover {
    background: #d4f75a;
    box-shadow: 0 0 24px rgba(200,245,66,0.35);
  }

  .btn-save {
    background: rgba(100,200,255,0.15);
    color: #64c8ff;
    border: 1px solid rgba(100,200,255,0.3);
  }
  .btn-save:hover {
    background: rgba(100,200,255,0.25);
  }

  .empty-state {
    text-align: center;
    padding: 60px 24px;
    color: var(--muted);
  }

  .empty-state h2 {
    font-size: 1.5rem;
    margin-bottom: 12px;
    color: var(--text);
  }

  .loading {
    text-align: center;
    padding: 40px 24px;
    color: var(--muted);
  }

  .filters {
    display: flex;
    gap: 12px;
    margin-bottom: 24px;
    flex-wrap: wrap;
  }

  .filter-btn {
    padding: 8px 16px;
    background: rgba(255,255,255,0.05);
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--muted);
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .filter-btn.active {
    background: var(--accent);
    color: #0a0a0f;
    border-color: var(--accent);
  }

  .filter-btn:hover {
    border-color: rgba(255,255,255,0.2);
  }

  @media (max-width: 640px) {
    nav { padding: 16px 20px; }
    .container { padding: 100px 16px 30px; }
    .header { flex-direction: column; align-items: flex-start; }
    .search-box { flex-direction: column; }
    .search-box input { width: 100%; }
    .job-meta { flex-direction: column; gap: 8px; }
  }
`;

function UserDashboard({ onNavigate }) {
  const [file, setFile] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [matches, setMatches] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const token = localStorage.getItem('access_token');

  // Get user info from token or local state
  const getUserEmail = () => {
    try {
      // In a real app, you'd decode the JWT token here
      const userStr = localStorage.getItem('user_email') || 'User';
      return userStr;
    } catch {
      return 'User';
    }
  };

  const fetchAllJobs = useCallback(async () => {
    try {
      setLoading(true);
      // Try to fetch publicly available jobs first
      const response = await fetch('http://127.0.0.1:8000/jobs/browse');
      
      const data = await response.json().catch(() => []);
      setJobs(Array.isArray(data) ? data : []);
      setFilteredJobs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log('Fetching all jobs...');
      // If public fails, try all jobs
      try {
        const response = await fetch('http://127.0.0.1:8000/jobs/all-jobs');
        const data = await response.json().catch(() => []);
        setJobs(Array.isArray(data) ? data : []);
        setFilteredJobs(Array.isArray(data) ? data : []);
      } catch {
        setJobs([]);
        setFilteredJobs([]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!token) {
      onNavigate('/login');
      return;
    }
    fetchAllJobs();
  }, [token, fetchAllJobs, onNavigate]);

  // Handle search and filter
  useEffect(() => {
    let filtered = jobs;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (job) =>
          job.job_title?.toLowerCase().includes(query) ||
          job.company_name?.toLowerCase().includes(query) ||
          job.location?.toLowerCase().includes(query)
      );
    }

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter((job) => job.status === selectedStatus);
    }

    setFilteredJobs(filtered);
  }, [jobs, searchQuery, selectedStatus]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_email');
    onNavigate('/');
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && (droppedFile.name.endsWith('.pdf') || droppedFile.name.endsWith('.docx'))) {
      setFile(droppedFile);
      setUploadError(null);
    } else {
      setUploadError('Please upload a PDF or DOCX file');
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploadError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadError('Please select a file');
      return;
    }

    setUploadLoading(true);
    setUploadError(null);
    setUploadSuccess(false);

    try {
      const result = await uploadResume(file, token);
      setUploadSuccess(true);
      setMatches(result.matches || []);
      setFile(null);
    } catch (err) {
      setUploadError(err.message || 'Upload failed');
      setMatches([]);
    } finally {
      setUploadLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="noise" />
      <div className="glow-blob g1" />
      <div className="glow-blob g2" />

      <nav>
        <div className="logo" onClick={() => onNavigate('/')}>
          <span>Parse<span className="logo-dot">.</span>AI</span>
          <span className="logo-badge">User</span>
        </div>
        <div className="nav-actions">
          <span style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
            {getUserEmail()}
          </span>
          <button className="btn btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="container">
        <div className="header">
          <div className="header-left">
            <h1>Upload Your Resume 📄</h1>
            <p>Find the best job matches instantly</p>
          </div>
        </div>

        <div className="upload-section">
          {uploadError && <div className="error">{uploadError}</div>}
          {uploadSuccess && <div className="success">✓ Resume uploaded and matched successfully!</div>}

          <div
            className={`upload-area ${dragActive ? 'drag-active' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-input').click()}
          >
            <div className="upload-icon">📄</div>
            <p>Drag and drop your resume</p>
            <span>or click to select (PDF or DOCX)</span>
            <input
              id="file-input"
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileChange}
            />
          </div>

          {file && (
            <div className="file-name">
              ✓ Selected: {file.name}
            </div>
          )}

          <button
            className="button"
            onClick={handleUpload}
            disabled={!file || uploadLoading}
          >
            {uploadLoading ? <span className="loading">⏳ Uploading...</span> : 'Upload & Match'}
          </button>
        </div>

        {/* Matching Jobs Section */}
        {matches.length > 0 && (
          <div className="matches-section">
            <h3>🎯 Top Matching Jobs for Your Resume ({matches.length})</h3>
            <div className="jobs-grid">
              {matches.map((job, idx) => (
                <div key={idx} className="job-card">
                  <div className="job-header">
                    <div className="job-info">
                      <h3 className="job-title">{job.title}</h3>
                      <p className="job-company">{job.company}</p>
                    </div>
                    <div className="match-score">Match: {(job.score * 100).toFixed(0)}%</div>
                  </div>
                  <div className="job-meta">
                    <div className="meta-item">
                      <span className="meta-label">📍 Location</span>
                      <span className="meta-value">{job.location || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Jobs Section */}
        <div className="section-divider">
          <h2>Browse All Jobs 💼</h2>
          <p style={{ color: 'var(--muted)' }}>Explore more opportunities</p>
        </div>

        {/* Search Bar */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by job title, company, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Status Filters */}
        <div className="filters">
          <button
            className={`filter-btn ${selectedStatus === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedStatus('all')}
          >
            All Jobs
          </button>
          <button
            className={`filter-btn ${selectedStatus === 'active' ? 'active' : ''}`}
            onClick={() => setSelectedStatus('active')}
          >
            Active
          </button>
          <button
            className={`filter-btn ${selectedStatus === 'inactive' ? 'active' : ''}`}
            onClick={() => setSelectedStatus('inactive')}
          >
            Inactive
          </button>
          <button
            className={`filter-btn ${selectedStatus === 'draft' ? 'active' : ''}`}
            onClick={() => setSelectedStatus('draft')}
          >
            Draft
          </button>
        </div>

        {/* Jobs Grid */}
        {loading ? (
          <div className="loading">
            <h2>Loading jobs...</h2>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="empty-state">
            <h2>No jobs found</h2>
            <p>
              {searchQuery || selectedStatus !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Check back soon for new opportunities!'}
            </p>
          </div>
        ) : (
          <div className="jobs-grid">
            {filteredJobs.map((job) => (
              <div key={job.job_id} className="job-card">
                <div className="job-header">
                  <div className="job-info">
                    <h3 className="job-title">{job.job_title}</h3>
                    <p className="job-company">{job.company_name}</p>
                  </div>
                  <span
                    className="skill-tag"
                    style={{
                      background: job.status === 'active' 
                        ? 'rgba(76,175,80,0.15)' 
                        : job.status === 'draft'
                        ? 'rgba(255,152,0,0.15)'
                        : 'rgba(255,59,48,0.15)',
                      color: job.status === 'active' 
                        ? '#4caf50' 
                        : job.status === 'draft'
                        ? '#ff9800'
                        : '#ff6b6b',
                      border: job.status === 'active'
                        ? '1px solid rgba(76,175,80,0.3)'
                        : job.status === 'draft'
                        ? '1px solid rgba(255,152,0,0.3)'
                        : '1px solid rgba(255,59,48,0.3)',
                    }}
                  >
                    {job.status}
                  </span>
                </div>

                <div className="job-meta">
                  <div className="meta-item">
                    <span className="meta-label">📍 Location</span>
                    <span className="meta-value">{job.location}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">📅 Experience</span>
                    <span className="meta-value">{job.experience_years} years</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">💰 Salary</span>
                    <span className="meta-value">{job.salary_range || 'Competitive'}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">⏰ Type</span>
                    <span className="meta-value">{job.job_type}</span>
                  </div>
                </div>

                <p className="job-description">{job.description}</p>

                <div className="job-skills">
                  {job.required_skills?.map((skill, idx) => (
                    <span key={idx} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="job-actions">
                  <button className="btn btn-view">
                    View Details →
                  </button>
                  <button className="btn btn-save">
                    ♥ Save Job
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default UserDashboard;
