import { random, lorem } from "faker";
import { Constellation, Category, Link } from "../src/utils";

export const generate_constellation = function (): Constellation {
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

  const randomNoteRef = () =>
    Math.min(
      Math.floor(Math.random() * MOCK_NOTES_COUNT),
      MOCK_NOTES_COUNT - 2
    );

  const links: Link[] = Array(MOCK_LINKS_COUNT)
    .fill(null)
    .map((_) => ({
      id: random.alphaNumeric(64),
      noteID: notes[randomNoteRef()].id,
      referenceID: notes[randomNoteRef()].id,
    }));

  return {
    id: random.alphaNumeric(64),
    categories: categories,
    notes: notes,
    links: links,
  };
};
