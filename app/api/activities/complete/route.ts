import { NextResponse } from 'next/server';
import { prisma } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { activityId, childId } = body;
    const now = new Date();

    // Start a transaction to update both activity and child
    const result = await prisma.$transaction(async (tx) => {
      // Get the activity
      const activity = await tx.activities.findUnique({
        where: { activityId },
      });

      if (!activity) {
        throw new Error('Activity not found');
      }

      if (activity.completed) {
        throw new Error('Activity already completed');
      }

      // Update the activity
      const updatedActivity = await tx.activities.update({
        where: { activityId },
        data: { 
          completed: true,
          completedAt: now
        },
      });

      // Update the child's points and stats
      const updatedChild = await tx.children.update({
        where: { childId },
        data: {
          totalPoints: { increment: activity.points },
          activitiesCompleted: { increment: 1 },
          lastActivityDate: now,
        },
      });

      return { activity: updatedActivity, child: updatedChild };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error completing activity:', error);
    return NextResponse.json(
      { error: 'Error completing activity' },
      { status: 500 }
    );
  }
}
