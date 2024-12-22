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
          OR: [
            { completed: null },
            { completedAt: null }
          ]
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
        OR: [
          { completed: null },
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
    <div className="container mx-auto p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{child.name}'s Dashboard</h1>
          <div className="mt-2 text-gray-600">
            <p>Age: {child.age}</p>
            <p>Total Points: {child.totalPoints}</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-blue-500 text-white rounded-lg p-6">
            <h3 className="text-lg font-semibold">Total Points</h3>
            <p className="text-3xl font-bold mt-2">{child.totalPoints} pts</p>
          </div>
          <div className="bg-green-500 text-white rounded-lg p-6">
            <h3 className="text-lg font-semibold">Activities Completed</h3>
            <p className="text-3xl font-bold mt-2">{child.activitiesCompleted}</p>
          </div>
          <div className="bg-purple-500 text-white rounded-lg p-6">
            <h3 className="text-lg font-semibold">Current Streak</h3>
            <p className="text-3xl font-bold mt-2">{child.currentStreak} days</p>
            <p className="text-sm mt-1">Longest: {child.longestStreak} days</p>
          </div>
        </div>

        {/* Activity Management Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Add New Activity</h2>
            <ActivityForm childId={params.childId} />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">Pending Activities</h2>
            <ActivityList activities={child.activities} childId={params.childId} />
          </div>
        </div>

        {/* Recent Activities Section */}
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activities</h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div 
                key={activity.activityId} 
                className={`border-b pb-4 last:border-b-0 ${
                  activity.completed ? 'bg-green-50' : 'bg-red-50'
                } rounded-lg p-4`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-900">{activity.name}</h3>
                    <p className="text-gray-600 text-sm">{activity.description}</p>
                    <p className="text-gray-500 text-sm">
                      Due: {new Date(activity.when).toLocaleString()}
                    </p>
                    <p className="text-sm mt-1">
                      {activity.completedAt && 
                        `Marked on ${new Date(activity.completedAt).toLocaleString()} as ${
                          activity.completed ? 'Completed' : 'Not Completed'
                        }`
                      }
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`px-4 py-2 rounded-md text-center ${
                      activity.completed 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {activity.completed ? 'Completed ✓' : 'Not Completed ✗'}
                    </span>
                    {activity.completed && (
                      <span className="text-green-600 font-medium mt-2">
                        +{activity.points} pts
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {recentActivities.length === 0 && (
              <p className="text-gray-500 text-center py-4">No recent activities</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
