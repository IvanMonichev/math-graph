import type { Root, PhrasingContent, RootContent } from 'mdast';
import { topicById } from '../../entities/math-topic/model/graph';

/** [[topic-id|visible label]] is opt-in: code, formulas and existing links are untouched. */
export function remarkTerms() {
  return (tree: Root) => {
    function visit(parent: Root | RootContent) {
      if (!('children' in parent) || parent.type === 'link' || parent.type === 'linkReference')
        return;
      const children = parent.children as RootContent[];
      for (let index = 0; index < children.length; index++) {
        const child = children[index];
        if (child.type !== 'text') {
          visit(child);
          continue;
        }
        const pattern = /\[\[([a-z0-9-]+)(?:\|([^\]\n]+))?\]\]/g;
        const result: PhrasingContent[] = [];
        let cursor = 0;
        for (const match of child.value.matchAll(pattern)) {
          const topic = topicById.get(match[1]);
          if (!topic) continue;
          if (match.index > cursor)
            result.push({ type: 'text', value: child.value.slice(cursor, match.index) });
          result.push({
            type: 'link',
            url: `/topics/${topic.id}`,
            children: [{ type: 'text', value: match[2] ?? topic.title }],
          });
          cursor = match.index + match[0].length;
        }
        if (!result.length) continue;
        if (cursor < child.value.length)
          result.push({ type: 'text', value: child.value.slice(cursor) });
        children.splice(index, 1, ...result);
        index += result.length - 1;
      }
    }
    visit(tree);
  };
}
