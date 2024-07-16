import jwt from "jsonwebtoken";
import {
  privateKey as storedPrivateKey,
  publicKey as storedPublicKey,
} from "../config/keys";

const privateKey = storedPrivateKey;
const publicKey = storedPublicKey;

//signing JWT (sign JWT with a private key)
//JWT Payload
export function signJWT(payload: Object, options?: jwt.SignOptions) {
  //sign our payload
  if (!options) return;
  return jwt.sign(payload, privateKey, {
    ...options,
    //allows to use privateKey and publicKey for signing JWT
    algorithm: "RS256",
  });
}
//verifying JWT (verify JWT with a private key)
export function verifyJWT(token: string) {
  try {
    //wrap in try and catch because the verify function can throw
    const decodedToken = jwt.verify(token, publicKey);
    //if can be decoded

    console.log(decodedToken);
    return {
      valid: true,
      expired: false,
      decodedToken,
    };
  } catch (err: any) {
    //if token can't be verified we will return this object
    return {
      valid: false,
      expired: err.message === "jwt expired",
      decodedToken: null,
    };
  }
}
