import { useEffect, useMemo } from 'react';
import {
  Background,
  BackgroundVariant,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  useViewport,
  useNodesInitialized,
  MarkerType,
} from '@xyflow/react';
import type { Edge } from '@xyflow/react';
import { Button, Tooltip } from 'antd';
import { AimOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import {
  getNextTopics,
  getPrerequisites,
  getRelatedTopics,
  topicById,
} from '../../entities/math-topic/model/graph';
import { TopicNode } from './topic-node';
import type { TopicFlowNode } from './topic-node';
import { createGraphLayout, nodeSize } from './graph-layout';

const nodeTypes = { topic: TopicNode };
interface Props {
  ids: string[];
  selectedId?: string;
  onSelect: (id: string | undefined) => void;
  focus?: { id: string; request: number };
}

function GraphControls() {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const { zoom } = useViewport();
  return (
    <Panel position="bottom-left" className="graph-controls">
      <Tooltip title="Уменьшить">
        <Button
          type="text"
          icon={<MinusOutlined aria-hidden />}
          aria-label="Уменьшить масштаб"
          onClick={() => void zoomOut({ duration: 200 })}
        />
      </Tooltip>
      <span>{Math.round(zoom * 100)}%</span>
      <Tooltip title="Увеличить">
        <Button
          type="text"
          icon={<PlusOutlined aria-hidden />}
          aria-label="Увеличить масштаб"
          onClick={() => void zoomIn({ duration: 200 })}
        />
      </Tooltip>
      <i />
      <Tooltip title="Показать всё">
        <Button
          type="text"
          icon={<AimOutlined aria-hidden />}
          aria-label="Показать весь граф"
          onClick={() => void fitView({ padding: 0.12, duration: 250, maxZoom: 1 })}
        />
      </Tooltip>
    </Panel>
  );
}

function GraphViewport({ signature, focus }: { signature: string; focus: Props['focus'] }) {
  const { fitView, viewportInitialized } = useReactFlow();
  const initialized = useNodesInitialized();
  useEffect(() => {
    if (!initialized || !viewportInitialized) return;
    void fitView({
      nodes: focus ? [{ id: focus.id }] : undefined,
      padding: focus ? 0.6 : 0.12,
      maxZoom: focus ? 1.1 : 1,
      duration: 0,
    });
  }, [initialized, viewportInitialized, signature, focus, fitView]);
  return null;
}

function GraphCanvas({ ids, selectedId, onSelect, focus }: Props) {
  const signature = ids.join(',');
  const layout = useMemo(() => createGraphLayout(signature.split(',')), [signature]);
  const neighbors = useMemo(
    () =>
      new Set(
        selectedId
          ? [
              selectedId,
              ...getPrerequisites(selectedId).map((t) => t.id),
              ...getNextTopics(selectedId).map((t) => t.id),
              ...getRelatedTopics(selectedId).map((t) => t.id),
            ]
          : [],
      ),
    [selectedId],
  );
  const nodes: TopicFlowNode[] = useMemo(
    () =>
      signature.split(',').flatMap((id) => {
        const topic = topicById.get(id);
        if (!topic) return [];
        return [
          {
            id,
            width: nodeSize.width,
            height: nodeSize.height,
            type: 'topic' as const,
            position: layout.positions.get(id)!,
            selected: selectedId === id,
            data: { topic },
            style: { opacity: selectedId && !neighbors.has(id) ? 0.35 : 1 },
            ariaLabel: topic.title,
          },
        ];
      }),
    [signature, layout, selectedId, neighbors],
  );
  const flowEdges: Edge[] = useMemo(
    () =>
      layout.graphEdges.map((edge) => {
        const highlighted = selectedId === edge.source || selectedId === edge.target;
        return {
          id: edge.type + '-' + edge.source + '-' + edge.target,
          source: edge.source,
          target: edge.target,
          type: 'smoothstep',
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: highlighted ? '#555' : '#bdbdbd',
            width: 13,
            height: 13,
          },
          style: {
            stroke: highlighted ? '#555' : '#cdcdcd',
            strokeWidth: highlighted ? 1.6 : 1.1,
            strokeDasharray: edge.type !== 'prerequisite' ? '5 5' : undefined,
            opacity: selectedId && !highlighted ? 0.35 : 1,
          },
        };
      }),
    [layout, selectedId],
  );
  return (
    <div className="math-graph" aria-label="Граф математических терминов">
      <ReactFlow<TopicFlowNode>
        nodes={nodes}
        edges={flowEdges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.12, maxZoom: 1 }}
        minZoom={0.15}
        maxZoom={2}
        nodesDraggable={false}
        nodesConnectable={false}
        nodesFocusable={false}
        deleteKeyCode={null}
        onNodeClick={(_, node) => onSelect(node.id)}
        onPaneClick={() => onSelect(undefined)}
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="#ddd" />
        <GraphViewport signature={signature} focus={focus} />
        <GraphControls />
      </ReactFlow>
    </div>
  );
}

export function MathGraph(props: Props) {
  return (
    <ReactFlowProvider>
      <GraphCanvas {...props} />
    </ReactFlowProvider>
  );
}
