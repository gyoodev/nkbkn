
import { PageHeader } from '@/components/page-header';
import { UsersClientPage } from './_components/users-client-page';

export const dynamic = 'force-dynamic';

export default function AdminUsersPage() {
  return (
    <div>
      <PageHeader
        title="Управление на потребители"
        description="Преглеждайте и управлявайте регистрираните потребители в системата."
      />
      <UsersClientPage />
    </div>
  );
}
