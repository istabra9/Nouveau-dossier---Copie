import {
  handleDelete,
  handleGetOne,
  handleUpdate,
} from "@/app/api/superadmin/_route-helpers";
import type { Role } from "@/frontend/types";

const allowed: Role[] = ["admin", "super_admin"];

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return handleGetOne(id, "user", allowed);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return handleUpdate(request, id, "user", allowed);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return handleDelete(id, "user", allowed);
}
