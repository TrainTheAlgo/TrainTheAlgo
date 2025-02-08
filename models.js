require('dotenv').config();
const models = {};

models.chatGPT = async (prompt) => {
  const payload = {
    model: 'chatgpt-4o-latest',
    messages: contentPrompt,
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

models.xAI = async (prompt) => {
    const payload = {
      model: 'grok-2-latest',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: prompt }
      ],
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