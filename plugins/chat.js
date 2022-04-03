import consola from "consola";
import Peer from "peerjs";

const PUBLIC_P2P_SERVERS = [
  { url: "stun:stun.l.google.com:19302" }
  // { url: "stun:openrelay.metered.ca:80" },
  // {
  //   credential: "openrelayproject",
  //   url: "turn:openrelay.metered.ca:80",
  //   username: "openrelayproject"
  // },
  // {
  //   credential: "openrelayproject",
  //   url: "turn:openrelay.metered.ca:443",
  //   username: "openrelayproject"
  // },
  // {
  //   credential: "openrelayproject",
  //   url: "turn:openrelay.metered.ca:443?transport=tcp",
  //   username: "openrelayproject"
  // }
];
const CONNECTION_TIMEOUT_MS = 10000;

export class Room {
  constructor(
    room,
    {
      onMessage = (_room, message) => consola(`[${_room.id}]: ${message}`),
      onConnect = (_room) => consola.success(`Connected to ${_room.id}.`),
      onDisconnect = (_room) => consola.warn(`Disconnected from ${_room.id}`),
      history = []
    }
  ) {
    this.id = room.id;
    this.room = room;
    this.history = history;
    this.onMessage = onMessage;
    this.onConnect = onConnect;
    this.onDisconnect = onDisconnect;

    this.room.on("open", () => {
      room.on("data", (message) => {
        message = JSON.parse(message);

        this.history.push(message);
        this.onMessage(room, message);
      });
      room.on("close", () => this.onDisconnect(room));

      this.onConnect(this.room);
    });
  }

  async sendMessage(message) {
    message = JSON.stringify(message);

    this.history.push(message);
    this.room.sendMessage(message);
  }
}

export default class Chat {
  constructor(
    chatID,
    {
      privateServers = [],
      onReady = (chat) => consola.success(`Chat ${chat.id} ready!`),
      onConnect = (_room) => consola.success(`Connected to ${_room.id}.`),
      onDisconnect = (_room) => consola.warn(`Disconnected from ${_room.id}`),
      onMessage = (room, message) => consola(`[${room.id}]: ${message}`),
      rooms = new Map()
    }
  ) {
    this.id = chatID;
    this.servers = [...PUBLIC_P2P_SERVERS, ...privateServers];
    this.rooms = rooms;

    this.onReady = onReady;
    this.onConnect = onConnect;
    this.onDisconnect = onDisconnect;
    this.onMessage = onMessage;

    this.loadChat();
  }

  async sendMessage(roomID, message) {
    return (await this.loadRoom(roomID)).sendMessage(message);
  }

  async loadChat() {
    return new Promise((resolve, reject) => {
      if (this.chat) {
        return resolve(this.chat);
      }

      const timeoutID = setTimeout(
        () => reject("Error: Timed out while connecting to peer server."),
        CONNECTION_TIMEOUT_MS
      );

      const chat = new Peer(this.id, {
        config: {
          iceServers: this.servers
        }
      });

      chat.on("open", () => {
        clearTimeout(timeoutID);

        chat.on("connection", (room) => {
          room = new Room(room, {
            onConnect: () => this.rooms.set(room.id, room),
            onDisconnect: () => this.rooms.delete(room.id),
            onMessage: this.onMessage
          });
        });

        this.onReady(chat);

        this.chat = chat;
        resolve(chat);
      });
    });
  }

  async loadRoom(roomID) {
    const chat = await this.loadChat();

    return new Promise((resolve, reject) => {
      if (this.rooms.has(roomID)) {
        return resolve(this.rooms.get(roomID));
      }

      const timeoutID = setTimeout(
        () => reject("Timed out while connecting to room."),
        CONNECTION_TIMEOUT_MS
      );

      const room = new Room(chat.connect(roomID), {
        onConnect: () => {
          clearTimeout(timeoutID);

          this.rooms.set(roomID, room);

          this.onConnect(room);

          resolve(room);
        },
        onDisconnect: () => {
          this.rooms.delete(roomID);

          this.onDisconnect(room);
        },
        onMessage: this.onMessage
      });
    });
  }
}
