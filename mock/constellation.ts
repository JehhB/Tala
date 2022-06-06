import { MockMethod } from "vite-plugin-mock";
import { random, lorem } from "faker";
import { Constellation, Category, Link } from "../src/utils";

const generate_response = function (): Constellation {
  const MOCK_CATEGORIES_COUNT = 3;
  const MOCK_NOTES_COUNT = MOCK_CATEGORIES_COUNT * 5;
  const MOCK_LINKS_COUNT = 25;

  const categories: Category[] = Array(MOCK_CATEGORIES_COUNT)
    .fill(null)
    .map((_, i) => ({
      id: random.alphaNumeric(64),
      name: random.words(),
      index: i,
    }));

  const notes = Array(MOCK_NOTES_COUNT)
    .fill(null)
    .map((_, i) => ({
      id: random.alphaNumeric(64),
      title: random.words(),
      category_id: categories[i % MOCK_CATEGORIES_COUNT].id,
      description: lorem.paragraphs(1),
    }));

  const links: Link[] = Array(MOCK_LINKS_COUNT)
    .fill(null)
    .map((_) => ({
      id: random.alphaNumeric(64),
      noteID: notes[Math.floor(Math.random() * MOCK_NOTES_COUNT)].id,
      referenceID: notes[Math.floor(Math.random() * MOCK_NOTES_COUNT)].id,
    }));

  return {
    id: random.alphaNumeric(64),
    categories: categories,
    notes: notes,
    links: links,
  };
};

export default [
  {
    url: "/api/v1/:userName/:constellation",
    method: "get",
    statusCode: 200,
    response: generate_response(),
  },
] as MockMethod[];
