import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Check } from 'lucide-react';

function CodeBlock({ children, className }) {
  const [copied, setCopied] = useState(false);
  const code = String(children).replace(/\n$/, '');

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  if (className) {
    // fenced block
    return (
      <div className="relative my-3 rounded-xl bg-charcoal-900 text-white">
        <button
          onClick={copy}
          className="absolute right-2 top-2 rounded-lg bg-white/10 p-1.5 text-white/70 hover:bg-white/20 hover:text-white"
          aria-label="Copy code"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
        <pre className="overflow-x-auto p-4 text-sm font-mono scrollbar-thin"><code>{code}</code></pre>
      </div>
    );
  }
  return <code className="rounded bg-charcoal-100 px-1.5 py-0.5 font-mono text-sm text-charcoal-800">{children}</code>;
}

// Note: no @tailwindcss/typography plugin is installed, so markdown elements are
// styled directly via component overrides rather than a `prose` utility class.
export default function MarkdownAnswer({ content, className = '' }) {
  return (
    <div className={`max-w-none text-[15px] leading-relaxed text-charcoal-700 ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code: ({ inline, className: cn, children }) =>
            inline ? <CodeBlock className={undefined}>{children}</CodeBlock> : <CodeBlock className={cn}>{children}</CodeBlock>,
          a: ({ children, ...props }) => (
            <a {...props} target="_blank" rel="noreferrer" className="text-emerald-700 underline underline-offset-2">
              {children}
            </a>
          ),
          p: ({ children }) => <p className="my-2">{children}</p>,
          ul: ({ children }) => <ul className="my-2 list-disc pl-5 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="my-2 list-decimal pl-5 space-y-1">{children}</ol>,
          h1: ({ children }) => <h4 className="text-h4 mt-3 mb-1.5">{children}</h4>,
          h2: ({ children }) => <h4 className="text-h4 mt-3 mb-1.5">{children}</h4>,
          h3: ({ children }) => <h4 className="font-semibold text-charcoal-900 mt-3 mb-1">{children}</h4>,
          strong: ({ children }) => <strong className="font-semibold text-charcoal-900">{children}</strong>,
          blockquote: ({ children }) => <blockquote className="border-l-2 border-emerald-300 pl-3 italic text-charcoal-500 my-2">{children}</blockquote>,
          table: ({ children }) => (
            <div className="my-3 w-full overflow-x-auto rounded-xl border border-charcoal-200 bg-white scrollbar-thin">
              <table className="min-w-full divide-y divide-charcoal-200 text-xs sm:text-sm">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="bg-charcoal-50 px-3.5 py-2.5 text-left font-semibold text-charcoal-800 whitespace-nowrap">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-3.5 py-2 text-charcoal-700 border-t border-charcoal-100">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
