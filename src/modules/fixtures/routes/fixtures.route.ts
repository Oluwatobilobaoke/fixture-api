import express from 'express';
import {
  authenticate,
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
  authenticate,
  fixturesValidator.verifyFixtureQuery,
  FixturesController.getFixtures,
);

router.get(
  '/:id',
  authenticate,
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
