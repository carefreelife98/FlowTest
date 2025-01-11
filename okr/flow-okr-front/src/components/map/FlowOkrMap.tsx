"use client";

import React, {useState, useCallback, useEffect} from 'react';
import ReactFlow, {
    Background,
    Controls,
    addEdge,
    Connection,
    Edge,
    Node,
} from 'reactflow';
import 'reactflow/dist/style.css';

const initialNodes: Node[] = [
    { id: '1', position: { x: 0, y: 0 }, data: { label: 'Root Node' } },
    { id: '2', position: { x: 200, y: 100 }, data: { label: 'Child Node 1' } },
    { id: '3', position: { x: -200, y: 100 }, data: { label: 'Child Node 2' } },
];

const initialEdges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2', type: 'smoothstep' },
    { id: 'e1-3', source: '1', target: '3', type: 'smoothstep' },
];

export default function FlowOkrMap() {
    const [nodes, setNodes] = useState<Node[]>(initialNodes);
    const [edges, setEdges] = useState<Edge[]>(initialEdges);

    const onConnect = useCallback(
        (connection: Edge | Connection) => setEdges((eds) => addEdge(connection, eds)),
        []
    );

    useEffect(() => {
    }, []);

    return (
        <div style={{ width: '100%', height: '500px' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onConnect={onConnect}
                fitView
            >
                <Background />
                <Controls />
            </ReactFlow>
        </div>
    );
};
