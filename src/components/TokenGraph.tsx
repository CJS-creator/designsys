import React, { useMemo } from 'react';
import ReactFlow, {
    Background,
    Controls,
    Edge,
    Node,
    Handle,
    Position,
    ConnectionLineType,
    MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';
import { GeneratedDesignSystem } from '@/types/designSystem';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

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

        // 1. Primitive Nodes (Colors)
        const primitives = [
            { id: 'p-primary', label: 'Primary', value: designSystem.colors.primary, color: designSystem.colors.primary },
            { id: 'p-secondary', label: 'Secondary', value: designSystem.colors.secondary, color: designSystem.colors.secondary },
            { id: 'p-bg', label: 'Background', value: designSystem.colors.background, color: designSystem.colors.background },
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

        // 2. Semantic Nodes
        const semantics = [
            { id: 's-brand', label: '--ds-brand-primary', source: 'p-primary' },
            { id: 's-action', label: '--ds-action-bg', source: 'p-primary' },
            { id: 's-surface', label: '--ds-surface-main', source: 'p-secondary' },
            { id: 's-foreground', label: '--ds-content-primary', source: 'p-text' },
        ];

        semantics.forEach((s, i) => {
            dsNodes.push({
                id: s.id,
                type: 'semantic',
                data: { label: s.label },
                position: { x: 350, y: i * 100 + 50 },
            });

            dsEdges.push({
                id: `e-${s.source}-${s.id}`,
                source: s.source,
                target: s.id,
                animated: true,
                style: { stroke: designSystem.colors.primary, strokeWidth: 2 },
                markerEnd: { type: MarkerType.ArrowClosed, color: designSystem.colors.primary },
            });
        });

        // 3. Component Nodes
        const components = [
            {
                id: 'c-button',
                label: 'Primary Button',
                source: 's-action',
                preview: (
                    <div
                        className="px-4 py-2 rounded-md font-bold text-xs"
                        style={{ backgroundColor: designSystem.colors.primary, color: designSystem.colors.onPrimary }}
                    >
                        Button
                    </div>
                )
            },
            {
                id: 'c-card',
                label: 'Feature Card',
                source: 's-brand',
                preview: (
                    <div
                        className="w-full h-8 rounded border border-white/10"
                        style={{ borderLeft: `4px solid ${designSystem.colors.primary}` }}
                    />
                )
            },
        ];

        components.forEach((c, i) => {
            dsNodes.push({
                id: c.id,
                type: 'component',
                data: { label: c.label, preview: c.preview },
                position: { x: 700, y: i * 150 + 75 },
            });

            dsEdges.push({
                id: `e-${c.source}-${c.id}`,
                source: c.source,
                target: c.id,
                type: ConnectionLineType.SmoothStep,
                animated: true,
                style: { stroke: designSystem.colors.primary, strokeWidth: 2, opacity: 0.5 },
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
