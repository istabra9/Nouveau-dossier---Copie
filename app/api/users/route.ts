import {
  handleCreate,
  handleList,
} from "@/app/api/superadmin/_route-helpers";
import type { Role } from "@/frontend/types";

const allowed: Role[] = ["admin", "super_admin"];

export async function GET() {
  return handleList("user", allowed);
}

export async function POST(request: Request) {
  return handleCreate(request, "user", allowed);
}
