
import { PageHeader } from '@/components/page-header';
import { UsersClientPage } from './_components/users-client-page';
import { getUserProfiles } from '@/lib/server/data';
import type { UserProfile } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  const initialUsers: UserProfile[] = await getUserProfiles();

  return (
    <div>
      <PageHeader
        title="Управление на потребители"
        description="Преглеждайте и управлявайте регистрираните потребители в системата."
      />
      <UsersClientPage initialUsers={initialUsers} />
    </div>
  );
}
