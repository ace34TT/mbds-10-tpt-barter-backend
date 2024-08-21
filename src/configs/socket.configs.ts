import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server } from 'http';

class SocketManager {
  private static instance: SocketManager;
  private io: SocketIOServer | null = null;
  private users = new Map<string, string>();

  private constructor() {}

  public static getInstance(): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager();
    }
    return SocketManager.instance;
  }

  public initSocket(server: Server): void {
    if (this.io) {
      console.warn('Socket.io already initialized');
      return;
    }
    this.io = new SocketIOServer(server , {
      cors: {
        origin: "*",
      },
    });
    console.log("Initializing socket.io server...");

    this.io.on('connection', (socket: Socket) => {
      console.log("new client connected " , socket.id)

      socket.on('connect-user', (userId: string) => {
        console.log("connecting user" , userId)
        this.users.set(userId.toString(), socket.id);
        socket.join(userId);
      });

      socket.on('disconnect', () => {
        for (const [userId, socketId] of this.users.entries()) {
          if (socketId === socket.id) {
            this.users.delete(userId);
            break;
          }
        }
      });
    });
  }

  public getIo(): SocketIOServer {
    if (!this.io) {
      throw new Error('Socket.io not initialized!');
    }
    return this.io;
  }

  public getUsers(): Map<string, string> {
    return this.users;
  }
}

export const socketManager = SocketManager.getInstance();
