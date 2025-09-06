import * as authServices from "../services/authServices.js";

const registerController = async (req, res, next) => {
  try {
    const { email, subscription } = await authServices.registerUser(req.body);
    return res.status(201).json({ user: { email, subscription } });
  } catch (error) {
    next(error);
  }
};

const loginController = async (req, res, next) => {
  try {
    const result = await authServices.loginUser(req.body);
    return res.json(result);
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


export default {
  registerController,
  loginController,
  getCurrentController,
  logoutController,
  updateSubscriptionController
};
