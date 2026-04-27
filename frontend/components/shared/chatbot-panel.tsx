"use client";

import Link from "next/link";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import {
  ArrowUpRight,
  BrainCircuit,
  Rabbit,
  SendHorizontal,
  User2,
} from "lucide-react";

import { TrainingRecommendationStars } from "@/frontend/components/catalogue/training-recommendation-stars";
import { useLocale } from "@/frontend/components/providers/locale-provider";
import { Button } from "@/frontend/components/ui/button";
import { Input } from "@/frontend/components/ui/input";
import { translateTrainingFormat, translateTrainingLevel } from "@/frontend/i18n/helpers";
import type { ChatbotReply, Training } from "@/frontend/types";
import { cn } from "@/frontend/utils/cn";

export type AssistantId = "alexa" | "alex";

type ChatbotPanelProps = {
  recommendations?: Training[];
  assistant?: AssistantId;
  className?: string;
  userName?: string;
  userAvatar?: string;
};

type Message = {
  id: string;
  role: "assistant" | "user";
  content: string;
  suggestions?: string[];
  recommendedTrainings?: Training[];
};

const assistantStyle = {
  alexa: {
    accent: "bg-[linear-gradient(160deg,#c12640_0%,#ff6b6b_55%,#ffb17a_100%)]",
    Icon: Rabbit,
  },
  alex: {
    accent: "bg-[linear-gradient(160deg,#5b1129_0%,#8f1830_50%,#ff8f76_100%)]",
    Icon: BrainCircuit,
  },
} satisfies Record<
  AssistantId,
  { accent: string; Icon: typeof Rabbit }
>;

function buildInitials(name?: string) {
  if (!name) {
    return "";
  }

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
}

function getViewerAvatarLabel(userName?: string, userAvatar?: string) {
  if (userAvatar && userAvatar.trim().length > 0 && userAvatar.trim().length <= 3) {
    return userAvatar.trim();
  }

  const initials = buildInitials(userName);
  return initials || "ME";
}

export function ChatbotPanel({
  recommendations = [],
  assistant = "alexa",
  className,
  userName,
  userAvatar,
}: ChatbotPanelProps) {
  const { locale, messages } = useLocale();
  const style = assistantStyle[assistant];
  const meta = messages.chatbot.bots[assistant];
  const AssistantIcon = style.Icon;
  const viewerLabel = userName?.split(" ")[0] || messages.chatbot.roleUser;
  const viewerAvatarLabel = getViewerAvatarLabel(userName, userAvatar);
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

  async function submitPrompt(prompt: string) {
    const trimmed = prompt.trim();

    if (!trimmed || isLoading) {
      return;
    }

    setMessagesState((current) => [
      ...current,
      { id: crypto.randomUUID(), role: "user", content: trimmed },
    ]);
    setQuery("");
    setIsLoading(true);

    try {
      const history = messagesState
        .filter((entry) => entry.role === "assistant" || entry.role === "user")
        .slice(-8)
        .map((entry) => ({
          role: entry.role,
          content: entry.content,
        }));

      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: trimmed, locale, assistant, history }),
      });

      if (!response.ok) {
        throw new Error("Chatbot request failed");
      }

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
    } catch {
      setMessagesState((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "fallback" in meta ? meta.fallback : messages.chatbot.canned.generic,
          suggestions: [...meta.suggestions],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await submitPrompt(query);
  }

  const latestAssistantMessage = [...messagesState]
    .reverse()
    .find((message) => message.role === "assistant");
  const composerSuggestions = Array.from(
    new Set([...(latestAssistantMessage?.suggestions ?? []), ...meta.suggestions]),
  ).slice(0, 3);

  return (
    <div
      className={cn(
        "surface-panel-strong ambient-border relative flex h-full min-h-[560px] flex-col overflow-hidden p-0",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(223,54,72,0.14),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(246,177,127,0.16),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.16),transparent)]" />

      <div className="relative border-b border-line px-5 py-5 sm:px-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-[24px] bg-brand-400/24 blur-xl" />
            <div
              className={cn(
                "chatbot-orb relative flex h-[3.75rem] w-[3.75rem] items-center justify-center overflow-hidden rounded-[24px] text-white shadow-[0_22px_48px_rgba(145,24,47,0.28)]",
                style.accent,
              )}
            >
              <div className="absolute inset-[1px] rounded-[23px] border border-white/18" />
              <AssistantIcon className="relative h-5 w-5" />
              <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full border-2 border-white bg-emerald-500" />
            </div>
          </div>
          <div className="min-w-0">
            <h3 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">
              {meta.name}
            </h3>
            <div className="mt-1 flex items-center gap-2 text-sm text-ink-soft">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="truncate">{meta.role}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-5">
        {messagesState.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex items-end gap-3",
              message.role === "assistant" ? "justify-start" : "justify-end",
            )}
          >
            {message.role === "assistant" ? (
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-white shadow-[0_16px_30px_rgba(145,24,47,0.16)]",
                  style.accent,
                )}
              >
                <AssistantIcon className="h-4 w-4" />
              </div>
            ) : null}

            <div
              className={cn(
                "max-w-[82%] space-y-3 sm:max-w-[78%]",
                message.role === "assistant" ? "items-start" : "items-end",
              )}
            >
              <div
                className={cn(
                  "rounded-[26px] px-4 py-3 text-sm leading-6 shadow-[0_16px_30px_rgba(54,19,26,0.08)]",
                  message.role === "assistant"
                    ? "rounded-bl-md border border-line bg-surface-strong text-foreground"
                    : "rounded-br-md bg-[linear-gradient(135deg,#c12640_0%,#df3648_55%,#ff8f76_100%)] text-white",
                )}
              >
                <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-current/70">
                  {message.role === "assistant" ? meta.name : viewerLabel}
                </div>
                <p>{message.content}</p>
              </div>

              {message.suggestions?.length ? (
                <div
                  className={cn(
                    "flex flex-wrap gap-2",
                    message.role === "assistant" ? "justify-start" : "justify-end",
                  )}
                >
                  {message.suggestions.slice(0, 3).map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => void submitPrompt(suggestion)}
                      disabled={isLoading}
                      className="rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              ) : null}

              {message.recommendedTrainings?.length ? (
                <div className="grid gap-3">
                  {message.recommendedTrainings.map((training) => (
                    <Link
                      key={training.id}
                      href={`/trainings/${training.slug}`}
                      className="group rounded-[22px] border border-line bg-surface p-3 text-sm text-foreground transition hover:-translate-y-0.5 hover:border-brand-200 hover:bg-surface-strong"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-600">
                            {training.badge}
                          </div>
                          <div className="font-medium">{training.title}</div>
                          <TrainingRecommendationStars rating={training.rating} size="sm" />
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

            {message.role === "user" ? (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-surface-soft font-semibold text-brand-700 shadow-[0_14px_28px_rgba(145,24,47,0.08)]">
                {viewerAvatarLabel.length <= 3 ? viewerAvatarLabel : <User2 className="h-4 w-4" />}
              </div>
            ) : null}
          </div>
        ))}

        {isLoading ? (
          <div className="flex items-end gap-3">
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-white shadow-[0_16px_30px_rgba(145,24,47,0.16)]",
                style.accent,
              )}
            >
              <AssistantIcon className="h-4 w-4" />
            </div>
            <div className="rounded-[24px] rounded-bl-md border border-line bg-surface-strong px-4 py-3 text-sm text-ink-soft shadow-[0_16px_30px_rgba(54,19,26,0.08)]">
              {meta.name} {messages.chatbot.typing}
            </div>
          </div>
        ) : null}

        <div ref={bottomRef} />
      </div>

      <div className="relative border-t border-line px-4 py-4 sm:px-5">
        <div className="mb-3 flex flex-wrap gap-2">
          {composerSuggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => void submitPrompt(suggestion)}
              disabled={isLoading}
              className="rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {suggestion}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={messages.chatbot.inputPlaceholder}
            className="h-12 rounded-full border-line bg-surface-strong px-5"
          />
          <Button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="h-12 w-12 shrink-0 rounded-full px-0"
            aria-label={messages.chatbot.send}
          >
            <SendHorizontal className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
