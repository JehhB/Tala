export type Note = {
  id: string;
  category_id: string;
  title: string;
  filename: string;
  content: string;
};

export type Link = {
  id: string;
  noteID: string;
  referenceID: string;
};

export type Category = { id: string; name: string; index: number };

export type Constellation = {
  id: string;
  categories: Category[];
  notes: {
    id: string;
    category_id: string;
    title: string;
    description?: string;
  }[];
  links: Link[];
};

export type User = {
  id: string;
  picture: string;
  constellations: Constellation[];
};
