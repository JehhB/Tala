import { FunctionComponent, useRef, useEffect } from "react";
import * as d3 from "d3";
import {
  SimulationNodeDatum,
  SimulationLinkDatum,
  Simulation,
  DragBehavior,
  SubjectPosition,
} from "d3";

import { RGBA, cssColor } from "../../utils";

const NODE_RADIUS = 12;
const NODE_REPULSION = 60;
const NODE_MARGIN = 2.5;
const LINK_LENGHT = 100;
const NODE_GRAVITY = 0.005;

export interface Node extends SimulationNodeDatum {
  id: string;
  label: string;
  color: RGBA;
  description?: string;
}

export type Link = SimulationLinkDatum<Node>;

type NetworkGraphProp = {
  nodes: Node[];
  links: Link[];
};

const drag = function <
  NodeElement extends Element,
  NodeDatum extends SimulationNodeDatum
>(
  simulation: Simulation<NodeDatum, undefined>
): DragBehavior<NodeElement, NodeDatum, NodeDatum | SubjectPosition> {
  const dragstarted = (event: any, d: NodeDatum) => {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  };

  const dragged = (event: any, d: NodeDatum) => {
    d.fx = event.x;
    d.fy = event.y;
  };

  const dragended = (event: any, d: NodeDatum) => {
    if (!event.active) simulation.alphaTarget(0.0001);
    d.fx = null;
    d.fy = null;
  };

  return d3
    .drag<NodeElement, NodeDatum>()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);
};

export const NetworkGraph: FunctionComponent<NetworkGraphProp> = function (
  props
) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(
    function () {
      if (!svgRef.current) return;
      const svg = d3.select(svgRef.current);

      const nodes = d3.map(
        props.nodes,
        (node): Node => ({
          ...node,
        })
      );
      const links = d3
        .map(props.links, (link) => ({
          source: nodes.find((node) => node.id === link.source),
          target: nodes.find((node) => node.id === link.target),
        }))
        .filter(
          (link): link is { source: Node; target: Node } =>
            link.source !== undefined && link.target !== undefined
        );

      const simulation = d3
        .forceSimulation(nodes)
        .force(
          "link",
          d3
            .forceLink(links)
            .id((_, i) => nodes[i].id)
            .distance(LINK_LENGHT)
        )
        .force("charge", d3.forceManyBody().strength(-NODE_REPULSION))
        .force("center", d3.forceCenter())
        .force("forceX", d3.forceX().strength(NODE_GRAVITY))
        .force("forceY", d3.forceY().strength(NODE_GRAVITY))
        .force("colide", d3.forceCollide(NODE_RADIUS * NODE_MARGIN))
        .on("tick", ticked);

      const link = svg
        .selectAll("line")
        .data(links)
        .enter()
        .append("line")
        .style("stroke", "#aaa");

      const node = svg
        .selectAll("circle")
        .data(nodes)
        .enter()
        .append("circle")
        .call(drag<SVGCircleElement, Node>(simulation))
        .attr("fill", (node) => cssColor(node.color))
        .attr("r", NODE_RADIUS)
        .attr("stroke", "#000000")
        .attr("stroke-width", 1);

      function ticked() {
        link
          .attr("x1", (d) => d.source.x!)
          .attr("y1", (d) => d.source.y!)
          .attr("x2", (d) => d.target.x!)
          .attr("y2", (d) => d.target.y!);

        node.attr("cx", (d) => d.x!).attr("cy", (d) => d.y!);
      }
    },
    [props.nodes.length, props.links.length]
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
