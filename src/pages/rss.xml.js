import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import settings from '../content/singletons/settings.json';

export async function GET(context) {
  const posts = await getCollection('writing');
  return rss({
    title: `${settings.siteName} — Writing`,
    description: settings.siteDescription,
    site: context.site,
    items: posts
      .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
      .map((post) => ({
      title: post.data.title,
      description: post.data.excerpt,
      pubDate: post.data.date,
      link: `/writing/${post.id}/`,
    })),
  });
}
