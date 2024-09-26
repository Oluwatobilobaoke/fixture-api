import Joi from 'joi';
import { celebrate, Segments } from 'celebrate';

export const teamsValidator = {
  verifyBody: celebrate({
    [Segments.BODY]: Joi.object({
      name: Joi.string().required(),
      city: Joi.string().required(),
      description: Joi.string().optional(),
      nickname: Joi.string().optional(),
    }),
  }),
  verifyTeamParams: celebrate({
    [Segments.PARAMS]: Joi.object({
      id: Joi.string().required(),
    }),
  }),
  verifyTeamQuery: celebrate({
    [Segments.QUERY]: Joi.object({
      search: Joi.string().optional(),
      skip: Joi.string().optional(),
      limit: Joi.string().optional(),
    }),
  }),
  verifyProductParamsAndBody: celebrate({
    [Segments.PARAMS]: Joi.object({
      id: Joi.string().required(),
    }),
    [Segments.BODY]: Joi.object({
      name: Joi.string().optional(),
      city: Joi.string().optional(),
      description: Joi.string().optional(),
      nickname: Joi.string().optional(),
    }),
  }),
};
