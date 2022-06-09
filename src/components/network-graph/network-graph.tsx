import { FunctionComponent, useRef, useEffect } from "react";
import * as d3 from "d3";

import { RGBA, cssColor, mulberry32 as rng } from "../../utils";

type NetworkGraphProp = {
  nodes: { label: string; color: RGBA; description?: string }[];
  links: { from: number; to: number }[];
};

export const NetworkGraph: FunctionComponent<NetworkGraphProp> = function ({
  nodes,
  links,
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const SPREAD = 20;
  const RAND_SEED = 19;

  useEffect(
    function () {
      if (!svgRef.current) return;

      const svg = d3.select(svgRef.current);
      const rand = rng(RAND_SEED);

      svg
        .selectAll("circle")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("fill", (node) => cssColor(node.color))
        .attr("r", "0.75em")
        .attr("stroke", "#000000")
        .attr("stroke-width", "1px")
        .attr("cx", () => rand() * SPREAD - SPREAD / 2 + "em")
        .attr("cy", () => rand() * SPREAD - SPREAD / 2 + "em");
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
