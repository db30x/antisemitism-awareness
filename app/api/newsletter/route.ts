import { NextResponse } from 'next/server';
import type { NewsletterSubscription } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name } = body;

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Here you would typically save to a database
    const subscription: NewsletterSubscription = {
      email,
      name,
      subscribedAt: new Date(),
    };

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to newsletter',
      data: subscription,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to process subscription' },
      { status: 400 }
    );
  }
} 