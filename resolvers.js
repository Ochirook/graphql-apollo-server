const axios = require("axios");

const transformMovieResponse = movie => ({
  title: movie.Title,
  year: movie.Year,
  rated: movie.Rated,
  awards: movie.Awards,
});
const transformBookResponse = details => ({
  author: details.authors.map(author => author.name),
  isbn: details["isbn_13"],
  title: details.title,
  publishDate: details.publish_date,
});

const resolvers = {
  Query: {
    book(parent, args, context) {
      if (!context.user) {
        throw new Error("Unauthorized");
      }
      return axios
        .get(
          `https://openlibrary.org/api/books?bibkeys=ISBN:${args.isbn}&jscmd=details&format=json`
        )
        .then(
          res => transformBookResponse(res.data[`ISBN:${args.isbn}`].details)
          // console.log(context.token)
        )
        .catch(err => console.log(err));
    },
    movie(parent, args) {
      return axios
        .get(`http://www.omdbapi.com/?t=${args.title}&apikey=[yourApiKeyHere]`)
        .then(res => transformMovieResponse(res.data))
        .catch(err => console.log(err));
    },
  },
  Book: {
    movie: parent => {
      return axios
        .get(
          `http://www.omdbapi.com/?t=${parent.title}&apikey=[yourApiKeyHere]`
        )
        .then(res => transformMovieResponse(res.data))
        .catch(err => console.log(err));
    },
  },
};
module.exports = resolvers;
