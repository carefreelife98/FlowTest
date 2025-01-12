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
import {convertTreeToNodesAndEdges} from "@/utils/MapUtils";
import {getTotalTaskTree} from "@/api/task/task-api";
import FlowOkrNode from "@/components/map/FlowOkrNode";

const nodeType = {
    flowOkrNode: FlowOkrNode,
}

export default function FlowOkrMap() {
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);

    const onConnect = useCallback(
        (connection: Edge | Connection) => setEdges((eds) => addEdge(connection, eds)),
        []
    );

    useEffect(() => {
        getTotalTaskTree().then(response => {
            const { nodes, edges } = convertTreeToNodesAndEdges(response);
            setNodes(nodes);
            setEdges(edges);
        });
    }, []);

    return (
        <div className="h-screen w-screen">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onConnect={onConnect}
                nodeTypes={nodeType}
                fitView={true}
            >
                <Background />
                <Controls />
            </ReactFlow>
        </div>
    );
}