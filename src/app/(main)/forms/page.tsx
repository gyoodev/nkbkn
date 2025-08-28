
'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

function JockeyForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Формуляр за кандидатстване на жокеи</CardTitle>
        <CardDescription>Моля, попълнете всички полета, за да кандидатствате.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="jockey-first-name">Име</Label>
            <Input id="jockey-first-name" placeholder="Иван" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="jockey-last-name">Фамилия</Label>
            <Input id="jockey-last-name" placeholder="Петров" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="jockey-dob">Дата на раждане</Label>
            <Input id="jockey-dob" type="date" />
          </div>
           <div className="space-y-2">
            <Label htmlFor="jockey-egn">ЕГН</Label>
            <Input id="jockey-egn" placeholder="1234567890" />
          </div>
           <div className="space-y-2">
            <Label htmlFor="jockey-wins">Победи</Label>
            <Input id="jockey-wins" type="number" placeholder="10" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="jockey-address">Адрес</Label>
            <Input id="jockey-address" placeholder="гр. София, ул. Примерна 1" />
          </div>
           <div className="md:col-span-2 flex justify-end">
             <Button type="submit">Изпрати</Button>
           </div>
        </form>
      </CardContent>
    </Card>
  )
}

function TrainerForm() {
  return (
     <Card>
      <CardHeader>
        <CardTitle>Формуляр за кандидатстване на треньори</CardTitle>
        <CardDescription>Моля, попълнете всички полета, за да кандидатствате.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="trainer-first-name">Име</Label>
            <Input id="trainer-first-name" placeholder="Мария" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="trainer-last-name">Фамилия</Label>
            <Input id="trainer-last-name" placeholder="Георгиева" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="trainer-dob">Дата на раждане</Label>
            <Input id="trainer-dob" type="date" />
          </div>
           <div className="space-y-2">
            <Label htmlFor="trainer-egn">ЕГН</Label>
            <Input id="trainer-egn" placeholder="1234567890" />
          </div>
           <div className="space-y-2">
            <Label htmlFor="trainer-wins">Победи</Label>
            <Input id="trainer-wins" type="number" placeholder="25" />
          </div>
           <div className="space-y-2">
            <Label htmlFor="trainer-horses-count">Брой коне</Label>
            <Input id="trainer-horses-count" type="number" placeholder="5" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="trainer-address">Адрес</Label>
            <Input id="trainer-address" placeholder="гр. Пловдив, ул. Примерна 2" />
          </div>
           <div className="md:col-span-2 flex justify-end">
             <Button type="submit">Изпрати</Button>
           </div>
        </form>
      </CardContent>
    </Card>
  )
}

function OwnerForm() {
  return (
    <Card>
        <CardHeader>
            <CardTitle>Формуляр за регистрация на собственици</CardTitle>
            <CardDescription>Попълнете вашите данни за контакт.</CardDescription>
        </CardHeader>
        <CardContent>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="owner-first-name">Име</Label>
                    <Input id="owner-first-name" placeholder="Георги" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="owner-last-name">Фамилия</Label>
                    <Input id="owner-last-name" placeholder="Иванов" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="owner-phone">Телефон</Label>
                    <Input id="owner-phone" type="tel" placeholder="+359 888 123 456" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="owner-email">Имейл</Label>
                    <Input id="owner-email" type="email" placeholder="g.ivanov@example.com" />
                </div>
                 <div className="md:col-span-2 flex justify-end">
                    <Button type="submit">Изпрати</Button>
                </div>
            </form>
        </CardContent>
    </Card>
  )
}

function HorseForm() {
  return (
      <Card>
        <CardHeader>
            <CardTitle>Формуляр за регистрация на коне</CardTitle>
            <CardDescription>Въведете информацията за коня.</CardDescription>
        </CardHeader>
        <CardContent>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="horse-name">Име на коня</Label>
                    <Input id="horse-name" placeholder="Вятър" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="horse-age">Възраст</Label>
                    <Input id="horse-age" type="number" placeholder="4" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="horse-sire">Баща</Label>
                    <Input id="horse-sire" placeholder="Ураган" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="horse-dam">Майка</Label>
                    <Input id="horse-dam" placeholder="Бриза" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="horse-mounts">Участия</Label>
                    <Input id="horse-mounts" type="number" placeholder="15" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="horse-wins">Победи</Label>
                    <Input id="horse-wins" type="number" placeholder="5" />
                </div>
                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="horse-owner">Собственик</Label>
                    <Input id="horse-owner" placeholder="Конюшня Надежда" />
                </div>
                 <div className="md:col-span-2 flex justify-end">
                    <Button type="submit">Изпрати</Button>
                </div>
            </form>
        </CardContent>
    </Card>
  )
}


export default function FormsPage() {

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title="Формуляри за регистрация"
        description="Попълнете и изпратете необходимите формуляри за участие в състезанията."
      />
      <div className="mt-8">
        <Tabs defaultValue="jockeys" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
                <TabsTrigger value="jockeys">Жокеи</TabsTrigger>
                <TabsTrigger value="trainers">Треньори</TabsTrigger>
                <TabsTrigger value="owners">Собственици</TabsTrigger>
                <TabsTrigger value="horses">Коне</TabsTrigger>
            </TabsList>
            <TabsContent value="jockeys" className="mt-6">
                <JockeyForm />
            </TabsContent>
            <TabsContent value="trainers" className="mt-6">
                <TrainerForm />
            </TabsContent>
            <TabsContent value="owners" className="mt-6">
                <OwnerForm />
            </TabsContent>
            <TabsContent value="horses" className="mt-6">
                <HorseForm />
            </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
