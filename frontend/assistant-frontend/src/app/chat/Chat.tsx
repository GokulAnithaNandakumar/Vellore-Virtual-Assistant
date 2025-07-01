import { Message } from "@/types";
import { ChatInput } from "./ChatInput";
import { ChatLoader } from "./ChatLoader";
import { format } from "date-fns";
import { FC, useEffect, useRef } from "react";

interface Props {
  messages: Message[];
  loading: boolean;
  onSend: (message: Message) => void;
}

export const Chat: FC<Props> = ({ messages, loading, onSend }) => {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col rounded-lg px-2 sm:p-4 sm:border border-neutral-300">
      <div
        ref={listRef}
        className="overflow-y-auto flex flex-col pb-20"
        style={{ scrollBehavior: "smooth" }}
      >
        {messages.map((message, index) => {
          let dateObj: Date | undefined = undefined;
          if (typeof message.timestamp === "string") {
            const asNum = Number(message.timestamp);
            if (!isNaN(asNum) && asNum > 1000000000 && asNum < 99999999999) {
              dateObj = new Date(asNum * 1000);
            } else {
              const d = new Date(message.timestamp);
              if (!isNaN(d.getTime())) dateObj = d;
            }
          } else if (typeof message.timestamp === "number") {
            dateObj = new Date(message.timestamp * 1000);
          }
          const contentHtml = (message.content || "").replace(
            /\*\*(.*?)\*\*/g,
            "<strong>$1</strong>"
          );
          return (
            <div
              key={index}
              className={`my-1 sm:my-1.5 flex flex-col ${
                message.role === "assistant" ? "items-start" : "items-end"
              }`}
            >
              <div
                className={`flex flex-col items-start ${
                  message.role === "assistant"
                    ? "bg-neutral-200 text-neutral-900"
                    : "bg-blue-500 text-white"
                } rounded-2xl px-3 py-2 max-w-[67%] whitespace-pre-wrap`}
                style={{ overflowWrap: "anywhere" }}
              >
                <span className="font-bold text-s text-neutral-700 mb-1">
                  {message.role.toUpperCase()}
                </span>
                <span
                  className="w-full"
                  dangerouslySetInnerHTML={{ __html: contentHtml }}
                />
              </div>
              {dateObj && (
                <span className="text-xs text-neutral-400 mt-1">
                  {format(dateObj, "PPpp")}
                </span>
              )}
            </div>
          );
        })}
        {loading && (
          <div className="my-1 sm:my-1.5">
            <ChatLoader />
          </div>
        )}
      </div>
      <div className="fixed bottom-0 left-0 w-full bg-white shadow-md p-4">
        <ChatInput onSend={onSend} />
      </div>
    </div>
  );
};
