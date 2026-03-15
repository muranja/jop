import { Server } from 'socket.io';
import { createServer } from 'http';
import { generateCrashPoint } from '../lib/engine';

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Allow all for local dev
    methods: ["GET", "POST"]
  },
  allowEIO3: true // Better compatibility with older socket versions if any
});

interface GameState {
  status: 'WAITING' | 'STARTING' | 'IN_PROGRESS' | 'CRASHED';
  multiplier: number;
  crashPoint: number | null;
  serverSeed: string;
  clientSeed: string;
  nonce: number;
  startTime: number;
}

let state: GameState = {
  status: 'WAITING',
  multiplier: 1.0,
  crashPoint: null,
  serverSeed: 'super-secret-server-seed-' + Math.random(), 
  clientSeed: 'global-client-seed',
  nonce: 100,
  startTime: Date.now()
};

function startNewRound() {
  state.nonce++;
  state.crashPoint = generateCrashPoint(state.serverSeed, state.clientSeed, state.nonce);
  state.multiplier = 1.0;
  state.status = 'IN_PROGRESS';
  state.startTime = Date.now();
  
  console.log(`[Broadcaster] Round ${state.nonce} Started. Target multiplier: ${state.crashPoint}`);
  io.emit('game_start', { nonce: state.nonce });
  
  tick();
}

function tick() {
  if (state.status !== 'IN_PROGRESS') return;

  const elapsed = (Date.now() - state.startTime) / 1000;
  // Adjusted growth formula to match the visual feel
  state.multiplier = Math.pow(Math.E, 0.08 * elapsed);

  if (state.multiplier >= (state.crashPoint || 0)) {
    state.multiplier = state.crashPoint || 1.0;
    crash();
  } else {
    io.emit('multiplier_tick', { multiplier: state.multiplier.toFixed(2) });
    setTimeout(tick, 50); // High frequency (20fps) for smoothness
  }
}

function crash() {
  state.status = 'CRASHED';
  console.log(`[Broadcaster] Round ${state.nonce} CRASHED at ${state.multiplier.toFixed(2)}`);
  io.emit('game_crash', { multiplier: state.multiplier.toFixed(2) });
  
  setTimeout(() => {
    state.status = 'WAITING';
    const waitTime = 5000;
    io.emit('game_waiting', { nextRoundIn: waitTime });
    setTimeout(startNewRound, waitTime);
  }, 4000);
}

io.on('connection', (socket) => {
  console.log('[Broadcaster] New connection:', socket.id);
  socket.emit('initial_state', { 
    status: state.status, 
    multiplier: state.multiplier.toFixed(2),
    nextRoundIn: 5000
  });

  socket.on('disconnect', () => {
    console.log('[Broadcaster] Client disconnected:', socket.id);
  });
});

const PORT = 3006;
// Listening on 0.0.0.0 is often more reliable than localhost in some dev environments
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`[Broadcaster] Server live at http://0.0.0.0:${PORT}`);
  startNewRound();
});
