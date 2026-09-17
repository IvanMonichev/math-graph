import { describe, expect, it } from 'vitest';
import type { Root } from 'mdast';
import { remarkTerms } from '../../src/features/term-highlighting/remark-terms';

describe('term highlighting', () => {
  it('uses explicit labels and default topic titles without changing surrounding text', () => {
    const tree: Root = {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [{ type: 'text', value: 'Изучите [[fractions|дроби]] и [[powers]].' }],
        },
      ],
    };
    remarkTerms()(tree);
    expect(tree.children[0]).toMatchObject({
      type: 'paragraph',
      children: [
        { type: 'text', value: 'Изучите ' },
        { type: 'link', url: '/topics/fractions', children: [{ type: 'text', value: 'дроби' }] },
        { type: 'text', value: ' и ' },
        { type: 'link', url: '/topics/powers', children: [{ type: 'text', value: 'Степени' }] },
        { type: 'text', value: '.' },
      ],
    });
  });
  it('leaves unknown topics, code and existing links untouched', () => {
    const tree: Root = {
      type: 'root',
      children: [
        { type: 'code', value: '[[fractions]]' },
        {
          type: 'paragraph',
          children: [
            { type: 'inlineCode', value: '[[fractions]]' },
            { type: 'text', value: '[[missing]]' },
            {
              type: 'link',
              url: '/existing',
              children: [{ type: 'text', value: '[[fractions]]' }],
            },
          ],
        },
      ],
    };
    const before = structuredClone(tree);
    remarkTerms()(tree);
    expect(tree).toEqual(before);
  });
});
