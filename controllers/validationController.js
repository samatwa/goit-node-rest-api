import { subscriptionTypes } from "../constants/subscription-constants.js";

export const getSubscriptionTypes = (req, res) => {
  res.json({ subscriptionTypes });
};
