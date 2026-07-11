import { defineMarkdocConfig } from '@astrojs/markdoc/config';
import shiki from '@astrojs/markdoc/shiki';
import pkg from '@markdoc/markdoc';
const { nodes, Tag } = pkg;
import { slugify } from './src/lib/slugify.mjs';

export default defineMarkdocConfig({
  extends: [
    shiki({
      theme: 'github-light',
    }),
  ],
  nodes: {
    heading: {
      ...nodes.heading,
      transform(node, config) {
        const attributes = node.transformAttributes(config);
        const children = node.transformChildren(config);
        const text = children.filter((child) => typeof child === 'string').join(' ');
        const level = node.attributes['level'];
        return new Tag(`h${level}`, { ...attributes, id: slugify(text) }, children);
      },
    },
  },
});
