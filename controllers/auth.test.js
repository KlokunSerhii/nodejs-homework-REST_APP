const request = require("supertest");
const mongoose = require("mongoose");
require("dotenv").config();

const { DB_HOST, PORT } = process.env;
const { login } = require("./auth");
const app = require("../app");
app.post("users/login", login);

// eslint-disable-next-line no-undef
describe("test login controller", () => {
  let server;
  let response;

  // eslint-disable-next-line no-undef
  beforeAll(() => {
    mongoose
      .connect(DB_HOST)
      .then(() => (server = app.listen(PORT)))
      .catch((e) => process.exit(1));
  });

  // eslint-disable-next-line no-undef
  afterAll(() => {
    mongoose.disconnect(DB_HOST).then(() => {
      server.close();
    });
  });

  // eslint-disable-next-line no-undef
  beforeEach(async () => {
    response = await request(app).post("/api/users/login").send({
      email: "serhii@gmail.com",
      password: "123456",
    });
  });

  // eslint-disable-next-line no-undef
  test("response.status(200)", async () => {
    // eslint-disable-next-line no-undef
    expect(response.status).toBe(200);
  });

  // eslint-disable-next-line no-undef
  test("get token", async () => {
    const { token } = response.body;
    // eslint-disable-next-line no-undef
    expect(token).toBeTruthy();
  });

  // eslint-disable-next-line no-undef
  test("user object with two fields of string data type", async () => {
    const { user } = response.body;
    // eslint-disable-next-line no-undef
    expect(typeof user.email).toBe("string");
    // eslint-disable-next-line no-undef
    expect(typeof user.subscription).toBe("string");
  });
});
