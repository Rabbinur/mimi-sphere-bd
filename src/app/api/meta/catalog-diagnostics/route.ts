import { NextResponse } from "next/server";

export async function GET() {
  try {
    const backendUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1"}/meta-events/catalog-diagnostics`;
    const res = await fetch(backendUrl, {
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json({ success: false, error: "Failed to fetch diagnostics" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
