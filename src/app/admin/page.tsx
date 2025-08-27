'use client';

import { PageHeader } from '@/components/page-header';

export default function AdminDashboardPage() {
  return (
    <div>
      <PageHeader
        title="Добре дошли в административния панел"
        description="Оттук можете да управлявате съдържанието на уебсайта."
      />
      <div className="mt-8">
        <p>Моля, изберете секция от менюто вляво, за да започнете.</p>
      </div>
    </div>
  );
}
