'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Activity {
  activityId: string;
  name: string;
  description: string;
  when: Date;
  points: number;
  completed: boolean;
  completedAt?: Date | null;
}

interface ActivityListProps {
  activities: Activity[];
  childId: string;
}

export default function ActivityList({ activities, childId }: ActivityListProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [hiddenActivities, setHiddenActivities] = useState<Set<string>>(new Set());

  const handleComplete = async (activityId: string) => {
    setLoading(activityId);
    try {
      const response = await fetch('/api/activities/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          activityId,
          childId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to complete activity');
      }

      setHiddenActivities(prev => new Set([...prev, activityId]));
      router.refresh();
    } catch (error) {
      console.error('Error completing activity:', error);
    } finally {
      setLoading(null);
    }
  };

  const handleUncomplete = async (activityId: string) => {
    setLoading(activityId);
    try {
      const response = await fetch('/api/activities/uncomplete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          activityId,
          childId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to uncomplete activity');
      }

      setHiddenActivities(prev => new Set([...prev, activityId]));
      router.refresh();
    } catch (error) {
      console.error('Error uncompleting activity:', error);
    } finally {
      setLoading(null);
    }
  };

  const visibleActivities = activities.filter(
    activity => !hiddenActivities.has(activity.activityId)
  );

  return (
    <div className="space-y-4">
      {visibleActivities.map((activity) => (
        <div
          key={activity.activityId}
          className={`bg-white p-4 rounded-lg shadow border ${
            activity.completed ? 'border-green-200 bg-green-50' : 'border-gray-200'
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg">{activity.name}</h3>
              <p className="text-gray-600">{activity.description}</p>
              <p className="text-sm text-gray-500 mt-1">
                Due: {new Date(activity.when).toLocaleString()}
              </p>
              <p className="text-sm font-medium text-indigo-600 mt-1">
                Points: {activity.points}
              </p>
              {activity.completedAt && (
                <p className="text-sm text-green-600 mt-1">
                  Completed on: {new Date(activity.completedAt).toLocaleString()}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleComplete(activity.activityId)}
                disabled={loading === activity.activityId}
                className={`px-4 py-2 rounded-md text-white ${
                  loading === activity.activityId
                    ? 'bg-gray-400'
                    : 'bg-green-500 hover:bg-green-600'
                }`}
              >
                {loading === activity.activityId ? 'Updating...' : 'Complete'}
              </button>
              <button
                onClick={() => handleUncomplete(activity.activityId)}
                disabled={loading === activity.activityId}
                className={`px-4 py-2 rounded-md text-white ${
                  loading === activity.activityId
                    ? 'bg-gray-400'
                    : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                {loading === activity.activityId ? 'Updating...' : 'Mark as Not Done'}
              </button>
            </div>
          </div>
        </div>
      ))}
      {visibleActivities.length === 0 && (
        <p className="text-gray-500 text-center py-4">No pending activities</p>
      )}
    </div>
  );
}
