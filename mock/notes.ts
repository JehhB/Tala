import { Constellation, Note, toValidTitle } from "../src/utils";

export const generate_notes_from_constellation = function (
  constellation: Constellation
): Note[] {
  const generateContent = (title: string, description: string) => `# ${title}

${description}

## H2
### H3
#### H4
##### H5
###### H6
`;

  return constellation.notes.map(({ id, title, description, category_id }) => ({
    ...{ id, title, category_id },
    filename: toValidTitle(title),
    category_id: category_id,
    content: generateContent(title, description),
  }));
};
