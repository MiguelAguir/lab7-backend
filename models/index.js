import config from "../config/db.config.js";
import Sequelize from "sequelize";

const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  pool: config.pool
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = await import("./user.model.js");
db.role = await import("./role.model.js");

db.user = db.user.default(sequelize, Sequelize);
db.role = db.role.default(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
  through: "user_roles"
});
db.user.belongsToMany(db.role, {
  through: "user_roles"
});

db.ROLES = ["user", "admin", "moderator"];

export default db;
