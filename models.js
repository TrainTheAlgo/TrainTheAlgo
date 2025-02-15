const axios = require('axios');
require('dotenv').config();

const models = {};

/*
  Note prompts passed to these functions are in this format:
  [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: prompt }
  ]

  NB. IMPORTANT: Always create a duplicate of these rather than
  a reference     const titlePrompt = structuredClone(prompts.titles);
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
    },
    timeout: 300000,
  });
  return response.data.choices[0].message.content;
}

models.deepseek = async (prompt) => {
  const payload = {
    model: 'deepseek-r1:32b',
    messages: prompt,
    stream: false,
    temperature: 0
  };
  const response = await axios.post(`${process.env.OLLAMA}/api/chat`, payload, {
    headers: { 'Content-Type': 'application/json' }
  });
  const removeThinking = response.data.message.content.split('</think>')[1].trim()+"\n";
  return removeThinking;
};

models.dallE = async (prompt) => {
    const payload = {
      model: 'dall-e-3',
      prompt,
      size: "1792x1024",
      quality: "standard", //"hd",
      n: 1
    };
    const response = await axios.post('https://api.openai.com/v1/images/generations', payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI}`
      },
      timeout: 300000,
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
        },
        timeout: 300000,
      }
    );
    return response.data.choices[0].message.content;
};

module.exports = models;