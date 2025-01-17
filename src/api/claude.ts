import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: import.meta.env.VITE_CLAUDE_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function remixText(text: string): Promise<string[]> {
  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1000,
      temperature: 0.7,
      system: "You are a creative assistant that helps transform text into Twitter-friendly posts. Generate exactly 4 unique variations, each under 280 characters. Format each tweet on a new line, starting with 'Tweet 1:', 'Tweet 2:', etc.",
      messages: [
        {
          role: 'user',
          content: `Create 4 different Twitter-friendly versions of this text:\n\n${text}`,
        },
      ],
    });

    // Parse the response into an array of tweets
    const content = message.content[0].text;
    const tweets = content
      .split(/Tweet \d+:/)
      .filter(tweet => tweet.trim())
      .map(tweet => tweet.trim());
    
    return tweets.slice(0, 4);
  } catch (error) {
    console.error('Error calling Claude API:', error);
    throw new Error('Failed to remix text');
  }
} 