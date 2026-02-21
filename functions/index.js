const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');

admin.initializeApp();

/**
 * Proxy function to securely call Gemini API
 * decouples the API key from the frontend.
 */
exports.chatProxy = functions.https.onCall(async (data, context) => {
    // SECURITY: Only allowed authenticated users from our portal
    if (!context.auth) {
        throw new functions.https.HttpsError(
            'unauthenticated',
            'Acces refuzat. Trebuie să fii autentificat în DEF Portal.'
        );
    }

    // Get API Key from Firebase Config
    // Set via: firebase functions:config:set gemini.key="YOUR_KEY"
    const API_KEY = functions.config().gemini.key;

    if (!API_KEY) {
        throw new functions.https.HttpsError(
            'failed-precondition',
            'Configurația serverului este incompletă (API Key lipsește).'
        );
    }

    // Try fallback models on the server side for resilience
    // Using verified stable model names
    const models = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash-latest'];

    // Identity and behavior rules
    const systemInstruction = {
        parts: [{
            text: "You are DEF AI Assistant — the official AI-powered business assistant for DEF Corp (defcorp.xyz). " +
                "You were developed by Alexandru Glonț and his team in Romania. " +
                "RULES: Be professional, helpful, concise. Recommend Standard/Professional plan. Under 200 words. " +
                "Always respond in the language the user uses (English or Romanian)."
        }]
    };

    for (const model of models) {
        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;

            // Inject system instruction if not provided by client
            const payload = {
                contents: data.contents,
                systemInstruction: systemInstruction,
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 2048,
                    topP: 0.9
                }
            };

            const response = await axios.post(url, payload, {
                headers: { 'Content-Type': 'application/json' },
                timeout: 10000 // 10 second timeout per model
            });

            return response.data;
        } catch (error) {
            console.warn(`Model ${model} failed:`, error.response?.data || error.message);
            // If it's the last model, throw the error
            if (model === models[models.length - 1]) {
                throw new functions.https.HttpsError(
                    'internal',
                    'Asistentul AI este momentan indisponibil. Te rugăm să încerci mai târziu.'
                );
            }
        }
    }
});
