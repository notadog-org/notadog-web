import signalR from "@aspnet/signalr/dist/browser/signalr";
import { room, player } from "../store/game";
import { config } from "../config.js";
import { tokenService } from "../services/token";
import { globalHubErrorsHandler } from "../store/errors";

let connection;

export class GameHub {
  static init() {
    connection = new signalR.HubConnectionBuilder()
      .withUrl(config.apiWsGameHost, {
        accessTokenFactory: async () => {
          return `Bearer ${tokenService.get()}`;
        },
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .configureLogging(signalR.LogLevel.Information)
      .build();

    connection.on("OnConnect", value => {
      console.log("OnConnect", value);
      player.set(value);
    });

    connection.on("OnRoomUpdate", value => {
      console.log("OnRoomUpdate", value);
      room.set(value);
    });

    connection.on("OnDisconnect", data => {
      console.log("OnDisconnect", data);
    });

    connection.on("OnMakedMove", data => {
      console.log(`OnMakedMove`, data);
    });
  }

  static async connect() {
    try {
      this.init();
      await connection.start();
    } catch (err) {
      globalHubErrorsHandler(err);
    }
  }

  static async disconnect() {
    try {
      if (!connection) return;
      await connection.stop();
    } catch (err) {
      globalHubErrorsHandler(err);
    }
  }

  static async refresh() {
    try {
      await connection.invoke("Refresh");
    } catch (err) {
      globalHubErrorsHandler(err.message);
    }
  }

  static async replay() {
    try {
      await connection.invoke("Replay");
    } catch (err) {
      globalHubErrorsHandler(err);
    }
  }

  static async startGame() {
    try {
      await connection.invoke("StartGame");
    } catch (err) {
      globalHubErrorsHandler(err);
    }
  }

  static async makeMove() {
    try {
      await connection.invoke("MakeMove");
    } catch (err) {
      globalHubErrorsHandler(err);
    }
  }

  static async leaveRoom() {
    try {
      await connection.invoke("LeaveRoom");
    } catch (err) {
      globalHubErrorsHandler(err);
    }
  }
}
