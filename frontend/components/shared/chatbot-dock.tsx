"use client";

import { useEffect, useId, useRef, useState } from "react";
import { BrainCircuit, Rabbit, X } from "lucide-react";

import { useLocale } from "@/frontend/components/providers/locale-provider";
import {
  ChatbotPanel,
  type AssistantId,
} from "@/frontend/components/shared/chatbot-panel";
import type { Training } from "@/frontend/types";
import { cn } from "@/frontend/utils/cn";

type ChatbotDockProps = {
  recommendations?: Training[];
  assistant?: AssistantId;
  userName?: string;
  userAvatar?: string;
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

const EMPTY_RECOMMENDATIONS: Training[] = [];

export function ChatbotDock({
  recommendations = EMPTY_RECOMMENDATIONS,
  assistant = "alexa",
  userName,
  userAvatar,
}: ChatbotDockProps) {
  const { messages } = useLocale();
  const [open, setOpen] = useState(false);
  const [resolvedRecommendations, setResolvedRecommendations] = useState(recommendations);
  const [hasLoadedRecommendations, setHasLoadedRecommendations] = useState(
    recommendations.length > 0 || assistant !== "alexa",
  );
  const panelId = useId();
  const dockRef = useRef<HTMLDivElement | null>(null);
  const meta = messages.chatbot.bots[assistant];
  const style = assistantStyle[assistant];
  const AssistantIcon = style.Icon;

  useEffect(() => {
    setResolvedRecommendations(recommendations);
    setHasLoadedRecommendations(recommendations.length > 0 || assistant !== "alexa");
  }, [assistant, recommendations]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    function handlePointerDown(event: PointerEvent) {
      if (!dockRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("pointerdown", handlePointerDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [open]);

  useEffect(() => {
    if (!open || assistant !== "alexa" || hasLoadedRecommendations) {
      return;
    }

    let cancelled = false;

    async function loadRecommendations() {
      try {
        const response = await fetch(`/api/chatbot?assistant=${assistant}`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Recommendation request failed");
        }

        const payload = (await response.json()) as { trainings?: Training[] };

        if (!cancelled) {
          setResolvedRecommendations(payload.trainings ?? []);
        }
      } catch {
        if (!cancelled) {
          setResolvedRecommendations([]);
        }
      } finally {
        if (!cancelled) {
          setHasLoadedRecommendations(true);
        }
      }
    }

    void loadRecommendations();

    return () => {
      cancelled = true;
    };
  }, [assistant, hasLoadedRecommendations, open]);

  return (
    <div
      ref={dockRef}
      className="pointer-events-none fixed bottom-4 right-4 z-[60] flex max-w-[calc(100vw-1rem)] flex-col items-end gap-3 sm:bottom-5 sm:right-5"
    >
      {open ? (
        <div
          id={panelId}
          role="dialog"
          aria-label={`Chat with ${meta.name}`}
          className="pointer-events-auto relative w-[min(100vw-2rem,390px)]"
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface-strong text-foreground shadow-[0_14px_28px_rgba(54,19,26,0.16)] backdrop-blur-md hover:bg-surface"
            aria-label="Close chat"
          >
            <X className="h-4 w-4" />
          </button>
          <ChatbotPanel
            recommendations={resolvedRecommendations}
            assistant={assistant}
            userName={userName}
            userAvatar={userAvatar}
            className="h-[min(68vh,620px)] min-h-[520px] w-full shadow-[0_34px_90px_rgba(50,16,22,0.22)]"
          />
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="pointer-events-auto group relative flex h-14 w-14 items-center justify-center rounded-full border border-line/80 bg-surface-strong/95 text-start shadow-[0_18px_40px_rgba(49,14,20,0.18)] backdrop-blur-xl transition hover:-translate-y-0.5"
        aria-label={`${open ? "Close" : "Open"} chat with ${meta.name}`}
        aria-expanded={open}
        aria-controls={panelId}
        aria-haspopup="dialog"
      >
        <div className="absolute inset-0 rounded-full bg-brand-400/18 blur-xl transition group-hover:bg-brand-400/24" />
        <div className="relative">
          <div
            className={cn(
              "chatbot-orb relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-[20px] text-white shadow-[0_20px_46px_rgba(145,24,47,0.24)]",
              style.accent,
            )}
          >
            <div className="absolute inset-[1px] rounded-[19px] border border-white/18" />
            <AssistantIcon className="relative h-5 w-5" />
            <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full border-2 border-white bg-emerald-500" />
          </div>
        </div>
        <span className="absolute -bottom-1 -right-1 inline-flex min-w-[1.55rem] items-center justify-center rounded-full border border-background bg-brand-500 px-1.5 py-0.5 text-[9px] font-bold uppercase leading-none text-white shadow-[0_8px_18px_rgba(190,34,60,0.32)]">
          AI
        </span>
        <span className="sr-only">{messages.chatbot.title}</span>
      </button>
    </div>
  );
}
