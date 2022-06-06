import { FunctionComponent, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";

import { NoteContainer } from "../note-container";
import { Note } from "../../utils";
import { ConstellationContext } from "../../contexts";

export const ConstellationNote: FunctionComponent<{}> = function () {
  const [noteData, setNoteData] = useState<Note | null>(null);
  const { categories } = useContext(ConstellationContext);

  const { userName, constellationName, noteName } = useParams();

  useEffect(
    function () {
      fetch(`/api/v1/${userName}/${constellationName}/${noteName}`, {
        method: "GET",
      })
        .then((response) => response.json())
        .then((data) => setNoteData(data));
    },
    [userName, constellationName, noteName]
  );

  const level =
    (categories.find(
      (category) => noteData && category.id === noteData.category_id
    )?.index ?? -1) + 1;

  return (
    <NoteContainer
      title={noteData?.title ?? ""}
      color_percent={level / categories.length}
    >
      <ReactMarkdown>{noteData?.content ?? ""}</ReactMarkdown>
    </NoteContainer>
  );
};
