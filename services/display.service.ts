import envs from "@/configs/envs";
import { FetchApi } from "./fetch-api";
import { CreateDisplay } from "@/schema/display.schema";

const displayInstance = new FetchApi({
  baseUrl: envs.NEXT_PUBLIC_SERVER_URL + "/api/v1",
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
export type Display = {
  id: string;
  content: string;
  enable: boolean;
  priority: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
};
export const createdDisplayService = async (
  data: CreateDisplay,
  options?: Omit<RequestInit, "body">
) => {
  await displayInstance.post("/displays", data, options);
};

export const getDisplaysService = async (
  options?: Omit<RequestInit, "body">
) => {
  return await displayInstance.get<Display[]>("/displays", options);
};
