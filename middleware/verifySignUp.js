import db from "../models/index.js";

const ROLES = db.ROLES;
const User = db.user;

const checkDuplicateUsernameOrEmail = async (req, res, next) => {
  if (await User.findOne({ where: { username: req.body.username } }))
    return res.status(400).send({ message: "Username already exists" });

  if (await User.findOne({ where: { email: req.body.email } }))
    return res.status(400).send({ message: "Email already exists" });

  next();
};

const checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let role of req.body.roles) {
      if (!ROLES.includes(role)) {
        return res.status(400).send({
          message: `Failed! Role ${role} does not exist.`
        });
      }
    }
  }
  next();
};

export default { checkDuplicateUsernameOrEmail, checkRolesExisted };
