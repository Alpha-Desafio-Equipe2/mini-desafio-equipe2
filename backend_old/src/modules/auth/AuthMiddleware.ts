import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const isAuthenticated = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return response.status(401).json({ error: "Token is missing" });
  }

  const [, token] = authHeader.split(" ");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    request.user = decoded;
    return next();
  } catch (err) {
    return response.status(401).json({ error: "Invalid token" });
  }
};
