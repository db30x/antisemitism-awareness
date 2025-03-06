import { tweets } from "@/lib/tweets"
import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json(tweets)
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Here you would typically save to a database
    return NextResponse.json({ success: true, data: body });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 400 }
    );
  }
} 