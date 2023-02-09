const jwt = require("jsonwebtoken");
const jwt_Secret = "iamagoodboy";

const fetchuser = (req, res, next) => {
  //Get the user from the jwt and add it to the req object
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ error: "Please authenticate using valid token" });
  }
  try {
    const data = jwt.verify(token, jwt_Secret);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Please authenticate using valid token" });
  }
};
module.exports = fetchuser;
