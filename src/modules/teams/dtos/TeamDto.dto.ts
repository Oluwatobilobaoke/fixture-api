export class CreateTeamDto {
  name!: string;
  city!: string;
  nickname?: string;
  description?: string;
}

export class UpdateTeamDto {
  name?: string;
  city?: string;
  nickname?: string;
  description?: string;
}
