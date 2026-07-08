export type IUser = {
  name: string;
  email: string;
  password: string;
  phone: string;
  nidNumber: string;
  role?: "TENANT" | "LANDLORD" | "ADMIN";
  avatar: string;
  isVerified: boolean;
  address: string;
};
