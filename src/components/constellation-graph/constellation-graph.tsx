import { FunctionComponent, useContext } from "react";

import { NetworkGraph } from "../network-graph";
import { ConstellationContext } from "../../contexts";
import { RGBA, colorPalletGradient, rgb, toValidTitle } from "../../utils";

export const ConstellationGraph: FunctionComponent<{}> = function () {
  const constellation = useContext(ConstellationContext);
  if (constellation.isLoading || constellation.error) return null;

  const { notes, links, categories } = constellation.data!;

  const getCategoryColor = (id: string) => {
    if (categories.length === 0) return rgb(255, 0, 0);

    const category = categories.find((category) => category.id === id);
    if (category === undefined) return null;

    return (
      colorPalletGradient((category.index + 1) / categories.length) ?? null
    );
  };

  return (
    <NetworkGraph
      nodes={notes
        .map((note) => ({
          id: note.id,
          label: note.title,
          description: note.description,
          color: getCategoryColor(note.category_id),
          to: toValidTitle(note.title),
        }))
        .filter(
          (
            node
          ): node is {
            id: string;
            label: string;
            description: string | undefined;
            color: RGBA;
            to: string;
          } => node.color !== null
        )}
      links={links.map((link) => ({
        source: link.noteID,
        target: link.referenceID,
      }))}
    />
  );
};
