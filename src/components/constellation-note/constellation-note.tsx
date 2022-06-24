import { FunctionComponent, useContext } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHightlight from "rehype-highlight";
import rehypeSanitize from "rehype-sanitize";
import rehypeSlug from "rehype-slug";
import useFetch from "react-fetch-hook";

import { NoteContainer } from "../note-container";
import { Note } from "../../utils";
import { ConstellationContext } from "../../contexts";

import "highlight.js/styles/googlecode.css";

export const ConstellationNote: FunctionComponent<{}> = function () {
  const { userName, constellationName, noteName } = useParams();
  const note = useFetch<Note>(
    `/api/v1/${userName}/${constellationName}/${noteName}`
  );
  const constellation = useContext(ConstellationContext);

  if (!constellation.data) return null;
  const categories = constellation.data.categories;

  const level =
    (categories.find(
      (category) => note.data && category.id === note.data.category_id
    )?.index ?? -1) + 1;

  if (note.error) {
    return (
      <NoteContainer title="error">
        <h1 style={{ color: "red" }}>note.error.message</h1>
      </NoteContainer>
    );
  } else if (!note.isLoading && note.data) {
    return (
      <>
        <Helmet>
          <title>{note.data.title}</title>
          <meta
            name="description"
            content={
              constellation.data.notes.find((n) => n.id === note.data!.id)
                ?.description ?? ""
            }
          />
        </Helmet>
        <NoteContainer
          title={note.data.title}
          color_percent={level / categories.length}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeSlug, rehypeSanitize, rehypeHightlight]}
          >
            {note.data.content}
          </ReactMarkdown>
        </NoteContainer>
      </>
    );
  } else {
    return null;
  }
};
