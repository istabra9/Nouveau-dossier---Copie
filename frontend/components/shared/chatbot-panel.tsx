"use client";

import Link from "next/link";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import {
  ArrowUpRight,
  Bot,
  BrainCircuit,
  Rabbit,
  SendHorizontal,
  User2,
} from "lucide-react";

import { useLocale } from "@/frontend/components/providers/locale-provider";
import { Button } from "@/frontend/components/ui/button";
import { Input } from "@/frontend/components/ui/input";
import { translateTrainingFormat, translateTrainingLevel } from "@/frontend/i18n/helpers";
import type { ChatbotReply, Training } from "@/frontend/types";

type AssistantId = "alexa" | "alex";

type ChatbotPanelProps = {
  recommendations: Training[];
  assistant?: AssistantId;
  className?: string;
};

type Message = {
  id: string;
  role: "assistant" | "user";
  content: string;
  suggestions?: string[];
  recommendedTrainings?: Training[];
};

const assistantStyle: Record<
  AssistantId,
  { accent: string; Icon: typeof Rabbit }
> = {
  alexa: {
    accent: "bg-[linear-gradient(160deg,#c12640_0%,#ff6b6b_55%,#ffb17a_100%)]",
    Icon: Rabbit,
  },
  alex: {
    accent: "bg-[linear-gradient(160deg,#5b1129_0%,#8f1830_50%,#ff8f76_100%)]",
    Icon: BrainCircuit,
  },
};

export function ChatbotPanel({
  recommendations,
  assistant = "alexa",
  className,
}: ChatbotPanelProps) {
  const { locale, messages } = useLocale();
  const style = assistantStyle[assistant];
  const meta = messages.chatbot.bots[assistant];
  const AssistantIcon = style.Icon;
  const [messagesState, setMessagesState] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: meta.bubble,
      suggestions: [...meta.suggestions],
      recommendedTrainings: assistant === "alexa" ? recommendations : [],
    },
  ]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMessagesState((current) => {
      if (!current.length || current[0]?.id !== "welcome") {
        return current;
      }

      return [
        {
          ...current[0],
          content: meta.bubble,
          suggestions: [...meta.suggestions],
          recommendedTrainings: assistant === "alexa" ? recommendations : [],
        },
        ...current.slice(1),
      ];
    });
  }, [assistant, meta.bubble, meta.suggestions, recommendations]);

  const scrollToBottom = useEffectEvent(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  });

  useEffect(() => {
    scrollToBottom();
  }, [messagesState]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();

    if (!trimmed) {
      return;
    }

    setMessagesState((current) => [
      ...current,
      { id: crypto.randomUUID(), role: "user", content: trimmed },
    ]);
    setQuery("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: trimmed, locale, assistant }),
      });

      const payload = (await response.json()) as ChatbotReply & {
        trainings: Training[];
      };

      setMessagesState((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: payload.answer,
          suggestions: payload.suggestions,
          recommendedTrainings: payload.trainings,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      className={`surface-panel relative flex h-full min-h-[560px] flex-col overflow-hidden p-0 ${className ?? ""}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(223,54,72,0.14),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(246,177,127,0.16),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.18),transparent)]" />
      <div className="relative border-b border-white/60 px-5 py-5 sm:px-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-[22px] bg-brand-400/28 blur-xl" />
            <div
              className={`chatbot-orb relative flex h-14 w-14 items-center justify-center rounded-[22px] ${style.accent} text-white shadow-[0_24px_50px_rgba(145,24,47,0.28)]`}
            >
              <div className="absolute inset-[1px] rounded-[21px] border border-white/18" />
              <AssistantIcon className="relative h-5 w-5" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="stat-chip w-fit">
              <Bot className="h-3.5 w-3.5" />
              {meta.role}
            </div>
            <h3 className="font-display text-2xl font-semibold tracking-tight">
              {meta.name}
            </h3>
          </div>
        </div>
      </div>
      <div className="relative flex-1 space-y-4 overflow-y-auto px-5 py-5 sm:px-6">
        {messagesState.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`max-w-[92%] rounded-[28px] p-4 sm:max-w-[88%] ${
                message.role === "assistant"
                  ? "border border-white/70 bg-white/80 shadow-[0_22px_42px_rgba(62,18,23,0.1)]"
                  : "bg-[linear-gradient(135deg,#c12640_0%,#df3648_55%,#ff8f76_100%)] text-white shadow-[0_20px_44px_rgba(190,34,60,0.22)]"
              }`}
            >
              <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em]">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-2xl ${
                    message.role === "assistant"
                      ? "bg-brand-50 text-brand-600"
                      : "bg-white/16 text-white"
                  }`}
                >
                  {message.role === "assistant" ? (
                    <AssistantIcon className="h-4 w-4" />
                  ) : (
                    <User2 className="h-4 w-4" />
                  )}
                </div>
                <span>
                  {message.role === "assistant"
                    ? `${meta.name} | ${meta.role}`
                    : messages.chatbot.roleUser}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6">{message.content}</p>
              {message.suggestions?.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {message.suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => setQuery(suggestion)}
                      className="rounded-full border border-line bg-white/76 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-brand-50"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              ) : null}
              {message.recommendedTrainings?.length ? (
                <div className="mt-4 grid gap-3">
                  {message.recommendedTrainings.map((training) => (
                    <Link
                      key={training.id}
                      href={`/trainings/${training.slug}`}
                      className="group rounded-[22px] border border-line bg-white/74 p-3 text-sm text-foreground transition hover:-translate-y-0.5 hover:border-brand-200 hover:bg-white"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-600">
                            {training.badge}
                          </div>
                          <div className="font-medium">{training.title}</div>
                          <div className="text-xs text-ink-soft">
                            {training.code} |{" "}
                            {translateTrainingLevel(training.level, locale)} |{" "}
                            {translateTrainingFormat(training.format, locale)}
                          </div>
                        </div>
                        <div className="rounded-full bg-brand-50 p-2 text-brand-600 transition group-hover:bg-brand-500 group-hover:text-white">
                          <ArrowUpRight className="h-4 w-4" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        ))}
        {isLoading ? (
          <div className="flex justify-start">
            <div className="rounded-[24px] border border-white/70 bg-white/78 px-4 py-3 text-sm text-ink-soft shadow-[0_18px_34px_rgba(62,18,23,0.08)]">
              {messages.chatbot.loading}
            </div>
          </div>
        ) : null}
        <div ref={bottomRef} />
      </div>
      <div className="relative border-t border-white/60 px-5 py-5 sm:px-6">
        <div className="mb-3 flex flex-wrap gap-2">
          {meta.suggestions.slice(0, 3).map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => setQuery(suggestion)}
              className="rounded-full border border-white/70 bg-white/78 px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-brand-50"
            >
              {suggestion}
            </button>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={messages.chatbot.inputPlaceholder}
            className="rounded-[22px] border-white/65 bg-white/84"
          />
          <Button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="h-12 min-w-[110px] rounded-[22px]"
            aria-label={messages.chatbot.send}
          >
            <SendHorizontal className="h-4 w-4" />
            {messages.chatbot.send}
          </Button>
        </form>
      </div>
    </div>
  );
}
