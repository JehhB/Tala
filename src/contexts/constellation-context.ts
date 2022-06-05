import { createContext } from "react";

import { Constellation } from "../utils";

export const ConstellationContext = createContext<Constellation>({
  id: "",
  categories: [],
  notes: [],
  links: [],
});
