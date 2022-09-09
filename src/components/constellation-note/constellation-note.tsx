import { FunctionComponent, useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListUl } from "@fortawesome/free-solid-svg-icons";

import useFetch from "react-fetch-hook";

import { NoteContainer } from "../note-container";
import { Note } from "../../utils";
import { ConstellationContext } from "../../contexts";
import { MarkdownViewer } from "../markdown-viewer";
import { EditorToolbar } from "../editor-toolbar";

export const ConstellationNote: FunctionComponent<{}> = function () {
  const { userName, constellationName, noteName } = useParams();
  const [isEditing, setEditing] = useState<boolean>(false);
  const [isPreview, setPreview] = useState<boolean>(true);

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

  if (note.error)
    return (
      <NoteContainer title="error">
        <h1 style={{ color: "red" }}>note.error.message</h1>
      </NoteContainer>
    );

  if (note.isLoading || !note.data) return null;

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
        left_actions={<FontAwesomeIcon icon={faListUl} />}
        right_actions={
          <EditorToolbar
            {...{ isEditing, setEditing, isPreview, setPreview }}
          />
        }
      >
        <MarkdownViewer markdown={note.data.content} />
      </NoteContainer>
    </>
  );
};
