import express from 'express';
import {
  sessionAuth,
  authenticateAndisAdmin,
} from '../../../middleware/authorize-user';
import { teamsValidator } from '../validators';
import { TeamsController } from '../controllers/teams.controller';
import userRateLimiter from '../../../middleware/limiter';

const router = express();

router.post(
  '/',
  authenticateAndisAdmin, userRateLimiter,
  teamsValidator.verifyBody,
  TeamsController.addTeam,
);

router.get(
  '/',
  sessionAuth, userRateLimiter,
  teamsValidator.verifyTeamQuery,
  TeamsController.getTeams,
);

router.get(
  '/:id',
  sessionAuth,userRateLimiter,
  teamsValidator.verifyTeamParams,
  TeamsController.getTeam,
);

router.patch(
  '/:id',
  authenticateAndisAdmin,userRateLimiter,
  teamsValidator.verifyProductParamsAndBody,
  TeamsController.editTeam,
);

router.delete(
  '/:id',
  authenticateAndisAdmin, userRateLimiter,
  teamsValidator.verifyTeamParams,
  TeamsController.deleteTeam,
);

export const TeamRoutes = router;
