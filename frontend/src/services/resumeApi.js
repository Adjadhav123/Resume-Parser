const API_BASE_URL = 'http://127.0.0.1:8000';

export async function uploadResume(file, token) {
  const formData = new FormData();
  formData.append('file', file);

  const config = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  };

  const response = await fetch(`${API_BASE_URL}/resume/upload`, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMessage = data?.detail || 'Upload failed';
    throw new Error(errorMessage);
  }

  return data;
}
