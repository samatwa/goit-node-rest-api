import User from "../db/User.js";
import bcrypt from "bcrypt";
import HttpError from "../helpers/HttpError.js";
import { createToken } from "../helpers/jwt.js";

export const findUser = (query) => User.findOne({ where: query });

export const registerUser = async (payload) => {
  const hashedPassword = await bcrypt.hash(payload.password, 10);
  return User.create({ ...payload, password: hashedPassword });
};

export const loginUser = async (payload) => {
  const { email, password } = payload;
  const user = await findUser({ email });

  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const tokenPayload = { id: user.id };
  const token = createToken(tokenPayload);

  await user.update({ token });

  return {
    token,
    user: { email: user.email, subscription: user.subscription },
  };
};

export const logoutUser = async (id) => {
  const user = await User.findByPk(id);

  if (!user) {
    throw HttpError(401, "Not authorized");
  }

  await user.update({ token: null });
};

export const updateSubscription = async (id, subscription) => {
  const user = await User.findByPk(id);
  if (!user) return null;

  await user.update({ subscription });
  return user;
};
