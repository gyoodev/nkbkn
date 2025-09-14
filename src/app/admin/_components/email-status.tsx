
'use client';

import { useEffect, useState } from 'react';
import { checkSmtpStatus } from '../_actions/status-actions';
import type { SmtpStatus } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, Loader2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function EmailStatus() {
  const [status, setStatus] = useState<SmtpStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      setLoading(true);
      const result = await checkSmtpStatus();
      setStatus(result);
      setLoading(false);
    };

    fetchStatus();
    // Check status every 60 seconds
    const interval = setInterval(fetchStatus, 60000);

    return () => clearInterval(interval);
  }, []);

  const getStatusContent = () => {
    if (loading) {
      return {
        variant: 'secondary',
        icon: <Loader2 className="h-4 w-4 animate-spin" />,
        text: 'Проверка...',
        tooltip: 'Проверка на връзката с имейл сървъра.',
      };
    }
    if (status?.success) {
      return {
        variant: 'default',
        icon: <Wifi className="h-4 w-4" />,
        text: 'Свързан',
        tooltip: status.message,
      };
    }
    return {
      variant: 'destructive',
      icon: <WifiOff className="h-4 w-4" />,
      text: 'Грешка',
      tooltip: status?.message || 'Неуспешно свързване с имейл сървъра.',
    };
  };

  const { variant, icon, text, tooltip } = getStatusContent();

  return (
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger asChild>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Статус на имейл сървъра:</span>
                    <Badge variant={variant} className="flex items-center gap-1.5">
                        {icon}
                        <span>{text}</span>
                    </Badge>
                </div>
            </TooltipTrigger>
            <TooltipContent>
                <p>{tooltip}</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
  );
}
