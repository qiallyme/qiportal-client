import React, { useMemo, useEffect, useState } from 'react';
import Fuse from 'fuse.js';

// React 19 compatible graph component using SVG
const GraphVisualization = ({ elements, onNodeClick }) => {
  const nodes = elements.filter(el => el.data && !el.data.source);
  const edges = elements.filter(el => el.data && el.data.source);

  const handleNodeClick = (nodeId) => {
    if (onNodeClick) onNodeClick(nodeId);
  };

  if (!elements || elements.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p className="text-lg font-semibold mb-2">Graph View</p>
          <p className="text-sm">No data available</p>
        </div>
      </div>
    );
  }

  return (
    <svg width="100%" height="100%" className="bg-transparent">
      {/* Draw edges */}
      {edges.map((edge, index) => (
        <line
          key={`edge-${index}`}
          x1="50"
          y1="50"
          x2="150"
          y2="150"
          stroke="#94a3b8"
          strokeWidth="1"
        />
      ))}
      
      {/* Draw nodes */}
      {nodes.map((node, index) => (
        <g key={`node-${index}`}>
          <circle
            cx={100 + (index * 100)}
            cy={100 + (index * 50)}
            r="20"
            fill="#3b82f6"
            stroke="#1e40af"
            strokeWidth="2"
            style={{ cursor: 'pointer' }}
            onClick={() => handleNodeClick(node.data.id)}
          />
          <text
            x={100 + (index * 100)}
            y={100 + (index * 50) + 5}
            textAnchor="middle"
            fill="white"
            fontSize="12"
            style={{ pointerEvents: 'none' }}
          >
            {node.data.title || node.data.id}
          </text>
        </g>
      ))}
    </svg>
  );
};

// Styling constants
const palette = {
  card: 'rgba(255, 255, 255, 0.1)',
  text: '#ffffff',
  stroke: 'rgba(255, 255, 255, 0.2)'
};

const useGraphElements = (graph, filter) => {
  return useMemo(() => {
    if (!graph) return { elements: [], fuse: null };
    
    const nodes = graph.nodes.map(n => ({ data: n }));
    const nodeSet = new Set(nodes.map(n => n.data.id));
    const edges = graph.edges.filter(e => nodeSet.has(e.source) && nodeSet.has(e.target)).map(e => ({ data: e }));

    // Use actual Fuse.js for search
    const fuse = new Fuse(graph.nodes, { 
      keys: ['title', 'tags'], 
      threshold: 0.3 
    });
    
    return { elements: [...nodes, ...edges], fuse };
  }, [graph, filter]);
};

export default function GraphView({ clientSlug, onOpenDoc }) {
  const [graph, setGraph] = useState(null);
  const [query, setQuery] = useState('');
  const { elements, fuse } = useGraphElements(graph, {});

  useEffect(() => {
    // TODO: Implement actual graph fetching
    // fetch(`/graph/${clientSlug}.json`).then(r => r.json()).then(setGraph).catch(console.error);
    console.log('GraphView: Would fetch graph for clientSlug:', clientSlug);
  }, [clientSlug]);

  useEffect(() => {
    if (!graph || !fuse) return;
    const res = query ? fuse.search(query).map(r => r.item.id) : [];
    // Handle search results here if needed
  }, [query, graph, fuse]);

  return (
    <div className="w-full h-[calc(100vh-120px)] relative">
      <div className="absolute z-10 top-3 left-3 right-3 flex gap-2 items-center">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search notes or #tags"
          className="flex-1 px-3 py-2 rounded-2xl backdrop-blur-md text-sm"
          style={{ background: palette.card, color: palette.text, border: `1px solid ${palette.stroke}` }}
        />
        <span className="px-3 py-2 rounded-xl text-xs" style={{ background: palette.card, color: palette.text, border: `1px solid ${palette.stroke}` }}>
          {elements.filter(e => e.data && e.data.id).length} nodes
        </span>
      </div>
      <div className="absolute inset-0" style={{ background: 'radial-gradient(1200px 600px at 20% -20%, rgba(155,135,245,0.12), transparent), radial-gradient(800px 400px at 90% 120%, rgba(135,245,225,0.1), transparent)'}} />
      <GraphVisualization
        elements={elements.map(el => ({ ...el, selectable: true }))}
        onNodeClick={onOpenDoc}
      />
    </div>
  );
}