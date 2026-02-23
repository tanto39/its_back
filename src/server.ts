import app from "./app";
import { AppDataSource } from "./data-source";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3001;

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });
