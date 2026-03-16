import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('blog');
  const sorted = posts
    .filter((p) => !p.data.draft)
    .sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime());

  return rss({
    title: 'Sanjeevani Parivar — Blog',
    description: 'Articles, updates, and initiative reports from Sanjeevani Parivar, Vasai.',
    site: context.site!,
    items: sorted.map((post) => ({
      title:       post.data.titleEn,
      description: post.data.excerptEn,
      pubDate:     new Date(post.data.date),
      link:        `/blog/${post.id}/`,
      categories:  [post.data.kshetra],
      author:      post.data.authorEn,
    })),
    customData: `<language>en-IN</language>`,
    stylesheet: false,
  });
}
