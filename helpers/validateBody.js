import HttpError from "./HttpError.js";

const validateBody = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return next(
      HttpError(400, "Помилка від Joi або іншої бібліотеки валідації")
    );
  }
  req.body = value;
  next();
};

export default validateBody;
