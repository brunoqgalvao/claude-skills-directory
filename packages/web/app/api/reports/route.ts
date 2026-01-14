import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const REPORTS_FILE = path.join(process.cwd(), "data", "reports.json");

export interface Report {
  id: string;
  skillId: string;
  skillName: string;
  reason: string;
  description: string;
  email?: string;
  status: "pending" | "reviewed" | "resolved" | "dismissed";
  createdAt: string;
  updatedAt: string;
}

async function getReports(): Promise<Report[]> {
  try {
    const data = await fs.readFile(REPORTS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveReports(reports: Report[]): Promise<void> {
  await fs.writeFile(REPORTS_FILE, JSON.stringify(reports, null, 2));
}

// GET /api/reports - List all reports (for admin)
export async function GET() {
  const reports = await getReports();
  return NextResponse.json(reports);
}

// POST /api/reports - Create a new report
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { skillId, skillName, reason, description, email } = body;

    if (!skillId || !reason || !description) {
      return NextResponse.json(
        { error: "Missing required fields: skillId, reason, description" },
        { status: 400 }
      );
    }

    const reports = await getReports();

    const newReport: Report = {
      id: `report-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      skillId,
      skillName: skillName || skillId,
      reason,
      description,
      email: email || undefined,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    reports.push(newReport);
    await saveReports(reports);

    return NextResponse.json(
      { success: true, reportId: newReport.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating report:", error);
    return NextResponse.json(
      { error: "Failed to create report" },
      { status: 500 }
    );
  }
}
