import { handleCreate, handleList } from "../_route-helpers";

export async function GET() {
  return handleList("user");
}

export async function POST(request: Request) {
  return handleCreate(request, "user");
}
