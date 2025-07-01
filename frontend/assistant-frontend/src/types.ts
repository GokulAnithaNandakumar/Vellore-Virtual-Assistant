export interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp?: string; // ISO string or undefined for legacy
}
