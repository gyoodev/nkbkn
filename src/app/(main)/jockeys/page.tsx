
import { JockeysClientPage } from './_components/jockeys-client-page';
import { getJockeys } from '@/lib/server/data';

export const dynamic = 'force-dynamic';

export default async function JockeysPage() {
    const jockeys = await getJockeys();

    return <JockeysClientPage jockeys={jockeys} />;
}
