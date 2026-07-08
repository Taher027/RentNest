export type TProperties = {
  title: string;
  description: string;
  categoryId: string;
  street: string;
  city: string;
  price: number;
  bedRooms: number;
  status: "AVAILABLE" | "RENTED" | "UNAVAILABLE";
  areaSize: number;
  images?: string[];
};
