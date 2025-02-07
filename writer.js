const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

// Retrieve the subject from the command line arguments
const subject = process.argv[2];
if (!subject) {
  console.error('Please provide a subject. Usage: node script.js "Your subject here"');
  process.exit(1);
}

// Build the messages payload for the OpenAI API
const messages = [
  {
    role: 'system',
    content: `You are a helpful assistant that is going to write an article for a professional publication which prides itself on providing unbiased content, concise, informative and to the point. The article should provide a source of truth, signal through the noise.

Ensure the article is well written using simple to understand language. Minimise the usage of bullet points, list and hyphens.
Write using short paragraphs and vary sentence lengths to make it easy and interesting to read. 
Connect to the web to get the latest information on the topic.
Make sure the content flows naturally and is tailored to engage and retain a wide audience.
Where possible break the content down into logical sections that follow a well crafted story line
Ensure the content is interesting and entertaining while not being too cringe and sensationalist
`
  },
  {
    role: 'user',
    content: `Write a detailed article about "${subject}".    

Captivate the readers interest to ensure they read on. First paragraph critical, why should they read? Start with a promise, or a question, or a fact/statement, or a tip, or some form of controversy.

Capture attention with intrigue and offer value with lists, steps and stories. Provide as much value as possible. Entertain, educate, inspire. Teaching content, tips, how to sections, deep insights, unique perspectives, detailed specific examples, personal anecdotes.

Reward: Ensure the reader leaves with a positive takeaway and the value promised

1. Use simple and clear language, avoiding jargon unless necessary for the audience.
2. Ensure logical flow between paragraphs and sections.
3. Ensure it is optimized for SEO with relevant keywords, especially the title and opening paragraph.
4. Vary sentence structure to maintain reader interest.

The article should then be formatted using HTML and Tailwind CSS and put into this template:

Example Output:

<script>
  const article = {
    title: "Article Title",
    slug: "article-title",
    description: "max 250 character summary of the article, will be used as an overlay on the article image thumbnail and as a promotional tweet.",
    image: "article-title.png",
  }
</script>
<style></style>

<h2 class="text-xl md:text-2xl font-bold">Sub Heading</h2>
<p class="p-2 my-4">Article Content</p>
`
  }
];

const endpoint = 'https://api.openai.com/v1/chat/completions';
const payload = {
  model: 'chatgpt-4o-latest',
  messages: messages,
  stream: false,
  temperature: 0
};

axios.post(endpoint, payload, {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.OPENAI}`
  }
})
  .then(response => {
    // Retrieve the article content from the response
    const htmlContent = response.data.choices[0].message.content;
    
    // extract data
    const regex = /(title|slug|description|image):\s*"([^"]+)"/g;
    const article = {};
    let match;
    while ((match = regex.exec(htmlContent)) !== null) article[match[1]] = match[2];
    const { title, slug, description, image } = article;
    console.log({ title, slug, description, image });

    const now = new Date();
    const year = now.getFullYear().toString();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const outputDir = `content/${year}/${month}/`;
    fs.mkdirSync(outputDir, { recursive: true });
    const outputFile = `${outputDir}${slug}.html`;

    // Write the HTML file to the output directory
    fs.writeFileSync(outputFile, htmlContent, 'utf8');
    console.log(`Article generated and saved to ${outputFile}`);

    // Update or create the index.json file with metadata about the article
    const indexPath = 'content/index.json';
    let indexData = [];
    if (fs.existsSync(indexPath)) {
      try {
        indexData = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
      } catch (err) {
        console.error('Error parsing index.json, starting with a new file.');
      }
    }

    indexData.push({
      title,
      slug,
      description,
      image,
      path: `${year}/${month}/`,
      date: new Date().toISOString()
    });
    
    fs.writeFileSync(indexPath, JSON.stringify(indexData, null, 2), 'utf8');
    console.log(`Index updated at ${indexPath}`);
  })
  .catch(error => {
    console.error('Error calling the OpenAI API:', error.response ? error.response.data : error.message);
  });
