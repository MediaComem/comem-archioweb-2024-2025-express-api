import User from "../models/user.js"
import jwt from "jsonwebtoken"
import { promisify } from "util";
import { secret } from "../config.js";

const signJwt = promisify(jwt.sign);

// ...
export function generateValidJwt(user) {
  // Generate a valid JWT which expires in 7 days.
  const exp = (new Date().getTime() + 7 * 24 * 3600 * 1000) / 1000;
  const claims = { sub: user._id.toString(), exp: exp };
  return signJwt(claims, secret);
}

export const cleanUpDatabase = async function() {
  await Promise.all([
    User.deleteMany()
  ]);
};