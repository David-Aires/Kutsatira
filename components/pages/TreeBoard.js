import React from 'react';
import ReactFlow, { Controls } from 'reactflow';
import 'reactflow/dist/style.css';
import useFetch from 'hooks/useFetch';
import dagre from 'dagre';

export default function TreeBoard({ id }) {
  const connectionLineStyle = { stroke: '#fff' };
  const snapGrid = [20, 20];

  const defaultViewport = { x: 0, y: 0, zoom: 1.5 };
  const nodeWidth = 172;
  const nodeHeight = 36;
  const position = { x: 0, y: 0 };

  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const [websiteId] = id;
  const { data } = useFetch(`/websites/${websiteId}/links`, {});

  if (!data) {
    return null;
  }

  let initialEdges = [];
  let initialNodes = [];

  for (const element of data) {
    if (initialNodes.filter(e => e.id === element.from).length === 0) {
      initialNodes.push({
        id: element.from,
        sourcePosition: 'right',
        targetPosition: 'left',
        data: { label: element.from },
        position,
      });
    }

    if (initialNodes.filter(e => e.id === element.url).length === 0) {
      initialNodes.push({
        id: element.url,
        sourcePosition: 'right',
        targetPosition: 'left',
        data: { label: element.url },
        position,
      });
    }

    if (initialEdges.filter(e => e.id === element.from + '-' + element.url).length === 0) {
      initialEdges.push({
        id: element.from + '-' + element.url,
        source: element.from,
        target: element.url,
        label: element.pourcent + '%',
        animated: true,
        style: { stroke: '#fff' },
      });
    }
  }

  const getLayoutedElements = (nodes, edges) => {
    dagreGraph.setGraph({ rankdir: 'LR' });

    nodes.forEach(node => {
      dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach(edge => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    nodes.forEach(node => {
      const nodeWithPosition = dagreGraph.node(node.id);

      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      node.position = {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      };

      return node;
    });

    return { nodes, edges };
  };

  const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
    initialNodes,
    initialEdges,
  );

  return (
    <div style={{ height: 500 }}>
      <ReactFlow
        nodes={layoutedNodes}
        edges={layoutedEdges}
        style={{ background: '#0041d0' }}
        connectionLineStyle={connectionLineStyle}
        snapToGrid={true}
        snapGrid={snapGrid}
        defaultViewport={defaultViewport}
        fitView
        attributionPosition="bottom-left"
      >
        <Controls />
      </ReactFlow>
    </div>
  );
}
