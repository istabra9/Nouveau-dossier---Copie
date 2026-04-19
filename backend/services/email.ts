import { promises as fs } from "node:fs";
import path from "node:path";

import nodemailer, { type Transporter } from "nodemailer";

import type { SentEmailRecord } from "@/frontend/types";

export type EmailMessage = {
  to: string;
  subject: string;
  body: string;
  html?: string;
  template: string;
  meta?: Record<string, string>;
};

export interface EmailService {
  send(message: EmailMessage): Promise<SentEmailRecord>;
  list(): Promise<SentEmailRecord[]>;
}

const LOG_DIR = path.join(process.cwd(), "backend", "data");
const LOG_FILE = path.join(LOG_DIR, "sent-emails.json");

async function readLog(): Promise<SentEmailRecord[]> {
  try {
    const raw = await fs.readFile(LOG_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as SentEmailRecord[]) : [];
  } catch {
    return [];
  }
}

async function writeLog(entries: SentEmailRecord[]) {
  await fs.mkdir(LOG_DIR, { recursive: true });
  await fs.writeFile(LOG_FILE, JSON.stringify(entries, null, 2), "utf-8");
}

async function persist(record: SentEmailRecord) {
  const log = await readLog();
  log.unshift(record);
  await writeLog(log.slice(0, 500));
}

function newRecord(message: EmailMessage): SentEmailRecord {
  return {
    id: `eml-${crypto.randomUUID().slice(0, 8)}`,
    to: message.to,
    subject: message.subject,
    body: message.body,
    template: message.template,
    meta: message.meta,
    sentAt: new Date().toISOString(),
  };
}

class DevStubEmailService implements EmailService {
  async send(message: EmailMessage): Promise<SentEmailRecord> {
    const record = newRecord(message);
    await persist(record);
    // eslint-disable-next-line no-console
    console.info(
      `[email:dev-stub] -> ${record.to} | ${record.subject}\n${record.body}\n`,
    );
    return record;
  }

  async list(): Promise<SentEmailRecord[]> {
    return readLog();
  }
}

class SmtpEmailService implements EmailService {
  constructor(
    private readonly transporter: Transporter,
    private readonly from: string,
  ) {}

  async send(message: EmailMessage): Promise<SentEmailRecord> {
    const record = newRecord(message);
    try {
      await this.transporter.sendMail({
        from: this.from,
        to: message.to,
        subject: message.subject,
        text: message.body,
        html: message.html ?? message.body,
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(
        `[email:smtp] failed to send to ${record.to}: ${(error as Error).message}`,
      );
      throw error;
    }
    await persist(record);
    return record;
  }

  async list(): Promise<SentEmailRecord[]> {
    return readLog();
  }
}

let instance: EmailService | null = null;

function buildTransporter(): Transporter | null {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  if (!host || !user || !pass) {
    return null;
  }

  const port = Number(process.env.SMTP_PORT ?? "587");
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export function getEmailService(): EmailService {
  if (instance) {
    return instance;
  }

  const transporter = buildTransporter();
  if (transporter) {
    const from =
      process.env.SMTP_FROM ?? `Advancia Trainings <${process.env.SMTP_USER}>`;
    instance = new SmtpEmailService(transporter, from);
    // eslint-disable-next-line no-console
    console.info(`[email] SMTP transport ready (host=${process.env.SMTP_HOST})`);
  } else {
    instance = new DevStubEmailService();
    // eslint-disable-next-line no-console
    console.info(
      "[email] SMTP_HOST/SMTP_USER/SMTP_PASSWORD not set - using dev stub",
    );
  }

  return instance;
}

export function resetEmailServiceForTests() {
  instance = null;
}

// ---------------------------------------------------------------------------
// Template helpers
// ---------------------------------------------------------------------------

export type AcceptanceEmailInput = {
  to: string;
  userName: string;
  trainingTitle: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  trainerName?: string;
  trainerEmail?: string;
  description?: string;
  preparation?: string;
  appUrl?: string;
};

export type ConfirmationEmailInput = {
  to: string;
  userName: string;
  verifyUrl: string;
};

export type RejectionEmailInput = {
  to: string;
  userName: string;
  trainingTitle: string;
  reason?: string;
  appUrl?: string;
};

const shell = (inner: string) => `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#fff5f5;font-family:Inter,Segoe UI,system-ui,sans-serif;color:#1f1316;">
    <div style="max-width:560px;margin:0 auto;padding:32px 16px;">
      <div style="background:linear-gradient(135deg,#df3648,#91182f);color:#fff;padding:24px 28px;border-radius:24px 24px 0 0;">
        <div style="font-size:12px;letter-spacing:0.32em;text-transform:uppercase;opacity:0.85;">Advancia Trainings</div>
        <div style="font-size:22px;font-weight:600;margin-top:6px;">Learn from experts</div>
      </div>
      <div style="background:#ffffff;padding:28px;border:1px solid #fcd3d7;border-top:0;border-radius:0 0 24px 24px;line-height:1.55;">
        ${inner}
      </div>
      <div style="text-align:center;color:#8a5a60;font-size:12px;margin-top:18px;">
        &copy; ${new Date().getFullYear()} Advancia Trainings. All rights reserved.
      </div>
    </div>
  </body>
</html>`;

function row(label: string, value?: string) {
  if (!value) return "";
  return `<tr>
    <td style="padding:6px 0;color:#8a5a60;font-size:12px;text-transform:uppercase;letter-spacing:0.12em;">${label}</td>
    <td style="padding:6px 0;font-weight:600;">${value}</td>
  </tr>`;
}

export function renderConfirmationEmail(input: ConfirmationEmailInput) {
  const subject = "Confirm your Advancia Trainings account";

  const html = shell(`
    <h2 style="margin:0 0 12px;color:#91182f;">Welcome, ${input.userName}!</h2>
    <p style="margin:0 0 12px;">Thanks for signing up to Advancia Trainings. Please confirm your email address so we can secure your account and keep you in the loop.</p>
    <p style="margin:18px 0;">
      <a href="${input.verifyUrl}" style="display:inline-block;background:#df3648;color:#fff;text-decoration:none;padding:12px 22px;border-radius:999px;font-weight:600;">Confirm my email</a>
    </p>
    <p style="margin:10px 0;color:#8a5a60;font-size:13px;">If the button does not work, paste this link into your browser:<br/><span style="word-break:break-all;color:#4a3438;">${input.verifyUrl}</span></p>
    <p style="margin:14px 0 0;color:#8a5a60;font-size:12px;">This confirmation link expires in 24 hours. If you did not create this account, you can safely ignore this email.</p>
  `);

  const body = [
    `Welcome, ${input.userName}!`,
    "",
    "Thanks for signing up to Advancia Trainings. Please confirm your email address by opening the link below:",
    "",
    input.verifyUrl,
    "",
    "This link expires in 24 hours. If you did not create this account, you can ignore this email.",
    "",
    "Advancia Trainings",
  ].join("\n");

  return { subject, html, body };
}

export function renderAcceptanceEmail(input: AcceptanceEmailInput) {
  const subject = `Your enrollment is confirmed: ${input.trainingTitle}`;
  const ctaHref = input.appUrl ?? "http://localhost:3000/dashboard/user";
  const details = `
    <table style="width:100%;border-collapse:collapse;margin:14px 0 18px;">
      ${row("Training", input.trainingTitle)}
      ${row("Start", input.startDate)}
      ${row("End", input.endDate)}
      ${row("Location", input.location)}
      ${row("Trainer", input.trainerName)}
      ${row("Trainer email", input.trainerEmail)}
    </table>
  `;
  const preparation = input.preparation
    ? `<p style="margin:10px 0;"><strong>What to prepare:</strong> ${input.preparation}</p>`
    : "";
  const description = input.description
    ? `<p style="margin:10px 0;color:#4a3438;">${input.description}</p>`
    : "";

  const html = shell(`
    <h2 style="margin:0 0 12px;color:#91182f;">Hello ${input.userName},</h2>
    <p style="margin:0 0 12px;">Great news - your enrollment request has been <strong>accepted</strong>.</p>
    ${description}
    ${details}
    ${preparation}
    <p style="margin:18px 0;">
      <a href="${ctaHref}" style="display:inline-block;background:#df3648;color:#fff;text-decoration:none;padding:12px 22px;border-radius:999px;font-weight:600;">View my training</a>
    </p>
    <p style="margin:10px 0;color:#8a5a60;font-size:13px;">See you soon at Advancia Trainings.</p>
  `);

  const body = [
    `Hello ${input.userName},`,
    "",
    `Your enrollment request for "${input.trainingTitle}" has been accepted.`,
    input.startDate ? `Start: ${input.startDate}` : null,
    input.endDate ? `End: ${input.endDate}` : null,
    input.location ? `Location: ${input.location}` : null,
    input.trainerName ? `Trainer: ${input.trainerName}` : null,
    input.trainerEmail ? `Trainer email: ${input.trainerEmail}` : null,
    input.preparation ? `Preparation: ${input.preparation}` : null,
    "",
    `View your dashboard: ${ctaHref}`,
    "",
    "Advancia Trainings",
  ]
    .filter(Boolean)
    .join("\n");

  return { subject, html, body };
}

export function renderRejectionEmail(input: RejectionEmailInput) {
  const subject = `Update on your enrollment request: ${input.trainingTitle}`;
  const catalogueHref = input.appUrl ?? "http://localhost:3000/trainings";
  const reasonBlock = input.reason
    ? `<p style="margin:12px 0;padding:12px 14px;background:#fff5f5;border-left:3px solid #df3648;border-radius:6px;color:#4a3438;"><em>${input.reason}</em></p>`
    : "";

  const html = shell(`
    <h2 style="margin:0 0 12px;color:#91182f;">Hello ${input.userName},</h2>
    <p style="margin:0 0 12px;">Thank you for your interest in <strong>${input.trainingTitle}</strong>.</p>
    <p style="margin:0 0 12px;">After reviewing your request, we are unable to confirm this enrollment at this time.</p>
    ${reasonBlock}
    <p style="margin:14px 0;">We would love to welcome you to another session - browse our catalogue and find a program that fits.</p>
    <p style="margin:18px 0;">
      <a href="${catalogueHref}" style="display:inline-block;background:#df3648;color:#fff;text-decoration:none;padding:12px 22px;border-radius:999px;font-weight:600;">Browse trainings</a>
    </p>
    <p style="margin:10px 0;color:#8a5a60;font-size:13px;">Warmly, the Advancia Trainings team.</p>
  `);

  const body = [
    `Hello ${input.userName},`,
    "",
    `Thank you for your interest in "${input.trainingTitle}".`,
    "After reviewing your request, we are unable to confirm this enrollment at this time.",
    input.reason ? `Reason: ${input.reason}` : null,
    "",
    `Explore other trainings: ${catalogueHref}`,
    "",
    "Advancia Trainings",
  ]
    .filter(Boolean)
    .join("\n");

  return { subject, html, body };
}
