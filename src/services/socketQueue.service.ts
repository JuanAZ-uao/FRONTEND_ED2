import { io, type Socket } from 'socket.io-client';

export interface QueueJoinPayload {
  eventSlug: string;
  tierId: string;
  quantity: number;
  userEmail?: string;
}

export interface QueueUpdatePayload {
  roomId: string;
  position: number;
  estimatedWaitSeconds: number;
  activeExpiresAt?: number | null;
  queueLength?: number;
  holdSeconds?: number;
}

export interface QueueGrantedPayload {
  roomId: string;
  holdSeconds: number;
  expiresAt: number;
}

export interface QueueErrorPayload {
  message: string;
}

export interface QueueExpiredPayload {
  roomId: string;
  reason: string;
  message: string;
}

export interface QueueCompletedPayload {
  roomId: string;
  message: string;
}

const normalizeSocketUrl = (value: string) => value.trim().replace(/\/+$/, '').replace(/\/api$/, '');

const SOCKET_URL = normalizeSocketUrl(import.meta.env.VITE_API_URL ?? `http://${window.location.hostname}:3000`);

class SocketQueueService {
  private socket: Socket | null = null;
  private activeTurn: QueueGrantedPayload | null = null;

  connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        transports: ['websocket'],
        autoConnect: false,
      });
    }

    if (!this.socket.connected) {
      this.socket.connect();
    }

    return this.socket;
  }

  disconnect() {
    if (!this.socket) return;
    this.socket.disconnect();
  }

  setActiveTurn(payload: QueueGrantedPayload) {
    this.activeTurn = payload;
  }

  getActiveTurn() {
    return this.activeTurn;
  }

  clearActiveTurn() {
    this.activeTurn = null;
  }

  joinQueue(payload: QueueJoinPayload) {
    const socket = this.connect();
    socket.emit('queue:join', payload);
  }

  leaveQueue() {
    if (!this.socket) return;
    this.socket.emit('queue:leave');
    this.clearActiveTurn();
  }

  completeTurn(payload?: { roomId?: string }) {
    if (!this.socket) return;
    this.socket.emit('queue:complete', payload ?? {});
  }

  onQueueUpdate(callback: (payload: QueueUpdatePayload) => void) {
    const socket = this.connect();
    socket.on('queue:update', callback);

    return () => {
      socket.off('queue:update', callback);
    };
  }

  onQueueGranted(callback: (payload: QueueGrantedPayload) => void) {
    const socket = this.connect();
    const wrapped = (payload: QueueGrantedPayload) => {
      this.setActiveTurn(payload);
      callback(payload);
    };

    socket.on('queue:granted', wrapped);

    return () => {
      socket.off('queue:granted', wrapped);
    };
  }

  onQueueExpired(callback: (payload: QueueExpiredPayload) => void) {
    const socket = this.connect();
    const wrapped = (payload: QueueExpiredPayload) => {
      this.clearActiveTurn();
      callback(payload);
    };

    socket.on('queue:expired', wrapped);

    return () => {
      socket.off('queue:expired', wrapped);
    };
  }

  onQueueCompleted(callback: (payload: QueueCompletedPayload) => void) {
    const socket = this.connect();
    const wrapped = (payload: QueueCompletedPayload) => {
      this.clearActiveTurn();
      callback(payload);
    };

    socket.on('queue:completed', wrapped);

    return () => {
      socket.off('queue:completed', wrapped);
    };
  }

  onQueueError(callback: (payload: QueueErrorPayload) => void) {
    const socket = this.connect();
    socket.on('queue:error', callback);

    return () => {
      socket.off('queue:error', callback);
    };
  }
}

export const socketQueueService = new SocketQueueService();
