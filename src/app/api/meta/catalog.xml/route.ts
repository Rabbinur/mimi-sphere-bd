import { NextResponse } from "next/server";

export async function GET() {
  try {
    const backendUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1"}/meta-events/catalog.xml`;
    const res = await fetch(backendUrl, {
      cache: "no-store",
    });

    if (!res.ok) {
      return new Response("Failed to fetch catalog feed", { status: res.status });
    }

    const xmlText = await res.text();
    return new Response(xmlText, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (err: any) {
    return new Response(err.message, { status: 500 });
  }
}
