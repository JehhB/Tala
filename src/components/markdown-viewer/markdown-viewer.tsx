import { FunctionComponent } from "react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHightlight from "rehype-highlight";
import rehypeSanitize from "rehype-sanitize";
import rehypeSlug from "rehype-slug";

import "highlight.js/styles/googlecode.css";

type MarkdownViewerProps = {
  markdown: string;
};

export const MarkdownViewer: FunctionComponent<MarkdownViewerProps> =
  function ({ markdown }) {
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, rehypeSanitize, rehypeHightlight]}
      >
        {markdown}
      </ReactMarkdown>
    );
  };
