import jwt from "jsonwebtoken";
import db from "../models/index.js";

const User = db.user;
const Role = db.role;

const verifyToken = (req, res, next) => {
  let token = req.headers["authorization"];
  if (!token) return res.status(403).send({ message: "No token provided!" });

  token = token.replace("Bearer ", "");
  jwt.verify(token, "secret-key", (err, decoded) => {
    if (err) return res.status(401).send({ message: "Unauthorized!" });
    req.userId = decoded.id;
    next();
  });
};

const isAdmin = async (req, res, next) => {
  const user = await User.findByPk(req.userId);
  const roles = await user.getRoles();
  if (roles.some(role => role.name === "admin")) {
    return next();
  }
  res.status(403).send({ message: "Require Admin Role!" });
};

const isModerator = async (req, res, next) => {
  const user = await User.findByPk(req.userId);
  const roles = await user.getRoles();
  if (roles.some(role => role.name === "moderator")) {
    return next();
  }
  res.status(403).send({ message: "Require Moderator Role!" });
};

export default { verifyToken, isAdmin, isModerator };
