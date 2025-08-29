import express from "express";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config";
import contactsRouter from "./routes/contactsRouter.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import "./db/sequelize.js";

const PORT = process.env.DB_PORT;
const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running. Use our API on port: ${PORT}`);
});
