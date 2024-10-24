import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();

import Route from "./routes/index";
import { errorHandler } from "./errorHandling";

const app: Application = express();
const PORT: number = parseInt(process.env.SERVER_PORT || "3000", 10);
const HOST = process.env.SERVER_HOST || "localhost";

app.use(cors({
  origin: 'http://spots.vest.li', // Your frontend's URL
  credentials: true // Allow credentials (cookies, authorization headers, etc.)
}));

app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/v1", Route);

app.use(errorHandler);

try {
  app.listen(PORT, HOST, (): void => {
    console.log(`Connected successfully on host: http://${HOST}:${PORT}/`);
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} catch (error: any) {
  console.error(`Error occured: ${error.message}`);
}
