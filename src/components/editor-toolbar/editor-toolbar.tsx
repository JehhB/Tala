import { FunctionComponent, Dispatch, SetStateAction } from "react";
import { faFloppyDisk, faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./editor-toolbar.css";

type EditorToolbarProps = {
  isEditing: boolean;
  setEditing: Dispatch<SetStateAction<boolean>>;
  isPreview: boolean;
  setPreview: Dispatch<SetStateAction<boolean>>;
};

export const EditorToolbar: FunctionComponent<EditorToolbarProps> = function ({
  isEditing,
  setEditing,
  isPreview,
  setPreview,
}) {
  const togglePreview = () => setPreview((preview) => !preview);

  if (!isEditing)
    return (
      <div className="editor-toolbar">
        <button
          className="editor-toolbar__button"
          onClick={() => setEditing(true)}
        >
          <FontAwesomeIcon
            className="editor-toolbar__button__icon"
            icon={faPen}
          />
        </button>
      </div>
    );

  return (
    <div className="editor-toolbar">
      <div className="editor-toolbar__toggle">
        <button
          className="editor-toolbar__toggle__button"
          disabled={!isPreview}
          onClick={() => setPreview(false)}
        >
          Raw
        </button>
        <button
          className="editor-toolbar__toggle__button"
          disabled={isPreview}
          onClick={() => setPreview(true)}
        >
          Preview
        </button>
      </div>
      <button
        className="editor-toolbar__button"
        onClick={() => setEditing(false)}
      >
        <FontAwesomeIcon icon={faFloppyDisk} />
      </button>
    </div>
  );
};
