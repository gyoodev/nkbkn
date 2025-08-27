'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating race previews for upcoming events.
 *
 * @exports generateRacePreview - An async function that takes race details as input and returns a generated race preview.
 * @exports GenerateRacePreviewInput - The input type for the generateRacePreview function.
 * @exports GenerateRacePreviewOutput - The output type for the generateRacePreview function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRacePreviewInputSchema = z.object({
  raceName: z.string().describe('The name of the race.'),
  trackName: z.string().describe('The name of the race track.'),
  date: z.string().describe('The date of the race (YYYY-MM-DD).'),
  time: z.string().describe('The time of the race (HH:MM).'),
  horseNames: z.array(z.string()).describe('Array of names of the horses participating in the race.'),
  jockeyNames: z.array(z.string()).describe('Array of names of the jockeys riding in the race.'),
  trainerNames: z.array(z.string()).describe('Array of names of the trainers of the horses.'),
  raceDescription: z.string().optional().describe('Optional race description.'),
});
export type GenerateRacePreviewInput = z.infer<typeof GenerateRacePreviewInputSchema>;

const GenerateRacePreviewOutputSchema = z.object({
  previewText: z.string().describe('The generated race preview text.'),
});
export type GenerateRacePreviewOutput = z.infer<typeof GenerateRacePreviewOutputSchema>;

export async function generateRacePreview(input: GenerateRacePreviewInput): Promise<GenerateRacePreviewOutput> {
  return generateRacePreviewFlow(input);
}

const generateRacePreviewPrompt = ai.definePrompt({
  name: 'generateRacePreviewPrompt',
  input: {schema: GenerateRacePreviewInputSchema},
  output: {schema: GenerateRacePreviewOutputSchema},
  prompt: `You are an expert race preview generator for конни надбягвания (horse races) in Bulgaria. Generate an informative and engaging race preview based on the following details:

Race Name: {{{raceName}}}
Track Name: {{{trackName}}}
Date: {{{date}}}
Time: {{{time}}}
Horses: {{#each horseNames}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
Jockeys: {{#each jockeyNames}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
Trainers: {{#each trainerNames}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
Description: {{{raceDescription}}}

Write a compelling preview of the race, highlighting key contenders, track conditions (if known), and any interesting storylines.  The preview should be approximately 200-300 words. Write in Bulgarian.`,
});

const generateRacePreviewFlow = ai.defineFlow(
  {
    name: 'generateRacePreviewFlow',
    inputSchema: GenerateRacePreviewInputSchema,
    outputSchema: GenerateRacePreviewOutputSchema,
  },
  async input => {
    const {output} = await generateRacePreviewPrompt(input);
    return output!;
  }
);
