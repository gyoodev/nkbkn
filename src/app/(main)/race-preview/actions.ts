'use server';

import { generateRacePreview, GenerateRacePreviewInput } from '@/ai/flows/generate-race-preview';
import { z } from 'zod';

const FormSchema = z.object({
  raceName: z.string().min(1),
  trackName: z.string().min(1),
  date: z.string().min(1),
  time: z.string().min(1),
  horseNames: z.string().min(1),
  jockeyNames: z.string().min(1),
  trainerNames: z.string().min(1),
  raceDescription: z.string().optional(),
});

type State = {
  message?: string | null;
  error?: boolean;
  data?: {
    previewText: string;
  } | null;
};

export async function generatePreviewAction(prevState: State, formData: FormData): Promise<State> {
  const validatedFields = FormSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      message: 'Invalid form data.',
      error: true,
    };
  }

  try {
    const { horseNames, jockeyNames, trainerNames, ...rest } = validatedFields.data;

    const input: GenerateRacePreviewInput = {
      ...rest,
      horseNames: horseNames.split(',').map(name => name.trim()).filter(Boolean),
      jockeyNames: jockeyNames.split(',').map(name => name.trim()).filter(Boolean),
      trainerNames: trainerNames.split(',').map(name => name.trim()).filter(Boolean),
    };

    const result = await generateRacePreview(input);
    
    return {
      message: 'Preview generated successfully.',
      error: false,
      data: result,
    };
  } catch (e) {
    return {
      message: e instanceof Error ? e.message : 'An unknown error occurred.',
      error: true,
    };
  }
}
