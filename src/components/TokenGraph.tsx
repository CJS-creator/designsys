import React, { useMemo } from 'react';
import ReactFlow, {
    Background,
    Controls,
    Edge,
    Node,
    Handle,
    Position,
    MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';
import { GeneratedDesignSystem } from '@/types/designSystem';

// Custom Node Components
const PrimitiveNode = ({ data }: any) => (
    <div className="px-4 py-2 rounded-xl bg-card border-2 border-primary/20 shadow-lg min-w-[150px]">
        <Handle type="target" position={Position.Left} className="w-2 h-2 bg-primary" />
        <div className="flex items-center gap-3">
            {data.color && (
                <div className="w-4 h-4 rounded-full border border-border" style={{ backgroundColor: data.color }} />
            )}
            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{data.label}</div>
        </div>
        <div className="text-xs font-mono mt-1 text-primary">{data.value}</div>
        <Handle type="source" position={Position.Right} className="w-2 h-2 bg-primary" />
    </div>
);

const SemanticNode = ({ data }: any) => (
    <div className="px-4 py-2 rounded-xl bg-primary shadow-xl shadow-primary/20 min-w-[180px] border-2 border-white/10">
        <Handle type="target" position={Position.Left} className="w-2 h-2 bg-white" />
        <div className="text-[9px] font-black uppercase tracking-widest text-white/60 mb-1">Semantic Token</div>
        <div className="text-xs font-bold text-white">{data.label}</div>
        <Handle type="source" position={Position.Right} className="w-2 h-2 bg-white" />
    </div>
);

const ComponentNode = ({ data }: any) => (
    <div className="px-6 py-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl min-w-[200px]">
        <Handle type="target" position={Position.Left} className="w-2 h-2 bg-primary" />
        <div className="text-[10px] font-black uppercase tracking-widest text-primary mb-3">Target Component</div>
        <div className="p-3 rounded-lg border border-white/5 bg-black/20 flex items-center justify-center">
            {data.preview}
        </div>
        <div className="text-[10px] text-center mt-2 font-bold text-muted-foreground">{data.label}</div>
    </div>
);

const nodeTypes = {
    primitive: PrimitiveNode,
    semantic: SemanticNode,
    component: ComponentNode,
};

interface TokenGraphProps {
    designSystem: GeneratedDesignSystem;
}

export const TokenGraph: React.FC<TokenGraphProps> = ({ designSystem }) => {
    const { nodes, edges } = useMemo(() => {
        const dsNodes: Node[] = [];
        const dsEdges: Edge[] = [];

        if (!designSystem.tokenStore) {
            // Fallback to basic visualization if store is missing
            const primitives = [
                { id: 'p-primary', label: 'Primary', value: designSystem.colors.primary, color: designSystem.colors.primary },
                { id: 'p-secondary', label: 'Secondary', value: designSystem.colors.secondary, color: designSystem.colors.secondary },
                { id: 'p-text', label: 'Text', value: designSystem.colors.text, color: designSystem.colors.text },
            ];

            primitives.forEach((p, i) => {
                dsNodes.push({
                    id: p.id,
                    type: 'primitive',
                    data: { label: p.label, value: p.value, color: p.color },
                    position: { x: 50, y: i * 100 + 50 },
                });
            });
            return { nodes: dsNodes, edges: dsEdges };
        }

        const { tokens } = designSystem.tokenStore;
        const REF_REGEX = /\{([^}]+)\}/g;

        // Position tracking
        let foundationCount = 0;
        let semanticCount = 0;
        let componentCount = 0;

        Object.values(tokens).forEach((token) => {
            const isSemantic = token.path.startsWith('semantic.');
            const isComponent = token.path.startsWith('components.');

            let type = 'primitive';
            let x = 50;
            let y = 0;

            if (isSemantic) {
                type = 'semantic';
                x = 350;
                y = semanticCount * 100 + 50;
                semanticCount++;
            } else if (isComponent) {
                type = 'component';
                x = 700;
                y = componentCount * 150 + 75;
                componentCount++;
            } else {
                y = foundationCount * 100 + 50;
                foundationCount++;
            }

            // Preview for colors
            const colorValue = typeof token.value === 'string' && token.value.startsWith('hsl') ? token.value : undefined;

            dsNodes.push({
                id: token.path,
                type: type as any,
                data: {
                    label: token.name || token.path.split('.').pop(),
                    value: typeof token.value === 'string' ? token.value : JSON.stringify(token.value),
                    color: colorValue
                },
                position: { x, y },
            });

            // Extract references for edges
            const valueStr = typeof token.value === 'string' ? token.value : '';
            const refs = [...valueStr.matchAll(REF_REGEX)].map(m => m[1]);

            refs.forEach(refPath => {
                if (tokens[refPath]) {
                    dsEdges.push({
                        id: `e-${refPath}-${token.path}`,
                        source: refPath,
                        target: token.path,
                        animated: true,
                        style: { stroke: 'var(--primary)', strokeWidth: 2, opacity: 0.6 },
                        markerEnd: { type: MarkerType.ArrowClosed, color: 'var(--primary)' },
                    });
                }
            });
        });

        return { nodes: dsNodes, edges: dsEdges };
    }, [designSystem]);

    return (
        <div className="w-full h-[500px] rounded-3xl border-2 border-primary/10 bg-black/40 backdrop-blur-xl overflow-hidden relative group">
            <div className="absolute top-6 left-6 z-10">
                <div className="px-4 py-2 rounded-full bg-primary/20 border border-primary/30 backdrop-blur-md">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">Semantic Token Graph</span>
                </div>
            </div>

            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                fitView
                className="bg-transparent"
                proOptions={{ hideAttribution: true }}
            >
                <Background color="rgba(255, 255, 255, 0.03)" gap={20} />
                <Controls className="fill-primary" />
            </ReactFlow>

            <div className="absolute bottom-6 right-6 z-10 pointer-events-none">
                <p className="text-[9px] font-medium text-muted-foreground/60 uppercase tracking-widest text-right">
                    Interactive Node Mapping<br />Visual Semantic Layer
                </p>
            </div>
        </div>
    );
};
