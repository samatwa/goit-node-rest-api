import * as authServices from "../services/authServices.js";
import path from "node:path";
import fs from "node:fs/promises";
import HttpError from "../helpers/HttpError.js";

const avatarsDir = path.resolve("public", "avatars");

const registerController = async (req, res, next) => {
  try {
    const { email, subscription, avatarURL } = await authServices.registerUser(
      req.body
    );
    return res.status(201).json({ user: { email, subscription, avatarURL } });
  } catch (error) {
    next(error);
  }
};

const loginController = async (req, res, next) => {
  try {
    const result = await authServices.loginUser(req.body);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getCurrentController = async (req, res, next) => {
  try {
    const { email, subscription } = req.user;
    return res.status(200).json({ email, subscription });
  } catch (error) {
    next(error);
  }
};

const logoutController = async (req, res, next) => {
  try {
    await authServices.logoutUser(req.user.id);
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const updateSubscriptionController = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { subscription } = req.body;

    const updatedUser = await authServices.updateSubscription(id, subscription);

    if (!updatedUser) throw HttpError(404, "User not found");

    res.status(200).json({
      email: updatedUser.email,
      subscription: updatedUser.subscription,
    });
  } catch (error) {
    next(error);
  }
};

const updateAvatarController = async (req, res, next) => {
  try {
    if (!req.user?.id) throw HttpError(401, "Not authorized");
    if (!req.file) throw HttpError(400, "Avatar file is required");

    const { id } = req.user;
    const { path: tempPath, filename } = req.file;

    const newPath = path.join(avatarsDir, filename);
    await fs.rename(tempPath, newPath);

    const avatarURL = `/avatars/${filename}`;

    const user = await authServices.findUser({ id });
    const oldAvatar = user?.avatarURL;

    await authServices.updateAvatar(id, avatarURL);

    if (oldAvatar && oldAvatar.startsWith("/avatars/")) {
      const oldPath = path.join(avatarsDir, path.basename(oldAvatar));
      try {
        await fs.unlink(oldPath);
      } catch {}
    }

    return res.status(200).json({ avatarURL });
  } catch (error) {
    if (req?.file?.path) {
      try {
        await fs.unlink(req.file.path);
      } catch {}
    }
    return next(error);
  }
};

export default {
  registerController,
  loginController,
  getCurrentController,
  logoutController,
  updateSubscriptionController,
  updateAvatarController,
};
