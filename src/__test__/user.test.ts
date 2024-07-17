//List out the things you wanna test
import mongoose from "mongoose";
import * as UserService from "../services/user_service";
import * as SessionService from "../services/session_service";
import supertest from "supertest";
import { createApp } from "../utils/createApp";

const app = createApp();
const userId = new mongoose.Types.ObjectId().toString();

const userPayload = {
  _id: userId,
  email: "jane.doe@example.com",
  name: "Jane Doe",
};

const sessionPayload = {
  _id: new mongoose.Types.ObjectId().toString(),
  user: userId,
  valid: true,
  userAgent: "PostmanRuntime/7.28.4",
  createdAt: new Date("2021-09-30T13:31:07.674Z"),
  updatedAt: new Date("2021-09-30T13:31:07.674Z"),
  __v: 0,
};

const userInput = {
  email: "test@example.com",
  name: "Jane Doe",
  password: "Password123",
  passwordConfirmation: "Password123",
};

describe("user", () => {
  beforeAll(() => {
    //we are integration testing a fake database not the real one
    mongoose
      .connect("mongodb://127.0.0.1:27017/rest-api-tutorial-test")
      .then(() => console.log("Connected to Test Database"))
      .catch((err) => console.log(`Error: ${err}`));
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });
  //This is integration/e2e testing. We are testing a specific functionality
  describe("user registration", () => {
    describe("given the user input fields are valid", () => {
      it("should return a 200 and the user payload", async () => {
        //stub the method
        const createUserServiceMock = jest
          .spyOn(UserService, "createUser")
          //@ts-ignore
          .mockReturnValueOnce(userPayload);

        //.send attach a req.body
        const { statusCode, body } = await supertest(app)
          .post("/api/users")
          .send(userInput);
        expect(statusCode).toBe(200);
        expect(body).toEqual(userPayload);
        expect(createUserServiceMock).toHaveBeenCalledWith(userInput);
      });
    });

    //testing all scenarios
    describe("given the passwords do not match", () => {
      it("should return a 404 error", async () => {
        const createUserServiceMock = jest
          .spyOn(UserService, "createUser")
          //@ts-ignore
          .mockReturnValueOnce(userPayload);

        //.send attach a req.body
        const { statusCode, body } = await supertest(app)
          .post("/api/users")
          .send({ ...userInput, passwordConfirmation: "wrong_password" });
        expect(statusCode).toBe(400);
        expect(createUserServiceMock).not.toHaveBeenCalled();
      });
    });

    describe("given the user service throws", () => {
      it("should return a 409 error", async () => {
        const createUserServiceMock = jest
          .spyOn(UserService, "createUser")
          //@ts-ignore
          //mock the createUser to return a Promise.reject
          //or basically Promise.reject, which will be catch and throw send 409 status error
          .mockImplementationOnce(() => Promise.reject("Failed"));

        //.send attach a req.body
        const { statusCode } = await supertest(app)
          .post("/api/users")
          .send(userInput);

        expect(statusCode).toBe(409);
        expect(createUserServiceMock).toHaveBeenCalled();
      });
    });
  });

  describe("create user session", () => {
    describe("given the username and password are valid", () => {
      it("should return a signed accessToken and refreshToken", () => {
        //create this test without superTest
        jest
          .spyOn(UserService, "validatePassword")
          //@ts-ignore
          .mockReturnValueOnce(userPayload);

        jest
          .spyOn(SessionService, "createSession")
          //@ts-ignore
          .mockReturnValueOnce(sessionPayload);

        const req = {
          body: {
            email: "test@example.com",
            password: "Password1232",
          },
        };
      });
    });
  });
});
