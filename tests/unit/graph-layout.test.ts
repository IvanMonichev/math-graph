import { describe, expect, it } from 'vitest';
import { categories, topics } from '../../src/entities/math-topic/model/graph';
import { createGraphLayout, nodeSize } from '../../src/widgets/math-graph/graph-layout';

describe('graph layout', () => {
  it('places every topic in its own rectangle and keeps dependencies below their source', () => {
    for (const category of categories) {
      const ids = topics.filter((topic) => topic.category === category.id).map((topic) => topic.id);
      if (!ids.length) continue;
      const { positions, graphEdges } = createGraphLayout(ids);
      for (let i = 0; i < ids.length; i++) {
        const a = positions.get(ids[i])!;
        expect(Number.isFinite(a.x) && Number.isFinite(a.y)).toBe(true);
        for (let j = i + 1; j < ids.length; j++) {
          const b = positions.get(ids[j])!;
          const overlap =
            Math.abs(a.x - b.x) < nodeSize.width && Math.abs(a.y - b.y) < nodeSize.height;
          expect(overlap, `${ids[i]} overlaps ${ids[j]}`).toBe(false);
        }
      }
      for (const edge of graphEdges.filter((edge) => edge.type === 'prerequisite')) {
        expect(positions.get(edge.target)!.y).toBeGreaterThan(positions.get(edge.source)!.y);
      }
    }
    expect(nodeSize).toEqual({ width: 228, height: 112 });
  });
});
