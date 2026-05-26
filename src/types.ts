/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SourceFile {
  name: string;
  path: string;
  language: "python" | "sql" | "bash" | "dockerfile" | "markdown" | "json";
  content: string;
  description: string;
}

export interface MetricCard {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "flat";
  suffix?: string;
}

export interface SandboxMessage {
  id: string;
  sender: "user" | "bot" | "user-simulated-referral" | "system";
  text: string;
  timestamp: string;
  type?: "text" | "interactive-stars-payment" | "premium-upgrade-success" | "affiliate-conversion";
  payload?: any;
}

export interface AffiliateOffer {
  id: string;
  title: string;
  category: "AI Tool" | "Side Hustle" | "Crypto" | "Passive Income";
  payoutRate: string;
  network: "Impact" | "WarriorPlus" | "ClickBank" | "Direct Partner";
  description: string;
  targetAudience: string;
  customAffiliateLink: string;
  conversionRate: string;
}

export interface SchedulerTask {
  id: string;
  platform: "TikTok" | "Instagram Reels" | "YouTube Shorts" | "Telegram Broadcast";
  title: string;
  scheduledTime: string;
  status: "pending" | "published" | "generating" | "failed";
  aiPromptUsed: string;
  draftContent: string;
}
