
'use client';

import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { upsertRaceEvent } from '../actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import type { Race, RaceEvent } from '@/lib/types';
import { Loader2, PlusCircle, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {isEditing ? 'Запазване...' : 'Създаване...'}
        </>
      ) : (
        isEditing ? 'Запази промените' : 'Добави събитие'
      )}
    </Button>
  );
}

export function EventForm({ event, trackNames }: { event?: RaceEvent, trackNames: string[] }) {
  const isEditing = !!event;
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useActionState(upsertRaceEvent, initialState);
  const [races, setRaces] = useState<Partial<Race>[]>(event?.races || [{ name: '', time: '', participants: 0 }]);

  const addRace = () => {
    setRaces([...races, { name: '', time: '', participants: 0 }]);
  };

  const removeRace = (index: number) => {
    setRaces(races.filter((_, i) => i !== index));
  };
  
  const handleRaceChange = (index: number, field: keyof Race, value: any) => {
    const newRaces = [...races];
    newRaces[index] = { ...newRaces[index], [field]: value };
    setRaces(newRaces);
  };

  return (
    <form action={dispatch}>
      <input type="hidden" name="id" value={event?.id} />
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? 'Редактирай събитие' : 'Ново събитие'}</CardTitle>
          <CardDescription>Въведете основна информация за състезателния ден.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-1">
                <Label htmlFor="date">Дата</Label>
                <Input id="date" name="date" type="date" defaultValue={event?.date ? new Date(event.date).toISOString().split('T')[0] : ''} />
                {state.errors?.date && <p className="text-sm font-medium text-destructive">{state.errors.date}</p>}
            </div>
             <div className="space-y-1">
                <Label htmlFor="track">Хиподрум</Label>
                <Select name="track" defaultValue={event?.track}>
                    <SelectTrigger>
                        <SelectValue placeholder="Изберете хиподрум" />
                    </SelectTrigger>
                    <SelectContent>
                        {trackNames.map(name => <SelectItem key={name} value={name}>{name}</SelectItem>)}
                    </SelectContent>
                </Select>
                 {state.errors?.track && <p className="text-sm font-medium text-destructive">{state.errors.track}</p>}
            </div>
          </div>

          <Separator className="my-6" />

          <div>
             <CardTitle className="text-lg">Състезания</CardTitle>
             <CardDescription className="mb-4">Добавете състезанията за този ден.</CardDescription>
             <div className="space-y-4">
                {races.map((race, index) => (
                    <div key={index} className="flex flex-col md:flex-row gap-2 items-start rounded-lg border p-4 relative">
                        <input type="hidden" name={`race-id-${index}`} value={race.id || ''} />
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-grow w-full">
                            <div className="space-y-1">
                                <Label htmlFor={`race-name-${index}`}>Име</Label>
                                <Input 
                                    id={`race-name-${index}`}
                                    name={`race-name-${index}`} 
                                    value={race.name}
                                    onChange={(e) => handleRaceChange(index, 'name', e.target.value)} 
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor={`race-time-${index}`}>Час</Label>
                                <Input 
                                    id={`race-time-${index}`}
                                    name={`race-time-${index}`}
                                    type="time" 
                                    value={race.time}
                                    onChange={(e) => handleRaceChange(index, 'time', e.target.value)} 
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor={`race-participants-${index}`}>Участници</Label>
                                <Input
                                    id={`race-participants-${index}`}
                                    name={`race-participants-${index}`} 
                                    type="number" 
                                    value={race.participants}
                                    onChange={(e) => handleRaceChange(index, 'participants', e.target.value)} 
                                />
                            </div>
                        </div>
                         <Button variant="ghost" size="icon" onClick={() => removeRace(index)} className="md:mt-6">
                            <Trash2 className="h-4 w-4 text-destructive"/>
                        </Button>
                    </div>
                ))}
                {state.errors?.races && <p className="text-sm font-medium text-destructive">{JSON.stringify(state.errors.races)}</p>}
             </div>
              <Button variant="outline" size="sm" onClick={addRace} type="button" className="mt-4">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Добави състезание
              </Button>
          </div>

        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href="/admin/calendar">Отказ</Link>
          </Button>
          <SubmitButton isEditing={isEditing} />
        </CardFooter>
      </Card>
      {state.message && <p className="mt-4 text-sm font-medium text-destructive">{state.message}</p>}
    </form>
  );
}
