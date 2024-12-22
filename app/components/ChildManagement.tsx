'use client'

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface Child {
    childId?: string;
    name: string;
    age: number;
    totalPoints?: number;
}

interface ChildManagementProps {
    onboarding: boolean;
    children?: Child[];
}

export default function ChildManagement({ onboarding, children = [] }: ChildManagementProps) {
    const [childInputs, setChildInputs] = useState<Child[]>([{ name: '', age: 0 }]);
    const [editingChild, setEditingChild] = useState<Child | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();

    const handleAddChild = () => {
        setChildInputs([...childInputs, { name: '', age: 0 }]);
    };

    const handleInputChange = (index: number, field: keyof Child, value: string | number) => {
        const newInputs = [...childInputs];
        newInputs[index] = { ...newInputs[index], [field]: value };
        setChildInputs(newInputs);
    };

    const handleEditChild = (child: Child) => {
        if (!child) return;
        setEditingChild({
            childId: child.childId,
            name: child.name,
            age: child.age
        });
        setIsEditing(true);
    };

    const handleUpdateChild = async () => {
        if (!editingChild?.childId) return;

        try {
            const updatedChildren = children.map(child => 
                child.childId === editingChild.childId ? editingChild : child
            );

            const response = await axios.post('/api/users/saveChildren', {
                children: updatedChildren
            });

            if (response.data.success) {
                setIsEditing(false);
                setEditingChild(null);
                window.location.reload();
            } else {
                alert('Failed to update child information');
            }
        } catch (error) {
            console.error('Error updating child:', error);
            alert('An error occurred while updating');
        }
    };

    const handleRemoveChild = async (childId: string) => {
        if (!confirm('Are you sure you want to remove this child?')) return;

        try {
            const response = await axios.post('/api/users/removeChild', {
                childId
            });

            if (response.data.success) {
                window.location.reload();
            } else {
                alert('Failed to remove child');
            }
        } catch (error) {
            console.error('Error removing child:', error);
            alert('An error occurred while removing the child');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/users/saveChildren', {
                children: childInputs
            });
            if (response.data.success) {
                window.location.reload();
            } else {
                alert('Failed to save children information');
            }
        } catch (error) {
            console.error('Error saving children:', error);
            alert('An error occurred while saving');
        }
    };

    const handleChildClick = (childId: string) => {
        router.push(`/info/${childId}`);
    };

    if (!onboarding) {
        return (
            <div className="p-6">
                <h2 className="text-2xl text-white font-bold mb-4">Welcome!</h2>
                <div className="space-y-4">
                    <h3 className="text-xl text-white font-semibold">Your Children</h3>
                    {children.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {children.map((child, i) => (
                                <div key={i} onClick={() => handleChildClick(child.childId as string)} className="p-4 border rounded-lg shadow bg-white relative group">
                                    {isEditing && editingChild?.childId === child.childId ? (
                                        <div className="space-y-3">
                                            <input
                                                type="text"
                                                value={editingChild?.name}
                                                onChange={(e) => setEditingChild({
                                                    ...editingChild!,
                                                    name: e.target.value 
                                                })}
                                                className="block w-full text-black rounded-md border-gray-300 shadow-sm"
                                            />
                                            <input
                                                type="number"
                                                value={editingChild?.age}
                                                onChange={(e) => setEditingChild({
                                                    ...editingChild!,
                                                    age: parseInt(e.target.value)
                                                })}
                                                className="block w-full text-black rounded-md border-gray-300 shadow-sm"
                                            />
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={handleUpdateChild}
                                                    className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setIsEditing(false);
                                                        setEditingChild(null);
                                                    }}
                                                    className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div 
                                                className="cursor-pointer"
                                                onClick={() => child.childId && handleChildClick(child.childId)}
                                            >
                                                <p className="font-semibold text-black">{child.name}</p>
                                                <p className="text-gray-600">Age: {child.age}</p>
                                                {child.totalPoints !== undefined && (
                                                    <p className="text-gray-600">Total Points: {child.totalPoints}</p>
                                                )}
                                            </div>
                                            <div className="mt-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-2 right-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEditChild(child);
                                                    }}
                                                    className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        child.childId && handleRemoveChild(child.childId);
                                                    }}
                                                    className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-200">No children added yet.</p>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl text-white font-bold mb-6">Add Your Children</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                {childInputs.map((child, index) => (
                    <div key={index} className="space-y-4 p-4 border rounded-lg bg-gray-800">
                        <div>
                            <label className="block text-sm text-white font-medium">
                                Child {index + 1} Name
                            </label>
                            <input
                                type="text"
                                required
                                value={child.name}
                                onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                                className="mt-1 block w-full text-black rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white">
                                Age
                            </label>
                            <input
                                type="number"
                                required
                                min="0"
                                value={child.age}
                                onChange={(e) => handleInputChange(index, 'age', parseInt(e.target.value))}
                                className="mt-1 block w-full text-black rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>
                    </div>
                ))}
                <div className="space-x-4">
                    <button
                        type="button"
                        onClick={handleAddChild}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                    >
                        Add Another Child
                    </button>
                    <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
}
