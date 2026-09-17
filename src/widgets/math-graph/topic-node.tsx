import { Handle, Position } from '@xyflow/react';
import type { Node, NodeProps } from '@xyflow/react';
import { Button, Popover, Tooltip } from 'antd';
import { ExportOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { categoryById } from '../../entities/math-topic/model/graph';
import type { MathTopic } from '../../entities/math-topic/model/types';
import { GeometryFigure } from '../../shared/ui/geometry-figure';

export type TopicFlowNode = Node<{ topic: MathTopic }, 'topic'>;

export function TopicNode({ data, selected }: NodeProps<TopicFlowNode>) {
  const navigate = useNavigate();
  const category = categoryById.get(data.topic.category);
  return (
    <div className={'topic-node-shell' + (data.topic.figure ? ' has-figure' : '')}>
      <Handle type="target" position={Position.Top} />
      <Popover
        title={data.topic.title}
        content={<p className="term-definition">{data.topic.description}</p>}
        trigger={['hover', 'focus', 'click']}
        mouseEnterDelay={0.2}
        placement="top"
        styles={{ container: { maxWidth: 330 } }}
      >
        <button
          type="button"
          className={'topic-node' + (selected ? ' is-selected' : '')}
          aria-label={data.topic.title}
        >
          <span className="node-category">
            <span aria-hidden>{category?.symbol}</span>
            {category?.title}
          </span>
          <span className="node-body">
            <span className="node-title">{data.topic.title}</span>
            {data.topic.figure && (
              <GeometryFigure kind={data.topic.figure} title={data.topic.title} compact />
            )}
          </span>
        </button>
      </Popover>
      <Tooltip title="Открыть материал">
        <Button
          className="node-open"
          type="text"
          size="small"
          icon={<ExportOutlined aria-hidden />}
          aria-label={`Открыть материал: ${data.topic.title}`}
          onClick={(event) => {
            event.stopPropagation();
            navigate(`/topics/${data.topic.id}`);
          }}
        />
      </Tooltip>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
