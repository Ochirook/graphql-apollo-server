const { defaultKeyGenerator } = require("graphql-rate-limit-directive");

const keyGenerator = (directiveArgs, obj, args, context, info) => {
  `${context.ip}:${defaultKeyGenerator(
    directiveArgs,
    obj,
    args,
    context,
    info
  )}`;
  console.log("hello" + context.ip); // handsan hereglegchdiin ip-g hewlene
  //   console.log(context.token);
};

module.exports = keyGenerator;
