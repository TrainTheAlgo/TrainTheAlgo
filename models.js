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
    model: 'gpt-5.2',
    messages: prompt,
    stream: false,
    temperature: 0,
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

models.local = async (prompt) => {
  const payload = {
    model: 'nemotron-3-nano:30b',
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

models.imageGen = async (prompt) => {
    const payload = {
      model: 'gpt-image-1.5',
      prompt,
      //size: "1792x1024",
      //quality: "standard", //"hd",
      size: "1536x1024",
      quality: "medium",
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
      model: 'grok-3-latest',
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