const request = require("supertest");
const app = require("../src");
const mongoose = require("mongoose");
const { dropAllCollections, removeAllCollections } = require("./helpers");
jest.setTimeout(30000);

const { User } = require("../src/db");
const MONGO_TEST_URI = require("./user.test");
const { MONGO_OPTIONS } = require("../src/config");

let testUser = {
  userEmail: "loginking@james.king23",
  password: "loginking!",
  username: "loginlacavs",
};

beforeAll(async () => {
  await mongoose.connect(MONGO_TEST_URI, MONGO_OPTIONS);
});

afterAll(async () => {
  await dropAllCollections();
  await mongoose.connection.close();
});

beforeEach(async () => {
  try {
    const newUser = new User(testUser);
    const user = await newUser.save();
    testUser["_id"] = user._id;
  } catch (error) {
    console.error("error in creating user", error);
  }
});

afterEach(async () => {
  try {
    await removeAllCollections();
  } catch (error) {
    console.error("error in deleting user", error);
  }
});

describe("POST /api for login and sigup", () => {
  it("should login", async (done) => {
    const url = "/api/login";
    try {
      const result = await request(app).post(url).send(testUser);

      // status check
      expect(result.status).toEqual(200);
      expect(result.body.status).toEqual(true);

      const { userEmail, username } = testUser;
      expect(result.body.user).toMatchObject({ userEmail, username });

      done();
    } catch (error) {
      done(error);
    }
  });
});
