const Joi = require("joi");

const quoteSchema = Joi.object({
  quote: Joi.string().required(),
  movie: Joi.string().required(),
  year: Joi.number(),
});

module.exports = { quoteSchema };