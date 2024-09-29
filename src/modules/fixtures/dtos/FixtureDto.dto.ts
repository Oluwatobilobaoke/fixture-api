export class CreateFixtureDto {
  homeTeam!: string;
  awayTeam!: string;
  date!: string;
}

export class UpdateFixtureDto {
  date?: string;
  homeResult?: string;
  awayResult?: string;
  status?: 'pending' | 'completed';
}
