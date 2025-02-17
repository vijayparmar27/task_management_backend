import "./config/config";
import { initializeConnections } from "./connections/index.connection";
import logger from "./services/logger.service";

(() => {
  initializeConnections();
})();

process
  .on("unhandledRejection", (reason, p) => {
    console.log(reason);
    console.log(p);
    logger.error(
      reason,
      "Unhandled Rejection at Promise >> ",
      new Date(),
      " >> ",
      p
    );
  })
  .on("uncaughtException", (err) => {
    console.log(err);
    logger.error("Uncaught Exception thrown", new Date(), " >> ", "\n", err);
  });
