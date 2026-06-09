const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

async function parseResponse(response) {
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error || payload.message || 'Request failed');
  }

  return response.json();
}

export async function fetchTimetable() {
  const response = await fetch(`${API_URL}/api/timetable`);
  return parseResponse(response);
}

export async function saveTimetableRow(row) {
  const response = await fetch(`${API_URL}/api/timetable`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(row),
  });

  return parseResponse(response);
}

export async function fetchReports() {
  const response = await fetch(`${API_URL}/api/reports`);
  return parseResponse(response);
}
