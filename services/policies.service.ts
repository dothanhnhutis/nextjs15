import envs from "@/configs/envs";
import { FetchApi } from "./fetch-api";
import { Policy } from "@/schema/policy.schema";

const policyInstance = new FetchApi({
  baseUrl: envs.NEXT_PUBLIC_SERVER_URL + "/api/v1/policies",
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export async function getPoliciesService(options?: Omit<RequestInit, "body">) {
  try {
    const { data } = await policyInstance.get<Policy[]>("/me", options);
    return data;
  } catch (error: unknown) {
    console.log("getPoliciesService method error: ", error);
    return [];
  }
}
