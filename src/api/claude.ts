import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: import.meta.env.VITE_CLAUDE_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function remixText(text: string): Promise<string> {
  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1000,
      temperature: 0.7,
      system: "You are a creative assistant that helps remix and transform text in interesting ways.",
      messages: [
        {
          role: 'user',
          content: `Please remix the following text in a creative and interesting way:\n\n${text}`,
        },
      ],
    });

    return message.content[0].text;
  } catch (error) {
    console.error('Error calling Claude API:', error);
    throw new Error('Failed to remix text');
  }
} 