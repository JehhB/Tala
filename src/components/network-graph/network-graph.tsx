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

      svg.attr("width", "100%").attr("height", "100%");

      svg
        .selectAll("circle")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("fill", (node) => cssColor(node.color))
        .attr("r", "0.5em");
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

  return <svg ref={svgRef} xmlns="http://www.w3.org/2000/svg"></svg>;
};
