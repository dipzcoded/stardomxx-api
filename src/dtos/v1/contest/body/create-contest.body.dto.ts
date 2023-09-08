export interface ContestBodyDto {
  name: string;
  prize: number;
  maxContestant: number;
  noFreeWildCards: number;
  category: string;
  startDate: Date;
  endDate: Date;
}
