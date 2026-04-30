import { getServerUser } from '@/shared/lib/getServerUser';
import { DashboardView } from '@/shared/features/dashboard/components/DashboardView';

export default async function DashboardPage() {
  const user = await getServerUser();

  return <DashboardView user={user!} />;
}
