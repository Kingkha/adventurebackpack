import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/auth';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { provider } = await req.json();

    // Get all accounts for the user
    const accounts = await prisma.account.findMany({
      where: { userId: session.user.id }
    });

    // Don't allow unlinking if user only has one provider
    if (accounts.length <= 1) {
      return NextResponse.json(
        { error: 'Cannot unlink the only authentication method' },
        { status: 400 }
      );
    }

    // Verify the account exists before trying to delete
    const accountExists = accounts.some(account => account.provider === provider);
    if (!accountExists) {
      return NextResponse.json(
        { error: 'Account not linked' },
        { status: 404 }
      );
    }

    // Delete the account
    await prisma.account.deleteMany({
      where: {
        userId: session.user.id,
        provider: provider
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unlink error:', error);
    return NextResponse.json(
      { error: 'Failed to unlink account' },
      { status: 500 }
    );
  }
} 