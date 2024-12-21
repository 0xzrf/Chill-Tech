-- CreateTable
CREATE TABLE "Parent" (
    "userId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "onboarding" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Parent_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Children" (
    "childId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "parentId" TEXT NOT NULL,
    "totalPoints" INTEGER NOT NULL,

    CONSTRAINT "Children_pkey" PRIMARY KEY ("childId")
);

-- CreateTable
CREATE TABLE "Activities" (
    "activityId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "when" TIMESTAMP(3) NOT NULL,
    "points" INTEGER NOT NULL,
    "childrenId" TEXT NOT NULL,

    CONSTRAINT "Activities_pkey" PRIMARY KEY ("activityId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Parent_email_key" ON "Parent"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Activities_childrenId_key" ON "Activities"("childrenId");

-- AddForeignKey
ALTER TABLE "Children" ADD CONSTRAINT "Children_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Parent"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activities" ADD CONSTRAINT "Activities_childrenId_fkey" FOREIGN KEY ("childrenId") REFERENCES "Children"("childId") ON DELETE RESTRICT ON UPDATE CASCADE;
