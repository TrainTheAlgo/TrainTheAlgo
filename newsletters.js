const fs = require('fs');
const axios = require('axios');

const newsletters = {};

newsletters.fetchRandomPost = async () => {
  try {
    const { data } = await axios.get('https://substack.com/api/v1/trending?limit=36&category_id=4');
    const posts = data.posts;
    if (!posts || posts.length === 0) {
      console.error('No posts found');
      return;
    }
    let randomPost, slug, subdomain;
    let attempts = 0;
    do {
      attempts += 1;
      randomPost = posts[Math.floor(Math.random() * posts.length)];
      slug = randomPost.slug;
      const canonicalUrl = randomPost.canonical_url;
      const urlObj = new URL(canonicalUrl);
      const hostnameParts = urlObj.hostname.split('.');
      if (hostnameParts.length >= 3 && hostnameParts.slice(-2).join('.') === 'substack.com') {
        subdomain = hostnameParts[0];
      } else {
        subdomain = hostnameParts[0];
      }
    } while ((subdomain === 'www' || subdomain === 'blog' || subdomain === 'substack' || !subdomain) && attempts < 36);  
    console.log({ subdomain, slug });
    return { subdomain, slug }
  } catch (error) {
    console.error('Error fetching posts:', error.message);
  }
}

newsletters.fetchAndCleanPost = async (subdomain, slug) => {
  try {
    const url = `https://${subdomain}.substack.com/api/v1/posts/${slug}`;
    const { data } = await axios.get(url);
    const htmlContent = data.body_html;
    const title = data.title;
    if (!htmlContent) {
      console.error('No HTML content found.');
      return;
    }
    const background = htmlContent.replace(/<[^>]+>/g, '').trim();
    console.log('Cleaned text content:');
    console.log({ title, background });
    return { title, background };
  } catch (error) {
    console.error('Error fetching or cleaning the post:', error.message);
  }
}

newsletters.latest = async () => {
  const post = await newsletters.fetchRandomPost();
  const content = await newsletters.fetchAndCleanPost(post.subdomain, post.slug);
  console.log('content',content)
  return ({ title: content.title, background: content.background });
}

module.exports = newsletters;
