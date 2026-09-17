import dagre from '@dagrejs/dagre';
import { edges, topicById } from '../../entities/math-topic/model/graph';

export const nodeSize = { width: 228, height: 112 };

export function createGraphLayout(ids: string[]) {
  const visible = new Set(ids);
  const graphEdges = edges.filter((edge) => visible.has(edge.source) && visible.has(edge.target));
  const graph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  graph.setGraph({ rankdir: 'TB', nodesep: 40, ranksep: 66, marginx: 20, marginy: 20 });
  ids.forEach((id) => graph.setNode(id, { ...nodeSize }));
  graphEdges
    .filter((edge) => edge.type === 'prerequisite')
    .forEach((edge) => graph.setEdge(edge.source, edge.target));
  dagre.layout(graph);
  const positions = new Map(
    ids.map((id) => {
      const point = graph.node(id);
      return [id, { x: point.x - nodeSize.width / 2, y: point.y - nodeSize.height / 2 }];
    }),
  );

  if (ids.every((id) => topicById.get(id)?.category === 'geometry')) {
    const levels = new Map<string, number>();
    function depth(id: string): number {
      const cached = levels.get(id);
      if (cached !== undefined) return cached;
      const prerequisites = (topicById.get(id)?.prerequisites ?? []).filter((source) =>
        visible.has(source),
      );
      const level = prerequisites.length ? Math.max(...prerequisites.map(depth)) + 1 : 0;
      levels.set(id, level);
      return level;
    }
    const rows = new Map<number, string[]>();
    ids.forEach((id) => {
      const level = depth(id);
      rows.set(level, [...(rows.get(level) ?? []), id]);
    });
    const stepX = nodeSize.width + 44;
    const stepY = nodeSize.height + 66;
    const maxRow = Math.max(...[...rows.values()].map((row) => row.length));
    rows.forEach((row, level) => {
      row.sort((a, b) => graph.node(a).x - graph.node(b).x);
      row.forEach((id, index) =>
        positions.set(id, {
          x: ((maxRow - row.length) * stepX) / 2 + index * stepX,
          y: level * stepY,
        }),
      );
    });
  }
  return { graphEdges, positions };
}
