import { Server, Socket } from "socket.io";
import { createAdapter } from "@socket.io/redis-streams-adapter";
import { serverConnection } from "./httpServer";
import { redisConnection } from "./redis";
import { SOCKET } from "../constants";

/**
 * Class representing a socket connection.
 */
class SocketConnection {
  private socketClientIo!: Server;

  /**
   * Establishes a socket connection with the server.
   * @returns {Promise<void>} A Promise that resolves after the socket connection is established.
   */
  async socketConnect(): Promise<void> {
    try {
      const { httpServer } = serverConnection;
      const { redisPubClient } = redisConnection;

      // Socket configuration
      const socketConfig = {
        transports: [SOCKET.WEBSOCKET, SOCKET.POLLING],
        pingInterval: 4000, // Send ping/pong events every 4 seconds
        pingTimeout: 10000, // Disconnect if ping is not received within 10 seconds of ping interval
        allowEIO3: true, // Allow usage of engine.io version 3
      };

      // Initialize socket client with the given server and configuration
      this.socketClientIo = new Server(httpServer, socketConfig);

      // for redis client connection
      await redisPubClient.SETEX("socket", 1, "");

      // Set up Redis adapter for socket.io
      this.socketClientIo.adapter(createAdapter(redisPubClient));

      // Event listener for new socket connections
      this.socketClientIo.on(SOCKET.CONNECTION, this.connectionCB);
      return;
    } catch (error) {
      console.info("CATCH_ERROR : Socket Connection error:", error);
    }
  }

  /**
   * Callback function for handling socket connection events.
   * @private
   * @param {any} client - The client socket object.
   * @returns {Promise<void>} A Promise that resolves after handling the socket connection event.
   */
  private async connectionCB(client: Socket): Promise<void> {
    try {
      console.info("new socket connection :: ", client.id);

      // Event listener for packet events
      client.conn.on(SOCKET.PACKET, (packet: any) => {
        if (packet.type === "ping") {
          // Handle ping packet
        }
      });

      // Event listener for socket errors
      client.on(SOCKET.ERROR, (error: any) =>
        console.error("CATCH_ERROR : Socket : client error......,", error)
      );

      // Event listener for socket disconnection
      client.on(SOCKET.DISCONNECT, (disconnectReason: any): any => {
        console.info("disconnect :: disconnectReason :: ", disconnectReason);
      });

      // client.use(requestHandler.bind(null, client));
      // client.use(locationRequestHandler.bind(null, client));
      // client.use(chatRequestHandler.bind(null, client));
      // client.use(settingRequestHandler.bind(null, client));
    } catch (error) {
      console.error("error: ", error);
    }
  }

  /**
   * Gets the socket client.
   * @returns {any} The socket client.
   */
  get socketClient(): Server {
    return this.socketClientIo;
  }
}

export const socketConnection = new SocketConnection();
