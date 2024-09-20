import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test'),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(3306),
  DB_DATABASE: Joi.string().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().allow(null, ''),
  PORT: Joi.number().default(3000),
});
