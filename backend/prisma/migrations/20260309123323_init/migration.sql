-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cnpj" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "localRaw" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Procurement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pncpControlNumber" TEXT NOT NULL,
    "procurementNumber" TEXT,
    "year" INTEGER,
    "title" TEXT,
    "modalityCode" TEXT,
    "modalityDescription" TEXT,
    "situationCode" TEXT,
    "situationDescription" TEXT,
    "publicationDate" DATETIME,
    "proposalStartDate" DATETIME,
    "proposalEndDate" DATETIME,
    "isOpen" BOOLEAN NOT NULL DEFAULT false,
    "organizationId" TEXT,
    "localRaw" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Procurement_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProcurementDocument" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "procurementId" TEXT NOT NULL,
    "pncpDocumentId" TEXT,
    "documentTypeCode" TEXT,
    "title" TEXT,
    "url" TEXT,
    "localRaw" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ProcurementDocument_procurementId_fkey" FOREIGN KEY ("procurementId") REFERENCES "Procurement" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PriceRegistryAct" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pncpControlNumber" TEXT NOT NULL,
    "organizationCnpj" TEXT,
    "validityStartDate" DATETIME,
    "validityEndDate" DATETIME,
    "objectDescription" TEXT,
    "localRaw" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Contract" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pncpControlNumber" TEXT NOT NULL,
    "contractNumber" TEXT,
    "publicationDate" DATETIME,
    "signedAt" DATETIME,
    "value" REAL,
    "organizationId" TEXT,
    "procurementId" TEXT,
    "localRaw" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Contract_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DomainModality" (
    "code" TEXT NOT NULL PRIMARY KEY,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "DomainJudgmentCriterion" (
    "code" TEXT NOT NULL PRIMARY KEY,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "DomainDisputeMode" (
    "code" TEXT NOT NULL PRIMARY KEY,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "DomainDocumentType" (
    "code" TEXT NOT NULL PRIMARY KEY,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SyncLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "resource" TEXT NOT NULL,
    "startedAt" DATETIME NOT NULL,
    "endedAt" DATETIME,
    "status" TEXT NOT NULL,
    "message" TEXT,
    "lastCursor" TEXT,
    "totalFetched" INTEGER NOT NULL DEFAULT 0,
    "totalSaved" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Organization_cnpj_key" ON "Organization"("cnpj");

-- CreateIndex
CREATE INDEX "Organization_name_idx" ON "Organization"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Procurement_pncpControlNumber_key" ON "Procurement"("pncpControlNumber");

-- CreateIndex
CREATE INDEX "Procurement_publicationDate_idx" ON "Procurement"("publicationDate");

-- CreateIndex
CREATE INDEX "Procurement_modalityCode_idx" ON "Procurement"("modalityCode");

-- CreateIndex
CREATE INDEX "Procurement_situationCode_idx" ON "Procurement"("situationCode");

-- CreateIndex
CREATE INDEX "ProcurementDocument_pncpDocumentId_idx" ON "ProcurementDocument"("pncpDocumentId");

-- CreateIndex
CREATE UNIQUE INDEX "PriceRegistryAct_pncpControlNumber_key" ON "PriceRegistryAct"("pncpControlNumber");

-- CreateIndex
CREATE INDEX "PriceRegistryAct_validityEndDate_idx" ON "PriceRegistryAct"("validityEndDate");

-- CreateIndex
CREATE UNIQUE INDEX "Contract_pncpControlNumber_key" ON "Contract"("pncpControlNumber");

-- CreateIndex
CREATE INDEX "Contract_publicationDate_idx" ON "Contract"("publicationDate");

-- CreateIndex
CREATE INDEX "SyncLog_resource_startedAt_idx" ON "SyncLog"("resource", "startedAt");
