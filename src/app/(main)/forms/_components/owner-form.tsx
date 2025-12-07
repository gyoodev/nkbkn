
'use client';
import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

export function OwnerForm() {
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

    return (
         <form action={dispatch} ref={formRef}>
            <input type="hidden" name="type" value="Собственик" />
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5"><Label htmlFor="first_name">{text.firstName}</Label><Input id="first_name" name="first_name" required /></div>
                  <div className="space-y-1.5"><Label htmlFor="last_name">{text.lastName}</Label><Input id="last_name" name="last_name" required /></div>
                  <div className="space-y-1.5"><Label htmlFor="date_of_birth">{text.dateOfBirth}</Label><Input id="date_of_birth" name="date_of_birth" type="date" required /></div>
                  <div className="space-y-1.5"><Label htmlFor="egn">{text.egn}</Label><Input id="egn" name="egn" required /></div>
                  <div className="space-y-1.5 sm:col-span-2"><Label htmlFor="address">{text.address}</Label><Input id="address" name="address" required /></div>
                  <div className="space-y-1.5"><Label htmlFor="email">{text.contactEmail}</Label><Input id="email" name="email" type="email" required /></div>
                  <div className="space-y-1.5"><Label htmlFor="phone">{text.contactPhone}</Label><Input id="phone" name="phone" required/></div>
                  <div className="space-y-1.5"><Label htmlFor="horse_count">{text.horseCount}</Label><Input id="horse_count" name="horse_count" type="number" defaultValue={0} required /></div>
              </div>
              <SubmitButton />
            </div>
          </form>
    )
}
