import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const upstream = `https://tyradex.vercel.app/api/v1/pokemon/${encodeURIComponent(id)}`;

  const response = await fetch(upstream, { next: { revalidate: 86400 } });

  if (!response.ok) {
    return NextResponse.json(null, { status: response.status });
  }

  const data = await response.json();
  return NextResponse.json(data);
}
