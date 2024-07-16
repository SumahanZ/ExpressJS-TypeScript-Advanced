import { object, string, TypeOf } from "zod";

//the passed in request payload must be in an object form, if it comes from body, it must be object and have properties of name which has to be a string, etc
export const createUserInputSchema = object({
  body: object({
    name: string({
      required_error: "Name is required",
    }),
    password: string({
      required_error: "Password is required",
    }).min(6, "Password too short -  should be 6 chars minimum"),
    passwordConfirmation: string({
      required_error: "Password confirmation is required",
    }),
    email: string({
      required_error: "Email is required",
    }).email("Not a valid email"),
    //add custom validator for example if the data.password and the data.passwordconfirmation doesnt match
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  }),
});

//CREATE TYPE SO THE REQUEST BODY KNOW WHAT TYPE IT SHOULD EXPECT
//Zod will give the automatic typing of the object for the body passing in
export type CreateUserInput = Omit<
  TypeOf<typeof createUserInputSchema>,
  //emit body.passwordConfirmation from the Type
  "body.passwordConfirmation"
>;
