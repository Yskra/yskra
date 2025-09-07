import type { Component } from 'vue';

export interface UINotification {
  contentTitle?: string;
  contentText: string;
  icon?: string | Component | 'success' | 'error' | 'info';
  timeout?: number;
}
