import { google } from 'google-v3.0.1';
// import { google, VERSION } from 'google-v3.0.0-beta.89';
// import { google } from 'google-v2.0.51';
import { generateText, stepCountIs, tool, gateway as gatewayV3 } from 'ai-v6';
// import { generateText, stepCountIs, tool, gateway as gatewayV3 } from 'ai-v5';
import 'dotenv/config';
import { z } from 'zod';
import { gateway as gatewayV2 } from 'gateway-v2';

const MODEL_NAME='gemini-2.5-flash'

// these work
// const model = google(MODEL_NAME);
// const model = gatewayV2('google/' + MODEL_NAME);

// this fails
const model = gatewayV3('google/' + MODEL_NAME);

async function main() {
  const { text } = await generateText({
    model,
    prompt: 'What is the weather in New York City? ',
    tools: {
      weather: tool({
        description: 'Get the weather in a location',
        inputSchema: z.object({
          location: z.string().describe('The location to get the weather for'),
        }),
        execute: async ({ location }) => {
          console.log('Getting weather for', location);
          return {
            location,
            temperature: 72 + Math.floor(Math.random() * 21) - 10,
          };
        },
      }),
    },
    stopWhen: stepCountIs(5),
  });

  console.log(text);
}

main().catch(console.error);
