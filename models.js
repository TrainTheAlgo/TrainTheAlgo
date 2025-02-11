const axios = require('axios');
require('dotenv').config();

const models = {};

/*
Note prompts passed to these functions are in this format:
[
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: prompt }
]
*/

models.chatGPT = async (prompt) => {
  const payload = {
    model: 'chatgpt-4o-latest',
    messages: prompt,
    stream: false,
    temperature: 0
  };
  const response = await axios.post('https://api.openai.com/v1/chat/completions', payload, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI}`
    }
  });
  return response.data.choices[0].message.content;
}

models.ollama = async (prompt) => {
  const payload = {
    model: 'deepseek-r1:14b',
    messages: prompt,
    stream: false,
    temperature: 0
  };
  // Note the URL is now local and no Authorization header is needed
  const response = await axios.post('http://192.168.1.26:11434/api/chat', payload, {
    headers: { 'Content-Type': 'application/json' }
  });
  return response.data.message.content;
};

models.dallE = async (prompt) => {
    const payload = {
      model: 'dall-e-3',
      prompt,
      size: "1792x1024",
      quality: "hd",
      n: 1
    };
    const response = await axios.post('https://api.openai.com/v1/images/generations', payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI}`
      }
    });
    return response.data;
  }

models.xAI = async (prompt) => {
    const payload = {
      model: 'grok-2-latest',
      messages: prompt,
      stream: false,
      temperature: 0
    };
  
    const response = await axios.post(
      'https://api.x.ai/v1/chat/completions',
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.XAI}`
        }
      }
    );
    return response.data.choices[0].message.content;
};

module.exports = models;