'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { generatePreviewAction } from '../actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/use-language';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

function SubmitButton() {
    const { pending } = useFormStatus();
    const { text } = useLanguage();
    return (
        <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={pending}>
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {text.generating}
                </>
            ) : (
                text.generate
            )}
        </Button>
    );
}

export function RacePreviewForm() {
    const initialState = { message: null, data: null, error: false };
    const [state, dispatch] = useFormState(generatePreviewAction, initialState);
    const { text } = useLanguage();
    const { toast } = useToast();

    useEffect(() => {
        if (state.message && state.error) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: state.message,
            });
        }
    }, [state, toast]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
                <form action={dispatch}>
                    <CardHeader>
                        <CardTitle>{text.raceDetails}</CardTitle>
                        <CardDescription>{text.raceDetailsDescription}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="raceName">{text.raceName}</Label>
                                <Input id="raceName" name="raceName" required />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="trackName">{text.trackName}</Label>
                                <Input id="trackName" name="trackName" required />
                            </div>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                             <div className="space-y-1.5">
                                <Label htmlFor="date">{text.date}</Label>
                                <Input id="date" name="date" type="date" required />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="time">{text.time}</Label>
                                <Input id="time" name="time" type="time" required />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="horseNames">{text.horseNames}</Label>
                            <Textarea id="horseNames" name="horseNames" required />
                        </div>
                         <div className="space-y-1.5">
                            <Label htmlFor="jockeyNames">{text.jockeyNames}</Label>
                            <Textarea id="jockeyNames" name="jockeyNames" required />
                        </div>
                         <div className="space-y-1.5">
                            <Label htmlFor="trainerNames">{text.trainerNames}</Label>
                            <Textarea id="trainerNames" name="trainerNames" required />
                        </div>
                         <div className="space-y-1.5">
                            <Label htmlFor="raceDescription">{text.raceDescription}</Label>
                            <Textarea id="raceDescription" name="raceDescription" />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <SubmitButton />
                    </CardFooter>
                </form>
            </Card>

            <Card className="flex flex-col">
                 <CardHeader>
                    <CardTitle>{text.generatedPreview}</CardTitle>
                    <CardDescription>{text.generatedPreviewDescription}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                    <div className="h-full rounded-md border bg-muted p-4">
                        {state.data?.previewText ? (
                            <p className="whitespace-pre-wrap">{state.data.previewText}</p>
                        ) : (
                            <p className="text-muted-foreground">{text.noPreviewGenerated}</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}