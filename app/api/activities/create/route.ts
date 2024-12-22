import { NextResponse } from 'next/server';
import { prisma } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, when, points, childrenId } = body;

    const activity = await prisma.activities.create({
      data: {
        name,
        description,
        when: new Date(when),
        points,
        childrenId,
      },
    });

    return NextResponse.json(activity);
  } catch (error) {
    console.error('Error creating activity:', error);
    return NextResponse.json(
      { error: 'Error creating activity' },
      { status: 500 }
    );
  }
}
