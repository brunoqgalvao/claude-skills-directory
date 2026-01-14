"use client";

import { useState } from "react";
import ReportModal from "@/components/ReportModal";

interface ActionButtonsProps {
  repoUrl?: string;
  skillId: string;
  skillName: string;
}

export default function ActionButtons({ repoUrl, skillId, skillName }: ActionButtonsProps) {
  const [showReportModal, setShowReportModal] = useState(false);

  const handleFork = () => {
    if (repoUrl) {
      window.open(`${repoUrl}/fork`, "_blank");
    } else {
      alert("Fork functionality requires a repository URL.");
    }
  };

  return (
    <>
      <div className="space-y-2">
        <button
          onClick={handleFork}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg border border-border bg-white hover:border-accent hover:text-accent transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Fork Skill
        </button>
        <button
          onClick={() => setShowReportModal(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg border border-border bg-white hover:border-red-300 hover:text-red-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
          </svg>
          Report Issue
        </button>
      </div>

      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        skillId={skillId}
        skillName={skillName}
      />
    </>
  );
}
