import http from "http";
import https from "https";
import express from "express";
import fs from "graceful-fs";
import path from "path";
import morgan from "morgan";
import Config from "../config/config";
import logger from "../services/logger.service";
import Index from "../routers/index.routes";
import cors from "cors";
const { DateTime } = require("luxon");

class ServerConnection {
  private readonly server;
  private readonly app = express();

  constructor() {
    const { SSL_CRT_FILE, SSL_KEY_FILE } = Config;

    this.app.use(morgan("dev"));
    this.app.use(express.urlencoded({ extended: true }));

    this.app.use(express.json());
    this.app.use(cors({ origin: "*" }));
    const uploadFilePath = path.join(__dirname, "../../upload");
    this.app.use(express.static(uploadFilePath));

    this.app.get("/", (req: any, res: any) => {
      const date = new Date().toISOString();
      console.log("timestamp:", Date.now());
      console.log("date:", date);

      // Convert to Luxon DateTime (UTC first, then to IST)
      const istDate = DateTime.fromISO(date, { zone: "utc" }).setZone(
        "Asia/Kolkata"
      );

      // Return timestamp (in milliseconds)
      const istTimestamp = istDate.toMillis();

      // Display results
      console.log("istTimestamp", istTimestamp);
      console.log("Original Date (UTC):", istDate.toISO());
      console.log(
        "Converted Date (IST):",
        istDate.toFormat("yyyy-MM-dd HH:mm:ss ZZZZ")
      );

      return res.json({ istDate });
    });

    this.app.use("/", Index);

    if (
      fs.existsSync(path.join(__dirname, SSL_KEY_FILE)) &&
      fs.existsSync(path.join(__dirname, SSL_CRT_FILE))
    ) {
      // creating https secure socket server
      let options = {
        key: fs.readFileSync(path.join(__dirname, SSL_KEY_FILE)),
        cert: fs.readFileSync(path.join(__dirname, SSL_CRT_FILE)),
      };
      logger.info("creating https app");
      this.server = https.createServer(options, this.app);
    } else {
      // creating http server
      logger.info("creating http app");
      this.server = http.createServer(this.app);
    }
  }

  get httpServer() {
    return this.server;
  }

  async listenServer() {
    const { PORT, ENVIROMENT } = Config;

    this.httpServer.listen(PORT, () => {
      logger.debug(`${ENVIROMENT} server listening on ${PORT}`);
    });
  }
}

export const serverConnection = new ServerConnection();
