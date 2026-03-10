// ==============================
// Nexus AI Chatbot Widget
// ==============================
// Local knowledge base + optional OpenAI upgrade path.

const KNOWLEDGE_BASE = {
    company: "Nexus AI",
    greeting: "Hey there! 👋 Welcome to Nexus. I'm your AI assistant — ask me anything about our platform!",

    responses: {
        services: {
            keywords: ["service", "offer", "what do you do", "help me", "provide", "solutions", "product"],
            answer: `Here's what Nexus can do for your business:\n\n🧠 **Smart Chatbots** — AI assistants that learn your business inside out\n⚡ **Instant Engagement** — Respond to leads in under 1 second, 24/7\n🎯 **Lead Qualification** — Automatically filter and score your prospects\n📊 **Analytics** — Understand customer intent with conversation insights\n\nAll of this with zero coding required. Want to try it?`
        },

        pricing: {
            keywords: ["price", "cost", "pricing", "how much", "budget", "plan", "plans", "expensive", "cheap", "affordable", "rate", "fee", "started"],
            answer: `Our plans are designed to grow with you:\n\n🆓 **Free** — $0/month\n• 100 conversations/month\n• 1 chatbot\n• Basic analytics\n\n💙 **Pro** — $49/month\n• Unlimited conversations\n• 5 chatbots\n• Advanced analytics + integrations\n\n🏢 **Business** — $149/month\n• Everything in Pro\n• Custom AI training\n• Priority support + API access\n\nAll plans include a 14-day free trial!`
        },

        contact: {
            keywords: ["contact", "email", "phone", "call", "reach", "support", "speak", "talk", "human", "person", "agent", "help"],
            answer: `We're here for you! Reach out anytime:\n\n📧 **Email:** hello@nexus-ai.com\n💬 **Live Chat:** Right here, right now!\n📅 **Book a Demo:** nexus-ai.com/demo\n🐦 **Twitter:** @nexus_ai\n\nOur team typically responds within 2 hours during business hours.`
        },

        about: {
            keywords: ["about", "who are you", "company", "tell me", "history", "founded", "team", "nexus"],
            answer: `**Nexus AI** helps businesses have better conversations at scale.\n\n🚀 Founded in 2024 in London\n👥 Team of 30+ engineers & AI researchers\n🌍 3,200+ businesses across 40 countries\n⭐ 4.8/5 on G2 and Trustpilot\n\nOur mission: make AI customer engagement accessible to everyone.`
        },

        hours: {
            keywords: ["hours", "open", "when", "available", "schedule", "time"],
            answer: `We're pretty much always here:\n\n🤖 **AI Chat:** 24/7 — never sleeps!\n👥 **Human Support:** Mon-Fri, 9AM-6PM GMT\n📧 **Email:** Response within 2 hours\n📅 **Demos:** Schedule anytime at nexus-ai.com/demo`
        },

        demo: {
            keywords: ["demo", "trial", "free", "try", "test", "sample"],
            answer: `You can start for free today! 🎉\n\n✅ **14-day free trial** — no credit card needed\n✅ Full access to Pro features\n✅ We'll help you set up your first chatbot\n✅ Cancel anytime, no questions asked\n\nJust head to **nexus-ai.com/signup** — takes 2 minutes!`
        },

        integration: {
            keywords: ["integrate", "integration", "wordpress", "shopify", "api", "website", "install", "setup", "embed", "code"],
            answer: `Nexus connects with your entire stack:\n\n🌐 **Any Website** — One line of code to embed\n🛒 **Shopify** — Native app, one-click install\n📝 **WordPress** — Free plugin available\n💬 **WhatsApp & Telegram** — Full bot support\n🔗 **Zapier** — Connect 5,000+ apps\n📡 **REST API** — Build custom integrations\n\nSetup takes less than 2 minutes. Seriously.`
        },

        thanks: {
            keywords: ["thanks", "thank you", "cheers", "appreciate", "helpful", "great", "awesome", "cool"],
            answer: `Glad I could help! 😊\n\nFeel free to come back anytime — I'm here 24/7.\n\nAnything else on your mind?`
        },

        greetingResponse: {
            keywords: ["hello", "hi", "hey", "good morning", "good afternoon", "good evening", "sup", "yo", "hola"],
            answer: `Hey! 👋 Great to meet you!\n\nI can help with:\n💼 Learning about our AI platform\n💰 Pricing & plan comparisons\n🚀 Getting started with a free trial\n🔧 Technical setup & integrations\n\nWhat are you curious about?`
        }
    },

    fallback: `Hmm, that's a great question! 🤔 I don't have that specific info right now, but our team would love to help.\n\n📧 hello@nexus-ai.com\n📅 Book a call: nexus-ai.com/demo\n\nOr try asking about our **features**, **pricing**, or **integrations**!`
};

// ── State ──
let chatOpen = false;
let isTyping = false;

// ── Initialize ──
document.addEventListener('DOMContentLoaded', () => {
    addBotMessage(KNOWLEDGE_BASE.greeting);
});

// ── Toggle Chat ──
function toggleChat() {
    chatOpen = !chatOpen;
    const chatWindow = document.getElementById('chatWindow');
    const fabSvg = document.getElementById('fabSvg');
    const fabNotif = document.getElementById('fabNotif');
    const fabRing = document.querySelector('.fab-ring');

    if (chatOpen) {
        chatWindow.classList.add('open');
        fabSvg.innerHTML = '<path d="M18 6L6 18M6 6l12 12"/>';
        if (fabNotif) fabNotif.style.display = 'none';
        if (fabRing) fabRing.style.display = 'none';
        document.getElementById('chatInput').focus();
    } else {
        chatWindow.classList.remove('open');
        fabSvg.innerHTML = '<path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>';
        if (fabRing) fabRing.style.display = 'block';
    }
}

// ── Send User Message ──
function sendMessage() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    if (!text || isTyping) return;

    addUserMessage(text);
    input.value = '';

    // Hide quick actions after first message
    const quick = document.getElementById('chatQuick');
    if (quick) quick.style.display = 'none';

    showTyping();

    setTimeout(() => {
        hideTyping();
        const response = getAIResponse(text);
        addBotMessage(response);
    }, 600 + Math.random() * 1000);
}

// ── Send Suggestion ──
function sendSuggestion(text) {
    document.getElementById('chatInput').value = text;
    sendMessage();
}

// ── Get AI Response ──
function getAIResponse(userMessage) {
    const msg = userMessage.toLowerCase();

    for (const [key, data] of Object.entries(KNOWLEDGE_BASE.responses)) {
        for (const keyword of data.keywords) {
            if (msg.includes(keyword)) {
                return data.answer;
            }
        }
    }
    return KNOWLEDGE_BASE.fallback;
}

// ── Add Messages ──
function addBotMessage(text) {
    const messagesDiv = document.getElementById('chatMessages');
    const div = document.createElement('div');
    div.className = 'message bot';

    const formatted = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');

    div.innerHTML = `<span class="msg-label">Nexus AI</span>${formatted}`;
    messagesDiv.appendChild(div);
    scrollToBottom();
}

function addUserMessage(text) {
    const messagesDiv = document.getElementById('chatMessages');
    const div = document.createElement('div');
    div.className = 'message user';
    div.textContent = text;
    messagesDiv.appendChild(div);
    scrollToBottom();
}

// ── Typing ──
function showTyping() {
    isTyping = true;
    const messagesDiv = document.getElementById('chatMessages');
    const div = document.createElement('div');
    div.className = 'message bot';
    div.id = 'typingIndicator';
    div.innerHTML = `
        <span class="msg-label">Nexus AI</span>
        <div class="typing-indicator">
            <span></span><span></span><span></span>
        </div>`;
    messagesDiv.appendChild(div);
    scrollToBottom();
}

function hideTyping() {
    isTyping = false;
    const el = document.getElementById('typingIndicator');
    if (el) el.remove();
}

// ── Scroll ──
function scrollToBottom() {
    const messagesDiv = document.getElementById('chatMessages');
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}
