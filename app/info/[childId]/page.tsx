'use client'

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';

interface Child {
    id: string;
    name: string;
    age: number;
    totalPoints: number;
    currentStreak: number;
    longestStreak: number;
    lastActivityDate: string | null;
    activitiesCompleted: number;
}

export default function ChildInfoPage() {
    const params = useParams();
    const [child, setChild] = useState<Child | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChildInfo = async () => {
            try {
                const response = await axios.get(`/api/users/getChild?childId=${params.childId}`);
                if (response.data.success) {
                    setChild(response.data.child);
                }
            } catch (error) {
                console.error('Error fetching child info:', error);
            } finally {
                setLoading(false);
            }
        };

        if (params.childId) {
            fetchChildInfo();
        }
    }, [params.childId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
        );
    }

    if (!child) {
        return (
            <div className="p-6 text-center text-white">
                <h1 className="text-2xl font-bold">Child not found</h1>
            </div>
        );
    }

    return (
        <div className="p-6">
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

                {/* Recent Activities Section */}
                <div className="bg-white rounded-lg p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activities</h2>
                    <div className="space-y-4">
                        {[...Array(5)].map((_, index) => (
                            <div key={index} className="border-b pb-4 last:border-b-0">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Activity {index + 1}</h3>
                                        <p className="text-gray-600 text-sm">Completed on {new Date().toLocaleDateString()}</p>
                                    </div>
                                    <span className="text-green-500 font-semibold">+{Math.floor(Math.random() * 50)} pts</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
