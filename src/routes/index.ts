import { AuthRoutes } from '../modules/auth/routes/auth.route';
import { UsersRoutes } from '../modules/users/routes/users.route';
import { TeamRoutes } from '../modules/teams/routes/teams.route';
import { FixtureRoutes } from '../modules/fixtures/routes/fixtures.route';

const routes = [
  {
    path: '/auth',
    router: AuthRoutes,
  },
  {
    path: '/users',
    router: UsersRoutes,
  },
  {
    path: '/teams',
    router: TeamRoutes,
  },
  {
    path: '/fixtures',
    router: FixtureRoutes,
  },
];

const prefix = '/api/v1';

export const appRoutes = (app: any) =>
  routes.map((route) => app.use(prefix + route.path, route.router));
