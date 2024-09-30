import express from 'express';
import {
  sessionAuth,
  authenticateAndisAdmin,
} from '../../../middleware/authorize-user';
import { FixturesController } from '../controllers/fixtures.controller';
import { fixturesValidator } from '../validators';
const router = express();

router.post(
  '/',
  authenticateAndisAdmin,
  fixturesValidator.verifyBody,
  FixturesController.addFixture,
);

router.get(
  '/',
  sessionAuth,
  fixturesValidator.verifyFixtureQuery,
  FixturesController.getFixtures,
);

router.get(
  '/:id',
  sessionAuth,
  fixturesValidator.verifyFixtureParams,
  FixturesController.getFixture,
);

router.patch(
  '/:id',
  authenticateAndisAdmin,
  fixturesValidator.verifyFixtureParamsAndBody,
  FixturesController.editFixture,
);

router.delete(
  '/:id',
  authenticateAndisAdmin,
  fixturesValidator.verifyFixtureParams,
  FixturesController.deleteFixture,
);

export const FixtureRoutes = router;
