import { Router } from "express";
import { getSubscriptionTypes } from "../controllers/validationController.js";

const validationRouter = Router();

validationRouter.get("/subscriptions", getSubscriptionTypes);

export default validationRouter;