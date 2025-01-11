// const {Configuration , OpenAIAPI} = require('openai');

// // Configuring the API Client
// const config = new Configuration({
//     apiKey: process.env.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,
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
