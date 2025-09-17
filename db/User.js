import { DataTypes } from "sequelize";
import sequelize from "./sequelize.js";
import { subscriptionTypes } from "../constants/subscription-constants.js";
import { emailRegexp } from "../constants/auth-constants.js";

const User = sequelize.define("user", {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      is: emailRegexp,
    },
    unique: {
      args: true,
      msg: "Email address already in use!",
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  subscription: {
    type: DataTypes.ENUM(...subscriptionTypes),
    defaultValue: "starter",
  },
  avatarURL: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  token: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
  verify: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  verificationToken: {
    type: DataTypes.STRING,
  },
});

// User.sync({ force: true });

export default User;
