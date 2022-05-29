import { MockMethod } from "vite-plugin-mock";
import { random, lorem } from "faker";
import { Constellation } from "../src/types";

export default [
  {
    url: "/api/constellation",
    method: "get",
    statusCode: 200,
    response: {
      id: random.alphaNumeric(64),
      categories: [
        { id: random.alphaNumeric(64), name: random.words(), index: 1 },
      ],
      notes: [
        {
          id: random.alphaNumeric(64),
          title: random.words(),
          description: lorem.paragraphs(1),
        },
      ],
      links: [
        {
          id: random.alphaNumeric(64),
          noteID: random.alphaNumeric(64),
          referenceID: random.alphaNumeric(64),
        },
      ],
    } as Constellation,
  },
] as MockMethod[];
