import { ContestantVote, ContestPostVote } from "@prisma/client";
import { ResponseStatusSignalEnum } from "../../../enums/v1";

export interface voteResponse {
  status: ResponseStatusSignalEnum;
  payload: ContestPostVote | ContestantVote | number;
}
