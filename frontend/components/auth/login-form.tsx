"use client";

import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import { useActionState, useState } from "react";

import { initialAuthState } from "@/backend/auth/action-state";
import { loginAction } from "@/backend/auth/actions";
import { SocialAuthButtons } from "@/frontend/components/auth/social-auth-buttons";
import { useLocale } from "@/frontend/components/providers/locale-provider";
import { FormSubmitButton } from "@/frontend/components/shared/form-submit-button";
import { Input } from "@/frontend/components/ui/input";
import type { OAuthProvider } from "@/frontend/types";

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut", staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const FLOATING_EMOJIS = [
  { emoji: "✨", top: "8%", left: "6%", delay: 0 },
  { emoji: "🎉", top: "14%", right: "10%", delay: 0.4 },
  { emoji: "🚀", bottom: "12%", left: "8%", delay: 0.8 },
  { emoji: "💫", bottom: "18%", right: "6%", delay: 1.2 },
  { emoji: "🌟", top: "44%", left: "3%", delay: 1.6 },
];

export function LoginForm({
  next,
  oauthError,
  providers,
}: {
  next?: string;
  oauthError?: string;
  providers?: OAuthProvider[];
}) {
  const [state, formAction] = useActionState(loginAction, initialAuthState);
  const { messages } = useLocale();
  const t = messages.auth;
  const [waveHand, setWaveHand] = useState(false);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -4, transition: { duration: 0.3 } }}
      className="surface-panel-strong relative w-full max-w-[560px] overflow-hidden p-8 sm:p-10"
    >
      {/* Animated colorful blobs */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(223,54,72,0.28),transparent_70%)] blur-3xl"
        animate={{ x: [0, 18, 0], y: [0, -10, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(255,143,118,0.28),transparent_70%)] blur-3xl"
        animate={{ x: [0, -16, 0], y: [0, 12, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-1/3 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(246,177,127,0.22),transparent_70%)] blur-3xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating playful emojis */}
      {FLOATING_EMOJIS.map((item, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="pointer-events-none absolute select-none text-2xl opacity-70 sm:text-3xl"
          style={{
            top: item.top,
            left: item.left,
            right: item.right,
            bottom: item.bottom,
          }}
          animate={{
            y: [0, -14, 0],
            rotate: [0, 12, -8, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 4 + i * 0.4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: item.delay,
          }}
        >
          {item.emoji}
        </motion.span>
      ))}

      <motion.div variants={itemVariants} className="relative space-y-3">
        <div className="stat-chip w-fit">
          <span>👋</span>
          {t.loginEyebrow}
        </div>
        <h1 className="flex items-center gap-3 text-4xl font-semibold tracking-tight">
          <span>{t.loginTitle}</span>
          <motion.span
            onHoverStart={() => setWaveHand(true)}
            onHoverEnd={() => setWaveHand(false)}
            animate={
              waveHand
                ? { rotate: [0, -20, 20, -20, 20, 0] }
                : { rotate: [0, 14, -8, 14, -4, 10, 0] }
            }
            transition={{
              duration: waveHand ? 0.6 : 2.4,
              repeat: waveHand ? 0 : Infinity,
              repeatDelay: waveHand ? 0 : 3,
              ease: "easeInOut",
            }}
            style={{ display: "inline-block", transformOrigin: "70% 70%" }}
            className="cursor-pointer"
          >
            👋
          </motion.span>
        </h1>
        <p className="text-sm text-ink-soft">
          {t.loginSubtitle}
        </p>
      </motion.div>

      <SocialAuthButtons mode="login" next={next} providers={providers} />

      <form action={formAction} className="relative mt-8 space-y-4">
        <input type="hidden" name="next" value={next ?? ""} />

        <motion.div variants={itemVariants} className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium">
            <span aria-hidden>📧</span>
            {t.loginEmail}
          </label>
          <motion.div whileFocus={{ scale: 1.01 }} whileHover={{ scale: 1.005 }}>
            <Input
              name="email"
              type="email"
              placeholder={t.loginEmailPlaceholder}
              autoComplete="email"
              required
              className="transition-transform focus:scale-[1.01]"
            />
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium">
            <span aria-hidden>🔒</span>
            {t.loginPassword}
          </label>
          <motion.div whileHover={{ scale: 1.005 }}>
            <Input
              name="password"
              type="password"
              placeholder={t.loginPasswordPlaceholder}
              autoComplete="current-password"
              required
              className="transition-transform focus:scale-[1.01]"
            />
          </motion.div>
        </motion.div>

        {oauthError ? (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 rounded-2xl bg-brand-50 px-4 py-3 text-sm text-brand-700"
          >
            <span>{oauthError}</span>
          </motion.p>
        ) : null}

        {state.status === "error" ? (
          <motion.p
            initial={{ opacity: 0, y: -6, x: 0 }}
            animate={{
              opacity: 1,
              y: 0,
              x: [0, -8, 8, -6, 6, -3, 3, 0],
            }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 rounded-2xl bg-brand-50 px-4 py-3 text-sm text-brand-700"
          >
            <span aria-hidden>😅</span>
            <span>{state.message}</span>
          </motion.p>
        ) : null}

        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
        >
          <FormSubmitButton
            label={`✨ ${t.loginButton}`}
            pendingLabel={`⏳ ${t.loginPending}`}
          />
        </motion.div>
      </form>

      <motion.p variants={itemVariants} className="relative mt-6 text-sm text-ink-soft">
        {t.loginNoAccount}{" "}
        <Link
          href="/register"
          className="group inline-flex items-center gap-1 font-semibold text-brand-600 hover:text-brand-700"
        >
          {t.loginCreateAccount}
          <motion.span
            aria-hidden
            className="inline-block"
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          >
            🎈
          </motion.span>
        </Link>
      </motion.p>
    </motion.div>
  );
}
