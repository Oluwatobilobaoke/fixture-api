import express from 'express';
import {
  sessionAuth,
  authenticateAndisAdmin,
} from '../../../middleware/authorize-user';
import { FixturesController } from '../controllers/fixtures.controller';
import { fixturesValidator } from '../validators';
import userRateLimiter from '../../../middleware/limiter';
const router = express();

router.post(
  '/',
  authenticateAndisAdmin,userRateLimiter,
  fixturesValidator.verifyBody,
  FixturesController.addFixture,
);

router.get(
  '/',
  sessionAuth,userRateLimiter,
  fixturesValidator.verifyFixtureQuery,
  FixturesController.getFixtures,
);

router.get(
  '/:id',
  sessionAuth,userRateLimiter,
  fixturesValidator.verifyFixtureParams,
  FixturesController.getFixture,
);

router.patch(
  '/:id',
  authenticateAndisAdmin,userRateLimiter,
  fixturesValidator.verifyFixtureParamsAndBody,
  FixturesController.editFixture,
);

router.delete(
  '/:id',
  authenticateAndisAdmin,userRateLimiter,
  fixturesValidator.verifyFixtureParams,
  FixturesController.deleteFixture,
);

export const FixtureRoutes = router;
