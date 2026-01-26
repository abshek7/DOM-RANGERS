import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import type { Notification } from '../models';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications = new BehaviorSubject<Notification[]>([]);
  private notificationCounter = 0;

  constructor() { }

  getNotifications(): Observable<Notification[]> {
    return this.notifications.asObservable();
  }

  addNotification(type: 'success' | 'error' | 'warning' | 'info', title: string, message: string): void {
    const notification: Notification = {
      id: `notif-${this.notificationCounter++}`,
      type,
      title,
      message,
      timestamp: new Date().toISOString(),
      read: false
    };

    const currentNotifications = this.notifications.value;
    this.notifications.next([notification, ...currentNotifications].slice(0, 50)); // Keep only last 50 notifications

    // Auto-remove success notifications after 5 seconds
    if (type === 'success') {
      setTimeout(() => {
        this.removeNotification(notification.id);
      }, 5000);
    }
  }

  removeNotification(id: string): void {
    const currentNotifications = this.notifications.value;
    this.notifications.next(currentNotifications.filter(n => n.id !== id));
  }

  markAsRead(id: string): void {
    const currentNotifications = this.notifications.value;
    this.notifications.next(
      currentNotifications.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }

  markAllAsRead(): void {
    const currentNotifications = this.notifications.value;
    this.notifications.next(currentNotifications.map(n => ({ ...n, read: true })));
  }

  clearAll(): void {
    this.notifications.next([]);
  }

  // Convenience methods
  success(title: string, message: string): void {
    this.addNotification('success', title, message);
  }

  error(title: string, message: string): void {
    this.addNotification('error', title, message);
  }

  warning(title: string, message: string): void {
    this.addNotification('warning', title, message);
  }

  info(title: string, message: string): void {
    this.addNotification('info', title, message);
  }
}
