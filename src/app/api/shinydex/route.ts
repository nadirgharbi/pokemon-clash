import { promises as fs } from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "data.json");

async function readData(): Promise<number[]> {
  try {
    const raw = await fs.readFile(DATA_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed.shinies) ? parsed.shinies : [];
  } catch {
    return [];
  }
}

export async function GET() {
  const shinies = await readData();
  return Response.json({ shinies });
}

export async function POST(request: Request) {
  const body = await request.json();
  const shinies: number[] = Array.isArray(body.shinies) ? body.shinies : [];
  await fs.writeFile(DATA_PATH, JSON.stringify({ shinies }, null, 2), "utf-8");
  return Response.json({ shinies });
}
