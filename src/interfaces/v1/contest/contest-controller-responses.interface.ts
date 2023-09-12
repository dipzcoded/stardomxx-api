import { Contest, Contestant } from "@prisma/client";
import { ResponseStatusSignalEnum } from "../../../enums/v1";

export interface GetAllContest {
  status: ResponseStatusSignalEnum;
  resultLength: number;
  payload: Contest[];
}

export interface updateAndCreateContest {
  status: ResponseStatusSignalEnum;
  payload: Contest;
}

export interface deleteAndRemoveContest {
  status: ResponseStatusSignalEnum;
  payload: string;
}

export interface joinContest {
  status: ResponseStatusSignalEnum;
  payload: Contestant;
}
