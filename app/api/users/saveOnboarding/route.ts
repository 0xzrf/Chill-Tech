import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";

export const POST = async (req: NextRequest) => {
    const session = await getServerSession(authConfig);
    
    if (!session?.user?.email) {
        return NextResponse.json({
            msg: "Not authenticated",
            success: false
        });
    }

    const { children } = await req.json();

    try {
        const user = await prisma.parent.findUnique({
            where: {
                email: session.user.email
            }
        });

        if (!user) {
            return NextResponse.json({
                msg: "User not found",
                success: false
            });
        }

        // Create children and their activities
        for (const child of children) {
            const newChild = await prisma.children.create({
                data: {
                    name: child.name,
                    age: child.age,
                    totalPoints: 0,
                    parentId: user.userId,
                    activities: {
                        create: child.activities.map((activity: any) => ({
                            name: activity.name,
                            description: activity.description,
                            points: activity.points,
                            when: new Date(activity.when)
                        }))
                    }
                }
            });
        }

        // Update onboarding status
        await prisma.parent.update({
            where: {
                email: session.user.email
            },
            data: {
                onboarding: false
            }
        });

        return NextResponse.json({
            success: true
        });
    } catch (error) {
        console.error('Error saving onboarding:', error);
        return NextResponse.json({
            msg: "Error saving onboarding data",
            success: false
        });
    }
}
