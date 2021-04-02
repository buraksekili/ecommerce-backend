const request = require("supertest");
const app = require("../src");
const { User } = require("../src/db");
const mongoose = require("mongoose");
const { MONGO_OPTIONS } = require("../src/config");
const { dropAllCollections, removeAllCollections } = require("./helpers");

const MONGO_TEST_URI = `mongodb://admin2:${encodeURIComponent(
  "example"
)}@localhost:27018/test2`;
module.exports = MONGO_TEST_URI;

let testUser = {
  userEmail: "king@james.king23",
  password: "king!",
  username: "lacavs",
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

describe("GET /admin user", () => {
  it("should get all users", async (done) => {
    const url = "/admin/users";
    try {
      const result = await request(app).get(url);

      // status check
      expect(result.status).toEqual(200);
      expect(result.body.status).toEqual(true);

      // check result body
      expect(typeof result.body).toBe("object");
      expect(result.body.hasOwnProperty("users")).toBe(true);
      expect(typeof result.body.users).toBe("object");
      expect(result.body.hasOwnProperty("status")).toBe(true);

      const { userEmail, username } = testUser;
      expect(result.body.users[0]).toMatchObject({ userEmail, username });

      done();
    } catch (error) {
      done(error);
    }
  });
});
