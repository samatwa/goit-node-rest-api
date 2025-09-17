import User from "../db/User.js";
import bcrypt from "bcrypt";
import HttpError from "../helpers/HttpError.js";
import sendEmail from "../helpers/sendEmail.js";
import { createToken } from "../helpers/jwt.js";
import gravatar from "gravatar";
import { nanoid } from "nanoid";
import { UniqueConstraintError } from "sequelize";

const { BASE_URL } = process.env;

export const findUser = (query) => User.findOne({ where: query });

export const createVerifyEmail = (email, verificationToken) => {
  return {
    to: email,
    subject: "Verify email",
    html: `<a href="${BASE_URL}/api/auth/verify/${verificationToken}" target="_blank">Click to verify email</a>`,
  };
};

export const registerUser = async (payload) => {
  const email = String(payload.email).trim().toLowerCase();
  const password = String(payload.password);
  const subscription = payload.subscription || "starter";
  const verificationToken = nanoid();

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw HttpError(409, "Email in use");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const avatarURL = gravatar.url(email, {
    s: "250",
    d: "mp",
    protocol: "https",
  });

  try {
    const newUser = await User.create({
      email,
      password: hashedPassword,
      subscription,
      avatarURL,
      verify: false,
      verificationToken,
    });

    const verifyEmail = createVerifyEmail(email, verificationToken);

    await sendEmail(verifyEmail);

    return {
      email: newUser.email,
      subscription: newUser.subscription,
      avatarURL: newUser.avatarURL,
    };
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      throw HttpError(409, "Email in use");
    }
    throw error;
  }
};

export const verifyUser = async (verificationToken) => {
  const user = await findUser({ verificationToken });
  if (!user) {
    throw HttpError(404, "User not found");
  }

  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  await user.update({ verify: true, verificationToken: null });

  return { message: "Verification successful" };
};

export const resendVerifyEmail = async (email) => {
  const user = await findUser({ email });
  if (!user) {
    throw HttpError(404, "User not found");
  }

  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  const verifyEmail = createVerifyEmail(email, user.verificationToken);

  await sendEmail(verifyEmail);

  return { message: "Verification email sent" };
};

export const loginUser = async (payload) => {
  const email = String(payload.email).trim().toLowerCase();
  const password = String(payload.password);

  const user = await findUser({ email });

  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  if (!user.verify) {
    throw HttpError(401, "Email not verified");
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
    user: {
      email: user.email,
      subscription: user.subscription,
      avatarURL: user.avatarURL,
    },
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

export const updateAvatar = async (id, avatarURL) => {
  const user = await User.findByPk(id);
  if (!user) {
    throw HttpError(404, "User not found");
  }

  user.avatarURL = avatarURL;
  await user.save();

  return user;
};
