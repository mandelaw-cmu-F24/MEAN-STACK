import * as dotenv from "dotenv";
import cors from "cors";
import express from "express";
import { connectToDatabase } from "./database";
import { employeeRouter } from "./employee-routes";

dotenv.config();

const { ATLAS_URI } = process.env;

if (!ATLAS_URI) {
  console.log("No ATLAS_URI provided in the .env file");
  process.exit(1);
}

connectToDatabase(ATLAS_URI)
  .then(() => {
    const app = express();
    app.use(cors());

    app.use("/employees", employeeRouter);

    app.listen(5200, () => {
      console.log(`server is running at http://localhost:5200...`);
    });
  })
  .catch((error) => console.error(error));
