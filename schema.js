const { gql } = require("apollo-server");
const typeDefs = gql`
  type Query @rateLimit(limit: 2, duration: 10) {
    book(isbn: String!): Book
    movie(title: String!): Movie
  }

  type Book {
    isbn: String
    title: String
    author: [String]
    publishDate: String
    movie: Movie
  }

  type Movie {
    title: String
    year: Int
    rated: String
    awards: String
  }
`;
module.exports = typeDefs;
