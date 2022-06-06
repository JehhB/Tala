import { MockMethod } from "vite-plugin-mock";
import { generate_constellation } from "./constellation";
import { generate_notes_from_constellation } from "./notes";

const generate_mock = function (): MockMethod[] {
  const constellation = generate_constellation();
  const notes: MockMethod[] = generate_notes_from_constellation(
    constellation
  ).map((response) => ({
    url: `/api/v1/:userName/:constellation/${response.filename}`,
    method: "get",
    statusCode: 200,
    response: response,
  }));

  return [
    {
      url: "/api/v1/:userName/:constellation",
      method: "get",
      statusCode: 200,
      response: constellation,
    },
    ...notes,
    {
      url: "/api/v1/:userName/:constellation/:note",
      method: "get",
      statusCode: 404,
    },
  ];
};

export default generate_mock();
