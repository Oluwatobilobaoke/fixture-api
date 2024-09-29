export type LoginUserType = {
  email: string;
  password: string;
};

export type RegisterUserType = {
  name: string;
  email: string;
  username?: string;
  password: string;
};

export type CreateTeamType = {
  name: string;
  city: string;
  nickname?: string;
  description?: string;
};

export type UpdateTeamType = {
  name?: string;
  city?: string;
  nickname?: string;
  description?: string;
};

export type CreateFixtureType = {
  homeTeam: string;
  awayTeam: string;
  date: string;
};

export type UpdateFixtureType = {
  homeTeam?: string;
  awayTeam?: string;
  date?: string;
  result?: string;
  homeResult?: string;
  awayResult?: string;
  status?: 'pending' | 'completed';
};
