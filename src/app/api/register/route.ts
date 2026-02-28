import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Registration is not open. Contact the owner to create an account." },
    { status: 403 }
  );
}
