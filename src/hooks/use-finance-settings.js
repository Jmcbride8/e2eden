import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export default function useFinanceSettings() {
  return useQuery({
    queryKey: ['admin-finance-settings'],
    queryFn: async () => {
      const [settings] = await base44.entities.FinanceSettings.filter({ key: 'current' }, '-created_date', 1);
      if (!settings) throw new Error('Financial settings are unavailable.');
      return settings;
    },
  });
}