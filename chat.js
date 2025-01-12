import express from 'express';
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Endpoint for handling chat requests
app.post('/chat', async (req, res) => {
  const { messages } = req.body;

  // Validate input
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid input. "messages" must be an array.' });
  }

  try {
    // Initiate text streaming with OpenAI API
    const result = streamText({
      model: openai('gpt-4-turbo'),
      messages,
    });

    // Set headers for Server-Sent Events (SSE)
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    });

    // Stream response chunks to the client
    for await (const chunk of result.textStream) {
      res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
    }

    // Signal the end of the stream
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    console.error('Error processing chat request:', error);

    // Send an error response
    if (!res.headersSent) {
      res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
