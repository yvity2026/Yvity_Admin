import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET_KEY || "sgfhgmjhngbfdsfgnfmjdfgb54654984984ty98j4ty9nt";

export function verifyJwt(token) {
  try {
    return jwt.verify(token, JWT_SECRET, {
      algorithms: ["HS256"],
    });
  } catch (err) {
    return null; // invalid or expired token
  }
}