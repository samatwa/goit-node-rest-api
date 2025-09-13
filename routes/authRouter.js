import express from "express";
import upload from "../middlewares/upload.js";
import authenticate from "../middlewares/authenticate.js";
import authControllers from "../controllers/authControllers.js";
import validateBody from "../helpers/validateBody.js";
import {
  registerSchema,
  loginSchema,
  updateSubscriptionSchema,
} from "../schemas/authSchema.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  validateBody(registerSchema),
  authControllers.registerController
);
authRouter.post(
  "/login",
  validateBody(loginSchema),
  authControllers.loginController
);
authRouter.get("/current", authenticate, authControllers.getCurrentController);
authRouter.post("/logout", authenticate, authControllers.logoutController);
authRouter.patch(
  "/subscription",
  authenticate,
  validateBody(updateSubscriptionSchema),
  authControllers.updateSubscriptionController
);
authRouter.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  authControllers.updateAvatarController
);

export default authRouter;
