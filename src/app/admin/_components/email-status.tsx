
'use client';

import { useEffect, useState } from 'react';
import { checkSmtpStatus } from '../_actions/status-actions';
import type { SmtpStatus } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, Loader2, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

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

  const renderStatusBadge = () => {
    if (loading) {
      return (
        <Badge variant="secondary" className="flex items-center gap-1.5 cursor-wait">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Проверка...</span>
        </Badge>
      );
    }

    if (status?.success) {
      return (
        <Badge variant="default" className="flex items-center gap-1.5">
          <Wifi className="h-4 w-4" />
          <span>Свързан</span>
        </Badge>
      );
    }
    
    // Error state
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Badge variant="destructive" className="flex items-center gap-1.5 cursor-pointer">
                    <WifiOff className="h-4 w-4" />
                    <span>Грешка</span>
                </Badge>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <AlertCircle className="h-6 w-6 text-destructive" />
                        Грешка при връзка с имейл сървъра
                    </DialogTitle>
                    <DialogDescription>
                        Възникна проблем при опита за свързване с SMTP сървъра. Подробности за грешката са показани по-долу:
                    </DialogDescription>
                </DialogHeader>
                <div className="mt-4 bg-muted text-muted-foreground p-4 rounded-md text-sm whitespace-pre-wrap break-words">
                    <code>{status?.message || 'Не е налична допълнителна информация за грешката.'}</code>
                </div>
            </DialogContent>
        </Dialog>
    );
  };

  return (
    <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Статус на имейл сървъра:</span>
        {renderStatusBadge()}
    </div>
  );
}
