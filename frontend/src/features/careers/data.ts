import { coreApi, useCoreQuery } from "@/features/core/data";
export function useShortlist() {
  return useCoreQuery(["career-shortlist"], coreApi.careerShortlist);
}
