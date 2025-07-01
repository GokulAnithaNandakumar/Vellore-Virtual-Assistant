"use client";
import { Chat } from "./Chat";
import { Message } from "@/types";
import { useEffect, useState } from "react";
import { format } from "date-fns";

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<number>(0); // ms since epoch
  const jwtToken = typeof window !== "undefined" ? localStorage.getItem("jwt") || "" : "";

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let intervalId: NodeJS.Timeout;
    const fetchUpdates = async () => {
      if (!jwtToken) return;
      let url: string;
      if (lastUpdated > 0) {
        let newlastUpdated = lastUpdated + 12;
        url = `http://localhost:8080/chats/history/updates?since=${newlastUpdated}`;
      } else {
        url = "http://localhost:8080/chats/history";
      }
      try {
        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          let allMessages: Message[] = [];
          if (Array.isArray(data)) {
            allMessages = data.flatMap((chat: any) =>
              (chat.messages || []).map((msg: any) => ({
                role: msg.sender === "assistant" ? "assistant" : "user",
                content: msg.content,
                timestamp: typeof msg.timestamp === 'number' ? new Date(msg.timestamp * 1000).toISOString() : msg.timestamp,
              }))
            );
          } else if (Array.isArray(data.messages)) {
            allMessages = data.messages.map((msg: any) => ({
              ...msg,
              timestamp: typeof msg.timestamp === 'number' ? new Date(msg.timestamp * 1000).toISOString() : msg.timestamp,
            }));
          }
          if (allMessages.length > 0) {
            setMessages((prev) => {
              if (lastUpdated === 0) {
                // First load: replace all
                return allMessages;
              } else {
                // Only add new messages (dedupe by timestamp+role+content)
                const prevKeys = new Set(prev.map(m => `${m.timestamp}|${m.role}|${m.content}`));
                const newMessages = allMessages.filter((m) => {
                  const key = `${m.timestamp}|${m.role}|${m.content}`;
                  return !prevKeys.has(key);
                });
                // Remove consecutive duplicate user or assistant messages at the end
                let merged = [...prev];
                for (const msg of newMessages) {
                  const last = merged[merged.length - 1];
                  if (
                    last &&
                    msg.role === last.role &&
                    msg.content === last.content &&
                    msg.timestamp === last.timestamp
                  ) {
                    // skip duplicate consecutive user/assistant
                    continue;
                  }
                  merged.push(msg);
                }
                return merged;
              }
            });
            // Find the latest lastUpdated from the returned chats
            let maxLastUpdated = lastUpdated;
            if (Array.isArray(data)) {
              for (const chat of data) {
                if (chat.lastUpdated && chat.lastUpdated > maxLastUpdated) {
                  maxLastUpdated = chat.lastUpdated;
                }
              }
            }
            setLastUpdated(maxLastUpdated);
          }
        }
      } catch {}
    };
    // Wait 5 seconds before first call, then poll every 5 seconds
    timeoutId = setTimeout(() => {
      fetchUpdates();
      intervalId = setInterval(fetchUpdates, 5000);
    }, 5000);
    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [jwtToken, lastUpdated]);

  const handleSend = async (message: Message) => {
    setMessages((prev) => [...prev, message]);
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/chats/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({ message: message.content }),
      });
      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.content || "" },
        ]);
        // Optionally update lastTimestamp here if backend returns timestamp
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Error: Unable to get response." },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Network error." },
      ]);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-gradient-to-br from-blue-50 to-neutral-100">
    <div className="flex-1 flex">
      <Chat
        messages={messages}
        loading={loading}
        onSend={handleSend}
      />
    </div>
    </div>
  );
}

