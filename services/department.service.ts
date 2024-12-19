import envs from "@/configs/envs";
import { FetchApi } from "./fetch-api";
import { Display } from "./display.service";

const departmentInstance = new FetchApi({
  baseUrl: envs.NEXT_PUBLIC_SERVER_URL + "/api/v1/departments",
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export type Department = {
  id: string;
  name: string;
  factoryId: string;
  createdAt: string;
  updatedAt: string;
};

export async function getDepartments(options?: Omit<RequestInit, "body">) {
  try {
    const { data } = await departmentInstance.get<Department[]>("", options);
    return data;
  } catch (error: unknown) {
    console.log(error);
    return [];
  }
}

export async function getDisplaysOfDepartment(displayId: string) {
  try {
    const { data } = await departmentInstance.get<Display[]>(
      `${displayId}/displays`
    );
    return data;
  } catch (error: unknown) {
    console.log(error);
    return [];
  }
}
