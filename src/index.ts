import cors from "cors";
import express, { urlencoded } from "express";
import { mainRouter } from "./routes/main-router";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"],
    exposedHeaders: ["Content-Length", "X-Request-Id"],
    credentials: true,
    optionsSuccessStatus: 204,
    maxAge: 86400,
  })
);

app.use(express.json());
app.use(urlencoded({ extended: true }));

app.use(mainRouter);

app.get("/", (req, res) => {
  res.json({ message: "hello world" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
