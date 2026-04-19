"use client";

import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import { useActionState } from "react";

import { initialAuthState } from "@/backend/auth/action-state";
import { loginAction } from "@/backend/auth/actions";
import { useLocale } from "@/frontend/components/providers/locale-provider";
import { FormSubmitButton } from "@/frontend/components/shared/form-submit-button";
import { Input } from "@/frontend/components/ui/input";

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

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction] = useActionState(loginAction, initialAuthState);
  const { messages } = useLocale();
  const t = messages.auth;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="surface-panel-strong relative w-full max-w-[560px] overflow-hidden p-8 sm:p-10"
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(223,54,72,0.22),transparent_70%)] blur-3xl"
        animate={{ x: [0, 18, 0], y: [0, -10, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(255,143,118,0.22),transparent_70%)] blur-3xl"
        animate={{ x: [0, -16, 0], y: [0, 12, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div variants={itemVariants} className="relative space-y-3">
        <div className="stat-chip w-fit">{t.loginEyebrow}</div>
        <h1 className="text-4xl font-semibold tracking-tight">{t.loginTitle}</h1>
      </motion.div>

      <form action={formAction} className="relative mt-8 space-y-4">
        <input type="hidden" name="next" value={next ?? ""} />

        <motion.div variants={itemVariants} className="space-y-2">
          <label className="text-sm font-medium">{t.loginEmail}</label>
          <Input
            name="email"
            type="email"
            placeholder={t.loginEmailPlaceholder}
            autoComplete="email"
            required
          />
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2">
          <label className="text-sm font-medium">{t.loginPassword}</label>
          <Input
            name="password"
            type="password"
            placeholder={t.loginPasswordPlaceholder}
            autoComplete="current-password"
            required
          />
        </motion.div>

        {state.status === "error" ? (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-brand-50 px-4 py-3 text-sm text-brand-700"
          >
            {state.message}
          </motion.p>
        ) : null}

        <motion.div variants={itemVariants}>
          <FormSubmitButton label={t.loginButton} pendingLabel={t.loginPending} />
        </motion.div>
      </form>

      <motion.p variants={itemVariants} className="relative mt-6 text-sm text-ink-soft">
        {t.loginNoAccount}{" "}
        <Link href="/register" className="font-semibold text-brand-600">
          {t.loginCreateAccount}
        </Link>
      </motion.p>
    </motion.div>
  );
}
