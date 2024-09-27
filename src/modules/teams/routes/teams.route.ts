import express from 'express';
import {
  authenticate,
  authenticateAndisAdmin,
} from '../../../middleware/authorize-user';
import { teamsValidator } from '../validators';
import { TeamsController } from '../controllers/teams.controller';

const router = express();

router.post(
  '/',
  authenticateAndisAdmin,
  teamsValidator.verifyBody,
  TeamsController.addTeam,
);

router.get(
  '/',
  authenticate,
  teamsValidator.verifyTeamQuery,
  TeamsController.getTeams,
);

router.get(
  '/:id',
  authenticate,
  teamsValidator.verifyTeamParams,
  TeamsController.getTeam,
);

router.patch(
  '/:id',
  authenticateAndisAdmin,
  teamsValidator.verifyProductParamsAndBody,
  TeamsController.editTeam,
);

router.delete(
  '/:id',
  authenticateAndisAdmin,
  teamsValidator.verifyTeamParams,
  TeamsController.deleteTeam,
);

export const TeamRoutes = router;
