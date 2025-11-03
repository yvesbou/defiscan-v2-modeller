import { FunctionClassificationTable } from "@/lib/types";
import aaveV3 from "./aave-v3.json";
import spark from "./spark.json";
import compoundv3 from "./compoundv3.json";
import morpho from "./morpho.json";
import uniswapV3 from "./uniswap-v3.json";
import liquityV1 from "./liquity-v1.json";
import aerodrome from "./aerodrome.json";

export const DEFAULT_PROJECTS: FunctionClassificationTable[] = [
  {
    id: "1",
    title: aaveV3.title,
    entries: aaveV3.entries as any,
  },
  {
    id: "2",
    title: morpho.title,
    entries: morpho.entries as any,
  },
  {
    id: "3",
    title: uniswapV3.title,
    entries: uniswapV3.entries as any,
  },
  {
    id: "4",
    title: liquityV1.title,
    entries: liquityV1.entries as any,
  },
  {
    id: "5",
    title: aerodrome.title,
    entries: aerodrome.entries as any,
  },
];

export function getDefaultProjects(): FunctionClassificationTable[] {
  return DEFAULT_PROJECTS.map((project) => ({
    ...project,
    id: Date.now().toString() + Math.random().toString(),
    entries: project.entries.map((entry) => ({
      ...entry,
      id: Date.now().toString() + Math.random().toString(),
    })),
  }));
}
