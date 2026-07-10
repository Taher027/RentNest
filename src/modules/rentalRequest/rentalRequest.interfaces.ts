import { RequestStatus } from "../../../prisma/generated/prisma/enums";

export type TRentalRequest = {
  propertyId: string;
  moveInDate: Date;
  moveOutDate: Date;
  status?: RequestStatus;
  message?: string;
};
