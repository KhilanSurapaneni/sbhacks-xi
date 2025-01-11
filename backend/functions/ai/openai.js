// const {Configuration , OpenAIAPI} = require('openai');

// // Configuring the API Client
// const config = new Configuration({
//     apiKey: process.env.process.env.OPENAI_API_KEY,
// });

// const openai = new OpenAIAPI(configuration);

import OpenAI from "openai";
const openai = new OpenAI();

// Processing the Journal Entries using the API
async function processJournalEntry(entry)
{
    try
    {
        const response = await openai.chat.completions.create({
            model: "chatgpt-4o-latest", // change model if necessary, added dummy value for now
            messages: [
                {role: "system", content: ""}, // Ask Satvik for the prompt for the model

            ],
        });
    }
    catch (e)
    {
        console.error("Error processing journal entry", e);

    }
}
