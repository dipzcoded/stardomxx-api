import express, { Request, Response } from "express";

const app = express();

app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({
    message: "Welcome to stardomx api",
  });
});

export { app };
