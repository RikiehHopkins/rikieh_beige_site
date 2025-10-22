
/*
chat.js - Simple ChatGPT-style widget.
IMPORTANT security note:
- Storing your OpenAI API key directly in client-side JS is insecure.
- For production, create a server-side proxy that stores the key and forwards requests.
- This file uses a simple client-side placeholder so you can plug in a key for local testing.

USAGE:
1. Replace `const API_KEY = 'YOUR_API_KEY_HERE'` with your key for local testing (NOT RECOMMENDED for public sites).
2. Or change `API_ENDPOINT` to your own server proxy endpoint that adds the Authorization header server-side.
*/

const API_KEY = 'YOUR_API_KEY_HERE'; // <-- replace with your key for local testing ONLY
const API_ENDPOINT = 'https://api.openai.com/v1/chat/completions'; // or your server proxy URL

// DOM elements
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const chatMessages = document.getElementById('chatMessages');

function addMessage(text, who='bot'){
  const div = document.createElement('div');
  div.className = 'msg ' + (who === 'user' ? 'user' : 'bot');
  div.textContent = text;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function sendToOpenAI(prompt){
  // client-side fetch (works but exposes your key if used as-is)
  const body = {
    model: 'gpt-4o-mini',
    messages: [{role:'user', content: prompt}],
    max_tokens: 500,
    temperature: 0.2
  };
  const res = await fetch(API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    },
    body: JSON.stringify(body)
  });
  if(!res.ok){
    const err = await res.text();
    throw new Error('API error: ' + err);
  }
  const data = await res.json();
  const content = data.choices?.[0]?.message?.content ?? JSON.stringify(data);
  return content;
}

// form submit
chatForm?.addEventListener('submit', async function(e){
  e.preventDefault();
  const text = chatInput.value.trim();
  if(!text) return;
  addMessage(text, 'user');
  chatInput.value = '';
  addMessage('Thinking...', 'bot');
  try{
    const reply = await sendToOpenAI(text);
    const last = chatMessages.querySelector('.msg.bot:last-child');
    if(last) last.remove();
    addMessage(reply, 'bot');
  }catch(err){
    const last = chatMessages.querySelector('.msg.bot:last-child');
    if(last) last.remove();
    addMessage('Error connecting to the AI. Check console for details.', 'bot');
    console.error(err);
  }
});
