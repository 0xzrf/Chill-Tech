'use client'

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import axios from "axios";
import ChildManagement from "../components/ChildManagement";

interface UserData {
    onboarding: boolean;
    children: Array<{
        name: string;
        age: number;
    }>;
}

export default function Home() {
    const { data: session, status } = useSession();
    const [userData, setUserData] = useState<UserData | null>(null);

    useEffect(() => {
        if (status === "unauthenticated") {
            redirect("/api/auth/signin");
        }

        if (session?.user?.email) {
            fetchUserData();
        }
    }, [session, status]);

    const fetchUserData = async () => {
        try {
            const response = await axios.get("/api/users/getUser");

            if (response.data.success) {
                setUserData(response.data.user);
            } else {
                console.error("Failed to fetch user data");
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    if (status === "loading" || !userData) {
        return <div className="p-6">Loading...</div>;
    }

    return (
        <main className="container mx-auto">
            <ChildManagement 
                onboarding={userData.onboarding} 
                children={userData.children}
            />
        </main>
    );
}
