export class CreateFixtureDto {
  homeTeam!: string;
  awayTeam!: string;
  date!: string;
}

export class UpdateFixtureDto {
  homeTeam?: string;
  awayTeam?: string;
  date?: string;
  result?: string;
  homeResult?: string;
  awayResult?: string;
  status?: 'pending' | 'completed';
}
