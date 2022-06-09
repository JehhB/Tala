import { FunctionComponent, useRef, useEffect } from "react";
import * as d3 from "d3";

import { RGBA, cssColor } from "../../utils";

type NetworkGraphProp = {
  nodes: { label: string; color: RGBA; description?: string }[];
  links: { from: number; to: number }[];
};

export const NetworkGraph: FunctionComponent<NetworkGraphProp> = function ({
  nodes,
  links,
}) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(
    function () {
      if (!svgRef.current) return;
      const svg = d3.select(svgRef.current);
      const INIT_DIST = 5;

      svg
        .selectAll("circle")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("fill", (node) => cssColor(node.color))
        .attr("r", "0.75em")
        .attr("stroke", "#000000")
        .attr("stroke-width", "1px")
        .attr(
          "cx",
          (_, i) =>
            Math.cos((Math.PI * 2 * i) / nodes.length) * INIT_DIST + "em"
        )
        .attr(
          "cy",
          (_, i) =>
            Math.sin((Math.PI * 2 * i) / nodes.length) * INIT_DIST + "em"
        );
    },
    [nodes.length, links.length]
  );

  useEffect(
    function () {
      if (!svgRef.current) return;

      const svg = svgRef.current;
      const listener = () => {
        svg.removeAttribute("viewBox");

        const width = svg.clientWidth;
        const height = svg.clientHeight;
        svg.setAttribute(
          "viewBox",
          `${-width / 2} ${-height / 2} ${width} ${height}`
        );
      };

      listener();

      window.addEventListener("resize", listener);
      return () => window.removeEventListener("resize", listener);
    },
    [svgRef]
  );

  return (
    <svg
      width="100%"
      height="100%"
      ref={svgRef}
      xmlns="http://www.w3.org/2000/svg"
    ></svg>
  );
};
