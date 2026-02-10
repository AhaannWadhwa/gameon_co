
import { NextResponse } from 'next/server';

export async function GET() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  return NextResponse.json({
    clientId,
    length: clientId?.length,
    hasQuotes: clientId?.includes('"') || clientId?.includes("'"),
    firstChar: clientId?.charAt(0),
    lastChar: clientId?.charAt(clientId.length - 1),
    secretPrefix: process.env.GOOGLE_CLIENT_SECRET?.substring(0, 5)
  });
}
