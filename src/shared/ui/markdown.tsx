import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { remarkTerms } from '../../features/term-highlighting/remark-terms';
import { TermLink } from '../../features/term-highlighting/term-link';
import 'katex/dist/katex.min.css';

export function Markdown({ content }: { content: string }) {
  return (
    <div className="markdown">
      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkTerms]}
        rehypePlugins={[rehypeKatex]}
        components={{ a: ({ href, children }) => <TermLink href={href}>{children}</TermLink> }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
