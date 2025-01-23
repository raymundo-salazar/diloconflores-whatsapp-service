import express from "express";
import dotenv from "dotenv";
import routes from "@routes/index";
import { errorHandler } from "@middleware/errorHandler";
import { responseHandler } from "@middleware/responseHandler";
import { notFoundHandler } from "@middleware/notFoundHandler";

dotenv.config();

const app = express();

app.use(express.json());

// ADMIN ROUTES
app.use("/api", routes);

app.use(notFoundHandler);
app.use(responseHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
