
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import * as deepl from 'deepl-node';

const TranslateInputSchema = z.object({
  text: z.string().describe('The text to translate.'),
  targetLang: z.enum(['bg', 'en']).describe('The target language.'),
});

export type TranslateInput = z.infer<typeof TranslateInputSchema>;

export async function translateText(input: TranslateInput): Promise<string | null> {
    return translateFlow(input);
}

const translateFlow = ai.defineFlow(
  {
    name: 'translateFlow',
    inputSchema: TranslateInputSchema,
    outputSchema: z.string().nullable(),
  },
  async ({ text, targetLang }) => {
    if (!process.env.DEEPL_API_KEY) {
      console.error('DEEPL_API_KEY is not set.');
      return `(Translation Disabled: Missing API Key)`;
    }

    try {
      const translator = new deepl.Translator(process.env.DEEPL_API_KEY);
      const result = await translator.translateText(text, 'bg', targetLang);
      return result.text;
    } catch (error) {
      console.error('DeepL Translation Error:', error);
      return `(Translation Error)`;
    }
  }
);
