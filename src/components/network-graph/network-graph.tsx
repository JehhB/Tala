import { FunctionComponent, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as d3 from "d3";
import {
  SimulationNodeDatum,
  SimulationLinkDatum,
  Simulation,
  DragBehavior,
  SubjectPosition,
} from "d3";

import { RGBA, cssColor } from "../../utils";

import "./network-graph.css";

const NODE_RADIUS = 8;
const NODE_REPULSION = 190;
const NODE_MARGIN = 1.5;
const NODE_GRAVITY = 0.05;
const LINK_LENGHT = 100;

export interface Node extends SimulationNodeDatum {
  id: string;
  label: string;
  to: string;
  color: RGBA;
  degree?: number;
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

const centerFree = ({ degree }: Node) =>
  degree && degree > 0 ? 0 : NODE_GRAVITY;

export const NetworkGraph: FunctionComponent<NetworkGraphProp> = function (
  props
) {
  const navigate = useNavigate();
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
        .force(
          "charge",
          d3.forceManyBody<Node>().strength(({ degree }) => -NODE_REPULSION)
        )
        .force("center", d3.forceCenter())
        .force("colide", d3.forceCollide(NODE_RADIUS * NODE_MARGIN))
        .force("forceX", d3.forceX<Node>().strength(centerFree))
        .force("forceY", d3.forceY<Node>().strength(centerFree))
        .on("tick", ticked);

      const linkGroup = svg.append("g").attr("class", "links");
      const link = linkGroup
        .selectAll("line")
        .data(links)
        .enter()
        .append("line")
        .attr("class", "link")
        .style("stroke", "#aaa");

      const nodeGroup = svg.append("g").attr("class", "nodes");
      const node = nodeGroup
        .selectAll("circle")
        .data(nodes)
        .enter()
        .append("g")
        .attr("class", "node")
        .call(drag(simulation));

      const circle = node
        .append("circle")
        .on("click", (_, d) => {
          navigate(d.to);
        })
        .attr("fill", (node) => cssColor(node.color))
        .attr("r", NODE_RADIUS)
        .attr("stroke", "#000000");

      const label = node
        .append("text")
        .text(({ label }) => label)
        .attr("text-anchor", "middle")
        .attr("y", 3 * NODE_RADIUS);

      function ticked() {
        link
          .attr("x1", (d) => d.source.x!)
          .attr("y1", (d) => d.source.y!)
          .attr("x2", (d) => d.target.x!)
          .attr("y2", (d) => d.target.y!);

        node.attr("transform", ({ x, y }) => `translate(${x},${y})`);
      }

      return () => {
        nodeGroup.remove();
        linkGroup.remove();
      };
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
