const express = require("express");

const bodyParser = require("body-parser");
const cors = require("cors");
const expressJwt = require("express-jwt");
const jwt = require("jsonwebtoken");
const db = require("./db");

const jwtSecret = Buffer.from("Zn8Q5tyZ/G1MHltc4F/gTkVJMlrbKiZt", "base64");

const { ApolloServer } = require("apollo-server-express");
const {
  createRateLimitDirective,
  createRateLimitTypeDef,
} = require("graphql-rate-limit-directive");

const typeDefs = require("./schema.js");
const resolvers = require("./resolvers.js");
const keyGenerator = require("./keyGenerator.js");

const port = 4000;

const context = ({ req }) => ({ ip: req.ip, user: req.user });

const server = new ApolloServer({
  typeDefs: [createRateLimitTypeDef(), typeDefs],
  resolvers,
  // IMPORTANT: Build GraphQL context from request data (like userId and/or ip)
  context,
  schemaDirectives: {
    rateLimit: createRateLimitDirective({
      keyGenerator,
    }),
  },
});

const app = express();

app.use(
  cors(),
  bodyParser.json(),
  expressJwt({
    secret: jwtSecret,
    algorithms: ["HS256"],
    credentialsRequired: false,
  })
);

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = db.users.list().find(user => user.email === email);
  if (!(user && user.password === password)) {
    res.sendStatus(401);
    return;
  }
  const token = jwt.sign({ sub: user.id }, jwtSecret);
  res.send({ token });
});

server.applyMiddleware({ app, path: "/graphql" });

app.listen(port, () => console.info(`Server started on port ${port}`));
