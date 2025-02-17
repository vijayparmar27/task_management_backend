import { Request, Response, NextFunction } from "express";
import logger from "../services/logger.service";
import { decryptToken } from "../utils/common.utils";
import { verify } from "jsonwebtoken";
import Config from "../config/config";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const authorizationToken = req.headers.authorization?.split(" ")[1];
  const { JWT_SECRET } = Config;

  try {
    if (!authorizationToken) {
      return res.status(401).json({ message: "No Token Provide" });
    }

    const decryptedToken = decryptToken(authorizationToken, JWT_SECRET);

    const decoded: any = await verify(decryptedToken, JWT_SECRET);

    req.headers.id = decoded.id;

    return next();
  } catch (error: any) {
    logger.error(`---- ERROR : authMiddleware : `, error);
    return res.status(401).json({ message: error.message });
  }
};
