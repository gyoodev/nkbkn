
import { PageHeader } from '@/components/page-header';
import { getTrainers } from '@/lib/server/data';
import { TrainersClientPage } from './_components/trainers-client-page';

export const dynamic = 'force-dynamic';

export default async function TrainersPage() {
  const trainers = await getTrainers();

  return <TrainersClientPage trainers={trainers} />;
}
