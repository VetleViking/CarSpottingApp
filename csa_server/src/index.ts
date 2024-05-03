import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();

import Route from "./routes/index";

const app: Application = express();
const PORT: number = parseInt(process.env.SERVER_PORT || "3000", 10);
const HOST = process.env.SERVER_HOST || "localhost";

app.use(
  cors({
    origin: [
      "http://192.168.98.221:3000",
      "http://localhost:3000",
      "http://localhost:5173",
      "http://169.254.211.60:4000",
      "http://192.168.99.36:6969",
      "http://192.168.98.95:6969",
      "http://192.168.98.194:5173",
    ],
    credentials: true,
  })
);

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

try {
  app.listen(PORT, HOST, (): void => {
    console.log(`Connected successfully on host: http://${HOST}:${PORT}/`);
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} catch (error: any) {
  console.error(`Error occured: ${error.message}`);
}
