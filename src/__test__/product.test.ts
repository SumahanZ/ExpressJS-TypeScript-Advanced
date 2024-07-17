//testing is intuitive, do whatever works for you
import supertest from "supertest";
import { createApp } from "../utils/createApp";
import mongoose from "mongoose";
import { createProduct } from "../services/product_service";
import { signJWT } from "../utils/jwt_utils";

const app = createApp();

const userId = new mongoose.Types.ObjectId().toString();

//you can save these data on fixtures and use a fixturereader
export const userPayload = {
  _id: userId,
  email: "jane.doe@example.com",
  name: "Jane Doe",
};

export const productPayload = {
  user: userId,
  title: "Canon EOS 1500D DSLR Camera with 18-55mm Lens",
  description:
    "Designed for first-time DSLR owners who want impressive results straight out of the box, capture those magic moments no matter your level with the EOS 1500D. With easy to use automatic shooting modes, large 24.1 MP sensor, Canon Camera Connect app integration and built-in feature guide, EOS 1500D is always ready to go.",
  price: 879.99,
  image: "https://i.imgur.com/QlRphfQ.jpg",
};

describe("product", () => {
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

  //you can add .only on describe and it so it will only run this specific test/specific block
  //you can also add .skip to skip a specific block/test
  // describe.skip
  describe("get product route", () => {
    describe("given the product does not exist", () => {
      it("should return a 404 error", async () => {
        const productId = "product-123";
        //a way to use the api in a testing environment
        //allow supertest to handle
        await supertest(app).get(`/api/products/${productId}`).expect(404);
      });
    });

    describe("given the product does exist", () => {
      it("should return a 200 status and the product", async () => {
        //create product
        const product = await createProduct(productPayload);
        const { body, statusCode } = await supertest(app).get(
          `/api/products/${product.productId}`
        );

        expect(statusCode).toBe(200);
        expect(body.productId).toBe(product.productId);
        //you can also test other fields here
      });
    });
  });

  describe("create product route", () => {
    describe("given the user is not logged in", () => {
      //should be logged in to create product
      it("should return a 403 error", async () => {
        const { statusCode } = await supertest(app).post("/api/products");
        expect(statusCode).toBe(403);
      });
    });

    describe("given the user is logged in", () => {
      //should be logged in to create product
      it("should return a 201 status and create the product", async () => {
        const testAccessToken = signJWT(userPayload, {
          expiresIn: process.env.ACCESS_TOKEN_LIVE,
        });

        const { statusCode, body } = await supertest(app)
          .post("/api/products")
          .set("Authorization", `Bearer ${testAccessToken}`)
          .send(productPayload);

        expect(statusCode).toBe(201);
        expect(body).toEqual({
          __v: 0,
          _id: expect.any(String),
          createdAt: expect.any(String),
          description:
            "Designed for first-time DSLR owners who want impressive results straight out of the box, capture those magic moments no matter your level with the EOS 1500D. With easy to use automatic shooting modes, large 24.1 MP sensor, Canon Camera Connect app integration and built-in feature guide, EOS 1500D is always ready to go.",
          image: "https://i.imgur.com/QlRphfQ.jpg",
          price: "879.99",
          productId: expect.any(String),
          title: "Canon EOS 1500D DSLR Camera with 18-55mm Lens",
          updatedAt: expect.any(String),
          user: productPayload.user,
        });
      });
    });
  });
});
