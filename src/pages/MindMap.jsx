import React from 'react';
import GraphView from '../components/GraphView.jsx';


export default function MindMap() {
const clientSlug = 'builtbyrays'; // TODO: derive from logged-in user’s membership
const openDoc = (id) => {
// id looks like: builtbyrays/path/to/note
const slug = id.replace(/^.*?\//, '');
window.location.href = `/kb/${clientSlug}/${slug}`;
};
return (
<div className="container mx-auto p-4">
<h1 className="text-2xl font-semibold mb-2">Knowledge Graph</h1>
<p className="opacity-70 mb-4">Explore connections between notes. Click a node to open the document.</p>
<GraphView clientSlug={clientSlug} onOpenDoc={openDoc} />
</div>
);
}