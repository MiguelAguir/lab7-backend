import db from "../models/index.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const User = db.user;
const Role = db.role;

export const signup = async (req, res) => {
  const user = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  });

  if (req.body.roles) {
    const roles = await Role.findAll({ where: { name: req.body.roles } });
    await user.setRoles(roles);
  } else {
    await user.setRoles([1]);
  }

  res.send({ message: "User registered successfully!" });
};

export const signin = async (req, res) => {
  const user = await User.findOne({ where: { username: req.body.username } });
  if (!user) return res.status(404).send({ message: "User not found" });

  const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
  if (!passwordIsValid)
    return res.status(401).send({ message: "Invalid Password!" });

  const token = jwt.sign({ id: user.id }, "secret-key", { expiresIn: 86400 });

  const roles = await user.getRoles();
  const authorities = roles.map(role => "ROLE_" + role.name.toUpperCase());

  res.status(200).send({
    id: user.id,
    username: user.username,
    email: user.email,
    roles: authorities,
    accessToken: token
  });
};
