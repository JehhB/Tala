import { createContext } from "react";
import { FetchResult } from "react-fetch-hook";

import { Constellation } from "../utils";

export const ConstellationContext = createContext<FetchResult<Constellation>>({
  isLoading: true,
});
