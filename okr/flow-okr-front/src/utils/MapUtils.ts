import {Node, Edge} from "reactflow";

// TASK TREE API Response JSON 데이터를 React Flow의 Nodes 및 Edges로 변환
export function convertTreeToNodesAndEdges(data: any, x = 0, y = 0, parentId: string | null = null) {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    function traverse(node: any, posX: number, posY: number, parent?: string) {
        const id = node.id.toString();
        nodes.push({
            id,
            type: 'flowOkrNode',
            position: { x: posX, y: posY },
            data: {
                id: node.id,
                title: node.title,
                content: node.content,
                rate: node.rate,
                type: node.type,
            },
        });

        if (parent) {
            edges.push({
                id: `${parent}-${id}`,
                source: parent,
                target: id,
                type: "bezier",
            });
        }

        const childYOffset = 600; // 자식 간의 Y축 간격 (Front 의 shadcn ui 카드 크기에 맞춰 적용)
        const childXOffset = 600; // 자식 간의 X축 간격 (Front 의 shadcn ui 카드 크기에 맞춰 적용)
        node.children.forEach((child: any, index: number) => {
            traverse(
                child,
                posX + (index - Math.floor(node.children.length / 2)) * childXOffset,
                posY + childYOffset,
                id
            );
        });
    }

    traverse(data, x, y, parentId ?? undefined);
    return { nodes, edges };
}