import { FunctionComponent } from "react";

import { RGBA, colorID } from "../../utils";

type NetworkLinkProps = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  c1: RGBA;
  c2: RGBA;
};

const LINK_THICKEST = 5;
const LINK_THINNEST = 1;

export const NetworkLink: FunctionComponent<NetworkLinkProps> = function (
  props
) {
  const { x1, y1, c1, x2, y2, c2 } = props;

  const dx = x1 - x2;
  const dy = y1 - y2;
  const r = Math.sqrt(dx * dx + dy * dy);
  const theta = (Math.atan2(dy, dx) * 180) / Math.PI + 180;
  const c = colorID(c1) + colorID(c2);

  return (
    <polygon
      points={`${x1},${y1 + LINK_THICKEST / 2} 
${x1},${y1 - LINK_THICKEST / 2} 
${x1 + r},${y1 - LINK_THINNEST / 2} 
${x1 + r},${y1 + LINK_THINNEST / 2}`}
      transform-origin="left"
      transform={`rotate(${theta})`}
      fill={`url(#${c})`}
    />
  );
};
