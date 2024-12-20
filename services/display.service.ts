import envs from "@/configs/envs";
import { FetchApi } from "./fetch-api";
import { CreateDisplay } from "@/schema/display.schema";
import { Department } from "./department.service";

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
  departments: Department[];
};
export const createdDisplayService = async (
  data: CreateDisplay,
  options?: Omit<RequestInit, "body">
) => {
  await displayInstance.post("/displays", data, options);
};

export const updateDisplayService = async (
  displayId: string,
  data: CreateDisplay,
  options?: Omit<RequestInit, "body">
) => {
  await displayInstance.put("/displays/" + displayId, data, options);
};

export const getDisplaysService = async (
  options?: Omit<RequestInit, "body">
) => {
  return await displayInstance.get<Display[]>("/displays", options);
};

export const getDisplayByIdService = async (
  id: string,
  options?: Omit<RequestInit, "body">
) => {
  const { data } = await displayInstance.get<Display | null>(
    "/displays/" + id,
    options
  );
  return data;
};
