import Joi from "joi";

export const envValidationSchema = Joi.object({
  TWELVEDATA_API_KEY: Joi.string().required(),
  DATABASE_URL:      Joi.string().uri().required(),
  REDIS_URL:         Joi.string().uri().required(),
  PORT:              Joi.number().default(3000),
  NODE_ENV:          Joi.string().valid('development','production','test').default('development'),
});