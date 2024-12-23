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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h2 className="text-3xl font-bold mb-8">Welcome to Chill Tech!</h2>
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-semibold">Your Children</h3>
                        <button
                            onClick={() => setIsEditing(false)}
                            className="btn btn-primary"
                        >
                            + Add Child
                        </button>
                    </div>
                    
                    {children.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {children.map((child, i) => (
                                <div 
                                    key={i} 
                                    className="card p-6 relative group cursor-pointer hover:scale-[1.02] transform"
                                >
                                    {isEditing && editingChild?.childId === child.childId ? (
                                        <div className="space-y-4">
                                            <input
                                                type="text"
                                                value={editingChild?.name}
                                                onChange={(e) => setEditingChild({
                                                    ...editingChild!,
                                                    name: e.target.value 
                                                })}
                                                className="input"
                                                placeholder="Child's name"
                                            />
                                            <input
                                                type="number"
                                                value={editingChild?.age}
                                                onChange={(e) => setEditingChild({
                                                    ...editingChild!,
                                                    age: parseInt(e.target.value)
                                                })}
                                                className="input"
                                                placeholder="Age"
                                                min="0"
                                            />
                                            <div className="flex space-x-3">
                                                <button
                                                    onClick={handleUpdateChild}
                                                    className="btn btn-primary flex-1"
                                                >
                                                    Save Changes
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setIsEditing(false);
                                                        setEditingChild(null);
                                                    }}
                                                    className="btn btn-secondary flex-1"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div 
                                                onClick={() => child.childId && handleChildClick(child.childId)}
                                                className="space-y-2"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <h4 className="text-xl font-semibold">{child.name}</h4>
                                                    {child.totalPoints !== undefined && (
                                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[var(--accent)] text-white">
                                                            {child.totalPoints} Points
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-[var(--secondary)]">Age: {child.age}</p>
                                            </div>
                                            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEditChild(child);
                                                    }}
                                                    className="btn btn-secondary p-2"
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        child.childId && handleRemoveChild(child.childId);
                                                    }}
                                                    className="btn btn-secondary p-2 hover:bg-[var(--error)]"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-[var(--card)] rounded-xl">
                            <p className="text-lg text-[var(--secondary)]">No children added yet.</p>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="btn btn-primary mt-4"
                            >
                                Add Your First Child
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h2 className="text-3xl font-bold mb-8">Add Your Children</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                {childInputs.map((child, index) => (
                    <div key={index} className="card p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium">Child {index + 1}</h3>
                            {index > 0 && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newInputs = childInputs.filter((_, i) => i !== index);
                                        setChildInputs(newInputs);
                                    }}
                                    className="text-[var(--error)] hover:opacity-80"
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Name
                            </label>
                            <input
                                type="text"
                                required
                                value={child.name}
                                onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                                className="input"
                                placeholder="Enter child's name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Age
                            </label>
                            <input
                                type="number"
                                required
                                min="0"
                                value={child.age}
                                onChange={(e) => handleInputChange(index, 'age', parseInt(e.target.value))}
                                className="input"
                                placeholder="Enter child's age"
                            />
                        </div>
                    </div>
                ))}
                <div className="flex items-center space-x-4 pt-4">
                    <button
                        type="button"
                        onClick={handleAddChild}
                        className="btn btn-secondary"
                    >
                        + Add Another Child
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary"
                    >
                        Save All Changes
                    </button>
                </div>
            </form>
        </div>
    );
}
