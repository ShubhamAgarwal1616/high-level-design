// src/Tree.tsx
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface TreeNode {
  value: string;
  left: TreeNode | null;
  right: TreeNode | null;
}

interface Props {
  treeData: TreeNode | null;
}

const Tree: React.FC<Props> = ({ treeData }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!treeData || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous render

    const width = 800;
    const height = 400;

    const root = d3.hierarchy(treeData, d => {
      const children = [];
      if (d.left) children.push(d.left);
      if (d.right) children.push(d.right);
      return children;
    });

    const treeLayout = d3.tree<TreeNode>().size([width, height - 100]);
    const nodes = treeLayout(root);

    const g = svg
      .append('g')
      .attr('transform', 'translate(40,40)');

    // Draw links
    g.selectAll('.link')
      .data(nodes.links())
      .enter()
      .append('line')
      .attr('class', 'link')
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y)
      .attr('stroke', '#ccc');

    // Draw nodes
    const node = g.selectAll('.node')
      .data(nodes.descendants())
      .enter()
      .append('g')
      .attr('transform', d => `translate(${d.x},${d.y})`);

    node.append('circle')
      .attr('r', 20)
      .attr('fill', 'red');

    node.append('text')
      .text(d => `${d.data.value} - ${d.data.key}`)
      .attr('dy', 5)
      .attr('text-anchor', 'middle')
      .attr('fill', 'white');

  }, [treeData]);

  return (
    <svg ref={svgRef} width={900} height={450}></svg>
  );
};

export default Tree;
