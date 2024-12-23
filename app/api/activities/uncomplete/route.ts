import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/auth';

export async function POST(request: NextRequest, {params}: {params: {childId: string}}) {
  try {
    const body = await request.json();
    const { activityId, childId } = body;

    // Start a transaction to update both activity and child
    const result = await prisma.$transaction(async (tx) => {
      // Get the activity
      const activity = await tx.activities.findUnique({
        where: { activityId },
      });

      if (!activity) {
        throw new Error('Activity not found');
      }

      if (!activity.completed) {
        throw new Error('Activity is not completed');
      }

      // Update the activity
      const updatedActivity = await tx.activities.update({
        where: { activityId },
        data: { 
          completed: false,
          completedAt: null
        },
      });

      // Update the child's points and stats
      const updatedChild = await tx.children.update({
        where: { childId },
        data: {
          totalPoints: { decrement: activity.points },
          activitiesCompleted: { decrement: 1 },
        },
      });

      return { activity: updatedActivity, child: updatedChild };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error uncompleting activity:', error);
    return NextResponse.json(
      { error: 'Error uncompleting activity' },
      { status: 500 }
    );
  }
}
