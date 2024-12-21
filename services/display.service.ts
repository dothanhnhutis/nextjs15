import envs from "@/configs/envs";
import { FetchApi } from "./fetch-api";
import { CreateDisplay, Display, UpdateDisplay } from "@/schema/display.schema";

const displayInstance = new FetchApi({
  baseUrl: envs.NEXT_PUBLIC_SERVER_URL + "/api/v1",
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const createdDisplayService = async (
  data: CreateDisplay,
  options?: Omit<RequestInit, "body">
) => {
  await displayInstance.post("/displays", data, options);
};

export const updateDisplayService = async (
  displayId: string,
  data: Partial<UpdateDisplay>,
  options?: Omit<RequestInit, "body">
) => {
  return await displayInstance.put<{ message: string }>(
    "/displays/" + displayId,
    data,
    options
  );
};

export const filterDisplaysService = async (
  searchParams: {
    [key: string]: string | string[] | undefined;
  },
  options?: Omit<RequestInit, "body">
) => {
  const data = [];
  for (const key in searchParams) {
    if (typeof searchParams[key] == "string") {
      data.push(`${key}=${searchParams[key]}`);
    } else if (Array.isArray(searchParams[key])) {
      for (const value of searchParams[key]) {
        data.push(`${key}=${value}`);
      }
    }
  }
  return await displayInstance.get<{ displays: Display[] }>(
    data.length > 0 ? "/displays?" + data.join("&") : "/displays",
    options
  );
};

export const getDisplaysService = async (
  options?: Omit<RequestInit, "body">
) => {
  return await displayInstance.get<{ displays: Display[] }>(
    "/displays",
    options
  );
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
