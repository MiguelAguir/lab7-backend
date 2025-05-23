require('dotenv').config()
import express from "express";
import cors from "cors";
import db from "./app/models/index.js";
import authRoutes from "./app/routes/auth.routes.js";
import userRoutes from "./app/routes/user.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

db.sequelize.sync({ force: true }).then(() => {
  console.log("Drop and Resync DB");
  initial();
});

function initial() {
  db.role.create({ id: 1, name: "user" });
  db.role.create({ id: 2, name: "moderator" });
  db.role.create({ id: 3, name: "admin" });
}

app.get("/", (req, res) => res.json({ message: "Welcome to JWT Auth App." }));

app.use("/api/auth", authRoutes);
app.use("/api/test", userRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
