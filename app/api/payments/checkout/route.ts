import { NextResponse } from "next/server";
import { z } from "zod";

import { getCurrentUser } from "@/backend/auth/session";
import { processMockCheckout } from "@/backend/payments/provider";

const schema = z.object({
  trainingSlug: z.string().min(1),
  paymentMethod: z.enum(["card", "bank_transfer", "on_site"]),
});

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { ok: false, message: "Please log in to enroll." },
      { status: 401 },
    );
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: "Invalid checkout request." },
      { status: 400 },
    );
  }

  const result = await processMockCheckout(
    parsed.data.trainingSlug,
    user,
    parsed.data.paymentMethod,
  );
  return NextResponse.json(result, {
    status: result.ok ? 200 : 400,
  });
}
