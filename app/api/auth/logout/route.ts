import { NextResponse } from 'next/server'

export async function POST() {
  // JWT is stateless — client just drops the token
  return NextResponse.json({ message: 'Logged out successfully' })
}