## XAI Example

curl https://api.x.ai/v1/chat/completions -H "Content-Type: application/json" -H "Authorization: Bearer APIKEYHERE" -d '{
  "messages": [
    {
      "role": "system",
      "content": "You are a test assistant."
    },
    {
      "role": "user",
      "content": "Testing. Just say hi and hello world and nothing else."
    }
  ],
  "model": "grok-2-latest",
  "stream": false,
  "temperature": 0
}'

## OpenAI Example

curl https://api.openai.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "chatgpt-4o-latest",
    "messages": [
      {
        "role": "system",
        "content": "You are a test assistant."
      },
      {
        "role": "user",
        "content": "Testing. Just say hi and hello world and nothing else."
      }
    ],
    "stream": false,
    "temperature": 0
  }'
