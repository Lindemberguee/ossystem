// components/Notification.tsx
import {  useEffect } from 'react';
import { Alert } from 'antd';

interface NotificationProps {
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  visible: boolean;
  onClose: () => void;
}

export default function Notification({ message, type, visible, onClose }: NotificationProps) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000); // Notificação desaparece após 5 segundos
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 1000 }}>
      <Alert message={message} type={type} showIcon closable onClose={onClose} />
    </div>
  );
}
