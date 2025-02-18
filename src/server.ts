import "./config/config";
import { initializeConnections } from "./connections/index.connection";
import logger from "./services/logger.service";
import { bullQueue } from "./bull/index.bull";

(() => {
  initializeConnections();

  // Cron For Send mail
  bullQueue.projectCronQueue.addQueue(
    {},
    {
      repeat: { cron: "*/5 * * * *" }, // repeat every 5 minutes
    }
  );

  // Cron For Send mail
  bullQueue.taskCronQueue.addQueue(
    {},
    {
      repeat: { cron: "*/5 * * * *" }, // repeat every 5 minutes
    }
  );
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
