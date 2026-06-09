require('dotenv').config();

const http = require('http');
const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const createTimetableRouter = require('./routes/timetable');
const createReportsRouter = require('./routes/reports');
const { saveTimetableEntry } = require('./utils/timetableService');

const app = express();
const server = http.createServer(app);

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
  },
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/timetable', createTimetableRouter(io));
app.use('/api/reports', createReportsRouter());

const activeUsers = new Map();

function emitActiveUsers() {
  io.emit(
    'active-users',
    Array.from(activeUsers.entries()).map(([id, name]) => ({ id, name }))
  );
}

io.on('connection', (socket) => {
  activeUsers.set(socket.id, `User-${socket.id.slice(0, 5)}`);
  emitActiveUsers();

  socket.on('user-joined', ({ name } = {}) => {
    if (name && name.trim()) {
      activeUsers.set(socket.id, name.trim());
    }

    io.emit('user-joined', activeUsers.get(socket.id));
    emitActiveUsers();
  });

  socket.on('update-cell', async (payload, callback = () => {}) => {
    try {
      const saved = await saveTimetableEntry(payload);
      io.emit('cell-updated', saved);
      callback({ ok: true, row: saved });
    } catch (error) {
      socket.emit('update-error', { message: error.message });
      callback({ ok: false, message: error.message });
    }
  });

  socket.on('disconnect', () => {
    activeUsers.delete(socket.id);
    emitActiveUsers();
  });
});

const port = Number(process.env.PORT || 5000);
server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend running on port ${port}`);
});
