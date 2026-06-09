import { useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import TimetableGrid from './components/TimetableGrid';
import ReportDashboard from './components/ReportDashboard';
import { fetchReports, fetchTimetable } from './api';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

function App() {
  const [rows, setRows] = useState([]);
  const [reports, setReports] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [error, setError] = useState('');

  const socket = useMemo(() => io(SOCKET_URL, { transports: ['websocket'] }), []);

  useEffect(() => {
    const username = localStorage.getItem('timetable_username') || `User-${Math.floor(Math.random() * 1000)}`;
    localStorage.setItem('timetable_username', username);

    socket.emit('user-joined', { name: username });

    socket.on('cell-updated', async (updatedRow) => {
      setRows((current) => {
        const index = current.findIndex((row) => row.id === updatedRow.id);
        if (index === -1) {
          return [...current, updatedRow];
        }

        const next = [...current];
        next[index] = updatedRow;
        return next;
      });

      const refreshedReports = await fetchReports().catch(() => []);
      setReports(refreshedReports);
    });

    socket.on('active-users', (users) => setActiveUsers(users));
    socket.on('update-error', (payload) => setError(payload?.message || 'Failed to update row'));

    return () => {
      socket.off('cell-updated');
      socket.off('active-users');
      socket.off('update-error');
      socket.disconnect();
    };
  }, [socket]);

  useEffect(() => {
    const load = async () => {
      try {
        const [timetableData, reportData] = await Promise.all([fetchTimetable(), fetchReports()]);
        setRows(timetableData);
        setReports(reportData);
      } catch (loadError) {
        setError(loadError.message);
      }
    };

    load();
  }, []);

  async function handleCellUpdate(row) {
    setError('');

    if (!row.day || !row.time_slot || !row.section) {
      setError('day, time_slot, and section are required');
      return;
    }

    const payload = { ...row };
    if (!Number.isInteger(payload.id)) {
      delete payload.id;
    }

    try {
      const response = await socket.timeout(5000).emitWithAck('update-cell', payload);
      if (!response?.ok) {
        throw new Error(response?.message || 'Failed to save row');
      }

      const reportData = await fetchReports();
      setReports(reportData);
    } catch (updateError) {
      setError(updateError.message || 'Failed to save row');
    }
  }

  function addEmptyRow() {
    setRows((current) => [
      ...current,
      {
        tempId: `tmp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        day: '',
        time_slot: '',
        semester: '',
        section: '',
        subject: '',
        teacher: '',
        room: '',
        clash: false,
      },
    ]);
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">Real-Time Timetable Management System</h1>
          <p className="mt-1 text-sm text-slate-600">
            Collaborative timetable editing with instant websocket updates and clash detection.
          </p>
          <p className="mt-3 text-sm font-medium text-slate-700">
            Active users: {activeUsers.map((user) => user.name).join(', ') || 'No users online'}
          </p>
          <button
            type="button"
            onClick={addEmptyRow}
            className="mt-3 rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700"
          >
            Add Timetable Row
          </button>
        </header>

        {error && <div className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">{error}</div>}

        <TimetableGrid rowData={rows} onCellUpdate={handleCellUpdate} />
        <ReportDashboard reports={reports} />
      </div>
    </main>
  );
}

export default App;
