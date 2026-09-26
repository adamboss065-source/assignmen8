import express from "express";
import dotenv from "dotenv";
import connectDB from "./connection.js/connection.db.js";
import globalErrMiddleware from "./middlleware/err.middlleware.js";
import notFoundMiddleware from "./middlleware/notfound.middlleware.js";
import userRoutes from "./routers/user.router.js";
import noteRoutes from "./routers/note.router.js";

dotenv.config();
const app = express();
app.use(express.json());

await connectDB();

app.use("/users", userRoutes);
app.use("/note", noteRoutes);

app.use("{/*dummy}", notFoundMiddleware);
app.use(globalErrMiddleware);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
