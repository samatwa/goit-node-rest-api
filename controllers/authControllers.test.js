import { jest } from "@jest/globals";

await jest.unstable_mockModule("../db/sequelize.js", () => ({
  default: {},
}));

const loginUser = jest.fn();
await jest.unstable_mockModule("../services/authServices.js", () => ({
  loginUser,
}));

const { default: authControllers } = await import("./authControllers.js");
const { loginController } = authControllers;

describe("loginController", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {
        email: "test@example.com",
        password: "123456",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    loginUser.mockReset();
  });

  it("should respond with status 200 and include token and user (email, subscription", async () => {
    const fakeUser = {
      token: "fake.jwt.token",
      user: {
        email: "test@example.com",
        subscription: "starter",
      },
    };

    loginUser.mockResolvedValue(fakeUser);

    await loginController(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        token: expect.any(String),
        user: expect.objectContaining({
          email: expect.any(String),
          subscription: expect.any(String),
        }),
      })
    );
  });
});
