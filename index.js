const { ApolloServer, gql } = require("apollo-server");
const {
  createRateLimitDirective,
  createRateLimitTypeDef,
  defaultKeyGenerator,
} = require("graphql-rate-limit-directive");

const typeDefs = require("./schema.js");
const resolvers = require("./resolvers.js");
const keyGenerator = require("./keyGenerator.js");

/*const typeDefs = gql`
  # Apply default rate limiting to all fields of 'Query'
  #Нэг хүсэлт per нэг секунд
  type Query @rateLimit(limit: 10, duration: 10) {
    books: [Book!]

    # Override behaviour imposed from 'Query' object on this field to have a custom limit
    quote: String @rateLimit(limit: 1)
  }

  type Book {
    # For each 'Book' where this field is requested, rate limit
    title: String @rateLimit(limit: 72000, duration: 3600)

    # No limits are applied
    author: String
  }
`; */

const server = new ApolloServer({
  typeDefs: [createRateLimitTypeDef(), typeDefs],
  resolvers,
  // IMPORTANT: Build GraphQL context from request data (like userId and/or ip)
  context: ({ req }) => ({
    // See https://expressjs.com/en/api.html#req.ip
    ip: req.ip, // Express uses IPv6 by default
    token: req.headers.token,
  }),
  schemaDirectives: {
    rateLimit: createRateLimitDirective({
      keyGenerator,
    }),
  },
});

server
  .listen()
  .then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  })
  .catch(error => {
    console.error(error);
  });
