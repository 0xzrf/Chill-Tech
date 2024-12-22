'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import axios from 'axios'

interface Child {
    name: string
    age: number
    activities: Activity[]
}

interface Activity {
    name: string
    description: string
    points: number
    when: string
}

export default function Home() {
    const { data: session } = useSession()
    const [isOnboarding, setIsOnboarding] = useState(true)
    const [children, setChildren] = useState<Child[]>([])
    
    // Fetch user data on mount
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get('/api/users/getUser')
                if (response.data.success) {
                    setIsOnboarding(response.data.user.onboarding)
                    if (response.data.user.children) {
                        setChildren(response.data.user.children)
                    }
                }
            } catch (error) {
                console.error('Error fetching user:', error)
            }
        }
        
        if (session?.user?.email) {
            fetchUser()
        }
    }, [session])

    const [newChild, setNewChild] = useState<Child>({
        name: '',
        age: 0,
        activities: []
    })

    const [newActivity, setNewActivity] = useState<Activity>({
        name: '',
        description: '',
        points: 0,
        when: new Date().toISOString().split('T')[0]
    })

    const addActivity = () => {
        if (newActivity.name && newActivity.description && newActivity.points) {
            setNewChild(prev => ({
                ...prev,
                activities: [...prev.activities, newActivity]
            }))
            setNewActivity({
                name: '',
                description: '',
                points: 0,
                when: new Date().toISOString().split('T')[0]
            })
        }
    }

    const addChild = () => {
        if (newChild.name && newChild.age && newChild.activities.length > 0) {
            setChildren(prev => [...prev, newChild])
            setNewChild({
                name: '',
                age: 0,
                activities: []
            })
        }
    }

    const saveOnboarding = async () => {
        try {
            const response = await axios.post('/api/users/saveOnboarding', {
                children
            })
            if (response.data.success) {
                setIsOnboarding(false)
            }
        } catch (error) {
            console.error('Error saving onboarding:', error)
        }
    }

    if (!session) return <div>Please sign in</div>

    if (!isOnboarding) {
        return (
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">Welcome back!</h1>
                {/* Display children and their activities here */}
            </div>
        )
    }

    return (
        <div className="p-8 max-w-4xl mx-auto text-black">
            <h1 className="text-3xl font-bold mb-8">Welcome! Let's set up your children's activities</h1>
            
            <div className="mb-8 p-6 bg-white rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Add a New Child</h2>
                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Child's name"
                        value={newChild.name}
                        onChange={e => setNewChild(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full p-2 border rounded"
                    />
                    <input
                        type="number"
                        placeholder="Age"
                        value={newChild.age || ''}
                        onChange={e => setNewChild(prev => ({ ...prev, age: parseInt(e.target.value) }))}
                        className="w-full p-2 border text-black rounded"
                    />
                    
                    <div className="mt-6">
                        <h3 className="text-lg font-medium mb-3">Add Activities</h3>
                        <div className="space-y-3">
                            <input
                                type="text"
                                placeholder="Activity name"
                                value={newActivity.name}
                                onChange={e => setNewActivity(prev => ({ ...prev, name: e.target.value }))}
                                className="w-full p-2 border rounded"
                            />
                            <input
                                type="text"
                                placeholder="Description"
                                value={newActivity.description}
                                onChange={e => setNewActivity(prev => ({ ...prev, description: e.target.value }))}
                                className="w-full p-2 border rounded"
                            />
                            <input
                                type="number"
                                placeholder="Points"
                                value={newActivity.points || ''}
                                onChange={e => setNewActivity(prev => ({ ...prev, points: parseInt(e.target.value) }))}
                                className="w-full p-2 border rounded"
                            />
                            <input
                                type="date"
                                value={newActivity.when}
                                onChange={e => setNewActivity(prev => ({ ...prev, when: e.target.value }))}
                                className="w-full p-2 border rounded"
                            />
                            <button
                                onClick={addActivity}
                                className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Add Activity
                            </button>
                        </div>
                    </div>

                    {newChild.activities.length > 0 && (
                        <div className="mt-4">
                            <h4 className="font-medium mb-2">Added Activities:</h4>
                            <ul className="list-disc pl-5">
                                {newChild.activities.map((activity, index) => (
                                    <li key={index}>
                                        {activity.name} - {activity.points} points
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <button
                        onClick={addChild}
                        className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600 mt-4"
                    >
                        Add Child
                    </button>
                </div>
            </div>

            {children.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Added Children:</h2>
                    <div className="space-y-4">
                        {children.map((child, index) => (
                            <div key={index} className="p-4 bg-gray-50 rounded">
                                <h3 className="font-medium">{child.name} (Age: {child.age})</h3>
                                <ul className="list-disc pl-5 mt-2">
                                    {child.activities.map((activity, actIndex) => (
                                        <li key={actIndex}>
                                            {activity.name} - {activity.points} points
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {children.length > 0 && (
                <button
                    onClick={saveOnboarding}
                    className="w-full p-3 bg-purple-500 text-white rounded hover:bg-purple-600"
                >
                    Save and Continue
                </button>
            )}
        </div>
    )
}
