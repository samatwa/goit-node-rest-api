import HttpError from "../helpers/HttpError.js";

export default function checkBodyNotEmpty(req, res, next) {
  if (!req.body || Object.keys(req.body).length === 0) {
    return next(HttpError(400, "Body must have at least one field"));
  }
  next();
}
