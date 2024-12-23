import { prisma } from '@/lib/auth';
import ActivityForm from '@/app/components/ActivityForm';
import ActivityList from '@/app/components/ActivityList';
import axios from 'axios';

interface Child {
    childId: string;
    name: string;
    age: number;
    totalPoints: number;
    currentStreak: number;
    longestStreak: number;
    activitiesCompleted: number;
}

export default async function ChildInfo({
  params,
}: {
  params: { childId: string };
}) {
  const child = await prisma.children.findUnique({
    where: { childId: params.childId },
    include: {
      activities: {
        where: {
          completed: false,
          completedAt: null,
        },
        orderBy: {
          when: 'asc',
        },
      },
    },
  });

  // Get all activities that have been interacted with (either completed or marked as not done)
  const recentActivities = await prisma.activities.findMany({
    where: {
      childrenId: params.childId,
      NOT: {
        AND: [
          { completed: false },
          { completedAt: null }
        ]
      }
    },
    orderBy: {
      completedAt: 'desc',
    },
    take: 5,
  });

  if (!child) {
    return <div>Child not found</div>;
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="card p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] opacity-10 rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="relative">
            <h1 className="text-4xl font-bold">{child.name}'s Dashboard</h1>
            <p className="text-[var(--secondary)] mt-2">
              Age: {child.age} years old
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card p-6 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)]">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/10 rounded-lg">
                🏆
              </div>
              <div>
                <h3 className="text-sm font-medium text-white/80">Total Points</h3>
                <p className="text-2xl font-bold text-white mt-1">{child.totalPoints}</p>
              </div>
            </div>
          </div>

          <div className="card p-6 bg-gradient-to-br from-[var(--success)] to-emerald-600">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/10 rounded-lg">
                ✅
              </div>
              <div>
                <h3 className="text-sm font-medium text-white/80">Activities Done</h3>
                <p className="text-2xl font-bold text-white mt-1">{child.activitiesCompleted}</p>
              </div>
            </div>
          </div>

          <div className="card p-6 bg-gradient-to-br from-[var(--accent)] to-amber-600">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/10 rounded-lg">
                🔥
              </div>
              <div>
                <h3 className="text-sm font-medium text-white/80">Current Streak</h3>
                <p className="text-2xl font-bold text-white mt-1">{child.currentStreak} days</p>
              </div>
            </div>
          </div>

          <div className="card p-6 bg-gradient-to-br from-[var(--secondary)] to-slate-600">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/10 rounded-lg">
                ⭐
              </div>
              <div>
                <h3 className="text-sm font-medium text-white/80">Best Streak</h3>
                <p className="text-2xl font-bold text-white mt-1">{child.longestStreak} days</p>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Management Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Add Activity</h2>
              <span className="px-3 py-1 bg-[var(--primary)] bg-opacity-10 text-[var(--primary)] rounded-full text-sm font-medium">
                New
              </span>
            </div>
            <ActivityForm childId={params.childId} />
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Pending Tasks</h2>
              <span className="px-3 py-1 bg-[var(--accent)] bg-opacity-10 text-[var(--accent)] rounded-full text-sm font-medium">
                {child.activities.length} tasks
              </span>
            </div>
            <ActivityList activities={child.activities} childId={params.childId} />
          </div>
        </div>

        {/* Recent Activities Section */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Recent Activities</h2>
            <span className="px-3 py-1 bg-[var(--secondary)] bg-opacity-10 text-white rounded-full text-sm font-medium">
              Last 5 activities
            </span>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div 
                key={activity.activityId} 
                className="card p-4 hover:scale-[1.02] transform transition-transform duration-200"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">{activity.name}</h3>
                    <p className="text-[var(--secondary)]">{activity.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-[var(--secondary)]">
                      <span className="flex items-center">
                        📅 Due: {new Date(activity.when).toLocaleDateString()}
                      </span>
                      <span className="flex items-center">
                        🕒 {new Date(activity.when).toLocaleTimeString()}
                      </span>
                    </div>
                    {activity.completedAt && (
                      <p className="text-sm text-[var(--secondary)]">
                        ✍️ Marked {activity.completed ? 'complete' : 'incomplete'} on {new Date(activity.completedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                      activity.completed 
                        ? 'bg-[var(--success)] bg-opacity-10 text-white' 
                        : 'bg-[var(--error)] bg-opacity-10 text-white'
                    }`}>
                      {activity.completed ? '✓ Completed' : '✗ Not Done'}
                    </span>
                    {activity.completed && (
                      <span className="text-[var(--success)] font-medium">
                        +{activity.points} points
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {recentActivities.length === 0 && (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">🎯</div>
                <p className="text-[var(--secondary)] text-lg">No activities completed yet</p>
                <p className="text-sm text-[var(--secondary)]">Complete some activities to see them here!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
