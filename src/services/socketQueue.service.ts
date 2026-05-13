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
}

export interface QueueGrantedPayload {
  roomId: string;
  holdSeconds: number;
  expiresAt: number;
}

export interface QueueErrorPayload {
  message: string;
}

const SOCKET_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

class SocketQueueService {
  private socket: Socket | null = null;

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

  joinQueue(payload: QueueJoinPayload) {
    const socket = this.connect();
    socket.emit('queue:join', payload);
  }

  leaveQueue() {
    if (!this.socket) return;
    this.socket.emit('queue:leave');
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
    socket.on('queue:granted', callback);

    return () => {
      socket.off('queue:granted', callback);
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
