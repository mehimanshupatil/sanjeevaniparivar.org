import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('blog');
  const sorted = posts
    .filter((p) => !p.data.draft)
    .sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime());

  return rss({
    title: 'संजीवनी परिवार — ब्लॉग',
    description: 'संजीवनी परिवार, वसई यांचे उपक्रम, लेख आणि महत्त्वाच्या घडामोडी.',
    site: context.site!,
    items: sorted.map((post) => ({
      title:       post.data.title,
      description: post.data.excerpt,
      pubDate:     new Date(post.data.date),
      link:        `/blog/${post.id}/`,
      categories:  [post.data.kshetra],
      author:      post.data.author,
    })),
    customData: `<language>mr-IN</language>`,
    stylesheet: false,
  });
}
