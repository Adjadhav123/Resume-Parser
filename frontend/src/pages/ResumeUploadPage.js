import { useState } from 'react';
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
    --card-bg: rgba(255,255,255,0.035);
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    overflow-x: hidden;
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

  .container {
    position: relative;
    z-index: 10;
    padding-top: 120px;
    padding-left: 48px;
    padding-right: 48px;
    padding-bottom: 48px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .header {
    margin-bottom: 48px;
  }

  .header h1 {
    font-family: 'Syne', sans-serif;
    font-size: 2.2rem;
    font-weight: 800;
    letter-spacing: -1px;
    margin-bottom: 12px;
  }

  .header p {
    color: var(--muted);
    font-size: 1rem;
  }

  .upload-section {
    background: var(--card-bg);
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

  .results-section {
    margin-top: 48px;
  }

  .results-section h2 {
    font-family: 'Syne', sans-serif;
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 24px;
  }

  .job-card {
    background: var(--card-bg);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 16px;
    transition: all 0.3s ease;
  }

  .job-card:hover {
    background: rgba(200,245,66,0.08);
    border-color: var(--accent);
    transform: translateY(-2px);
  }

  .job-header {
    display: flex;
    justify-content: space-between;
    align-items: start;
    margin-bottom: 12px;
  }

  .job-title {
    font-family: 'Syne', sans-serif;
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--accent);
  }

  .job-score {
    background: rgba(200,245,66,0.2);
    color: var(--accent);
    padding: 4px 12px;
    border-radius: 4px;
    font-size: 0.9rem;
    font-weight: 600;
  }

  .job-details {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 12px;
    font-size: 0.95rem;
    color: var(--muted);
  }

  .job-detail {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .detail-label {
    color: var(--text);
    font-weight: 500;
  }

  .empty-state {
    text-align: center;
    color: var(--muted);
    padding: 40px 20px;
  }
`;

export default function ResumeUploadPage({ onNavigate }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [matches, setMatches] = useState([]);
  const [dragActive, setDragActive] = useState(false);

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
      setError(null);
    } else {
      setError('Please upload a PDF or DOCX file');
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const token = localStorage.getItem('token');
      const result = await uploadResume(file, token);
      setSuccess(true);
      setMatches(result.matches || []);
      setFile(null);
    } catch (err) {
      setError(err.message || 'Upload failed');
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="noise" />
      <div className="glow-blob g1" />
      <div className="glow-blob g2" />

      <div className="container">
        <div className="header">
          <h1>Upload Your Resume</h1>
          <p>Find the best job matches instantly</p>
        </div>

        <div className="upload-section">
          {error && <div className="error">{error}</div>}
          {success && <div className="success">✓ Resume uploaded and matched successfully!</div>}

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
            disabled={!file || loading}
          >
            {loading ? <span className="loading">⏳ Uploading...</span> : 'Upload & Match'}
          </button>
        </div>

        {matches.length > 0 && (
          <div className="results-section">
            <h2>Top Matching Jobs ({matches.length})</h2>
            {matches.map((job, idx) => (
              <div key={idx} className="job-card">
                <div className="job-header">
                  <div className="job-title">{job.title}</div>
                  <div className="job-score">Match: {(job.score * 100).toFixed(0)}%</div>
                </div>
                <div className="job-details">
                  <div className="job-detail">
                    <span className="detail-label">Company:</span>
                    <span>{job.company}</span>
                  </div>
                  <div className="job-detail">
                    <span className="detail-label">Location:</span>
                    <span>{job.location || 'N/A'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {success && matches.length === 0 && (
          <div className="empty-state">
            <p>No matching jobs found. Check back soon!</p>
          </div>
        )}
      </div>
    </>
  );
}
