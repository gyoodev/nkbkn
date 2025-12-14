
'use client';
import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { submitApplication } from '../actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  const { text } = useLanguage();
  return (
    <Button type="submit" className="w-full mt-4" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {pending ? text.sending : text.submitApplication}
    </Button>
  );
}

export function HorseForm() {
    const { toast } = useToast();
    const { text } = useLanguage();
    const formRef = useRef<HTMLFormElement>(null);
    const initialState = { success: false, message: '' };
    const [state, dispatch] = useActionState(submitApplication, initialState);
    
    useEffect(() => {
        if (state.message) {
            toast({
                variant: state.success ? 'default' : 'destructive',
                title: state.success ? 'Успех!' : 'Грешка',
                description: state.message,
            });
             if (state.success) {
                formRef.current?.reset();
            }
        }
    }, [state, toast]);
    
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

    return (
         <form action={dispatch} ref={formRef}>
            <input type="hidden" name="type" value="Кон" />
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5"><Label htmlFor="horse_name">{text.horseName}</Label><Input id="horse_name" name="horse_name" required /></div>
                  <div className="space-y-1.5">
                    <Label htmlFor="gender">{text.gender}</Label>
                    <Select name="gender" required>
                        <SelectTrigger id="gender">
                            <SelectValue placeholder={text.selectGender} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Кобила">{text.mare}</SelectItem>
                            <SelectItem value="Жребец">{text.stallion}</SelectItem>
                            <SelectItem value="Кастрат">{text.gelding}</SelectItem>
                        </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5"><Label htmlFor="passport_number">{text.passportNumber}</Label><Input id="passport_number" name="passport_number" required /></div>
                  <div className="space-y-1.5">
                    <Label htmlFor="age">Година на раждане</Label>
                    <Select name="age" required>
                        <SelectTrigger id="age">
                            <SelectValue placeholder="Изберете година" />
                        </SelectTrigger>
                        <SelectContent>
                            {years.map(year => (
                                <SelectItem key={year} value={String(year)}>{year}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5"><Label htmlFor="sire">{text.sire}</Label><Input id="sire" name="sire" required /></div>
                  <div className="space-y-1.5"><Label htmlFor="dam">{text.dam}</Label><Input id="dam" name="dam" required /></div>
                  <div className="space-y-1.5"><Label htmlFor="mounts">{text.mounts}</Label><Input id="mounts" name="mounts" type="number" defaultValue={0} required /></div>
                  <div className="space-y-1.5"><Label htmlFor="wins">{text.wins}</Label><Input id="wins" name="wins" type="number" defaultValue={0} required /></div>
                  <div className="space-y-1.5 sm:col-span-2"><Label htmlFor="email">{text.ownerContactEmail}</Label><Input id="email" name="email" type="email" required /></div>
                  <div className="space-y-1.5 sm:col-span-2"><Label htmlFor="phone">{text.ownerContactPhone}</Label><Input id="phone" name="phone" required/></div>
              </div>
              <SubmitButton />
            </div>
          </form>
    )
}
