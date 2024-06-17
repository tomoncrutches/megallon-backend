-- CreateTable
CREATE TABLE "FixedSpentType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" DOUBLE PRECISION,
    "isPerHour" BOOLEAN NOT NULL,

    CONSTRAINT "FixedSpentType_pkey" PRIMARY KEY ("id")
);
