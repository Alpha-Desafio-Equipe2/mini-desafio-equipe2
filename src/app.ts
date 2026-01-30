import express from "express";
import cors from "cors";
import routes from "./routes.js";
import { errorHandler } from "./shared/middlewares/errorHandler.js";

const app = express();

app.use(express.json());

app.use(cors());

app.use("/farma-project", routes);

app.use(errorHandler);

export default app;
