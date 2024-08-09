import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

export const authRequired = (req, res, next) => {
  const { token } = req.cookies;
  console.log(req.cookies);
  if (!token)
    return res.status(401).json({ message: "Unauthorized, no token provided" });

  jwt.verify(token, TOKEN_SECRET, (err, user) => {
    if (err)
      return res
        .status(403)
        .json({ message: "Unauthorized, invalid token provided" });

    req.user = user;

    next();
  });
};
