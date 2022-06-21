import { FunctionComponent } from "react";

type NetworkLinkProps = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

export const NetworkLink: FunctionComponent<NetworkLinkProps> = function (
  props
) {
  return <line {...props} stroke="#aaa" />;
};
