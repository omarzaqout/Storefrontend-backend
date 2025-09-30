import express, { Request, Response } from "express";

const app = express();

app.get("/articles", (_req: Request, res: Response) => {
  try {
    res.send("this is the INDEX route");
  } catch (err) {
    res.status(400);
    res.json(err);
  }
});
