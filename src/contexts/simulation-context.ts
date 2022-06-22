import { createContext } from "react";
import { forceSimulation } from "d3";

export const SimulationContext = createContext(forceSimulation());
