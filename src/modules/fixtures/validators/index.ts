import Joi from 'joi';
import { celebrate, Segments } from 'celebrate';

export const fixturesValidator = {
  verifyBody: celebrate({
    [Segments.BODY]: Joi.object({
      homeTeam: Joi.string().required(),
      awayTeam: Joi.string().required(),
      date: Joi.string().required(),
    }),
  }),
  verifyFixtureParams: celebrate({
    [Segments.PARAMS]: Joi.object({
      id: Joi.string().required(),
    }),
  }),
  verifyFixtureQuery: celebrate({
    [Segments.QUERY]: Joi.object({
      search: Joi.string().optional(),
      skip: Joi.string().optional(),
      limit: Joi.string().optional(),
    }),
  }),
  verifyFixtureParamsAndBody: celebrate({
    [Segments.PARAMS]: Joi.object({
      id: Joi.string().required(),
    }),
    [Segments.BODY]: Joi.object({
      homeTeam: Joi.string().optional(),
      awayTeam: Joi.string().optional(),
      date: Joi.string().optional(),
      result: Joi.string().optional(),
      homeResult: Joi.string().optional(),
      awayResult: Joi.string().optional(),
      status: Joi.string().optional(),
    }),
  }),
}