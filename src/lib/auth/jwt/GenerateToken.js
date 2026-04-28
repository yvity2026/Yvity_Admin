import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET_KEY || "sgfhgmjhngbfdsfgnfmjdfgb54654984984ty98j4ty9nt";

export function generateToken(payload, expiresIn) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: expiresIn,
    algorithm : "HS256"
  });
}