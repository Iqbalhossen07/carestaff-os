"use client";

import { useState } from "react";
import { Download } from "lucide-react";

export function DownloadReportButton({ logs, careHomeName }: { logs: any[], careHomeName: string }) {
  const [downloading, setDownloading] = useState(false);

  const generatePDF = async () => {
    setDownloading(true);
    try {
      // Dynamically import jspdf to avoid SSR issues
      const { jsPDF } = await import("jspdf");
      const autoTable = (await import("jspdf-autotable")).default;

      const doc = new jsPDF();
      
      doc.setFontSize(18);
      doc.text("CQC Clinical Audit Report (eMAR)", 14, 22);
      
      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
      
      if (careHomeName) {
        doc.text(`Facility: ${careHomeName}`, 14, 36);
      }

      const tableColumn = ["Date & Time", "Resident", "Medication", "Status", "Staff"];
      const tableRows: any[][] = [];

      logs.forEach(log => {
        const rowData = [
          new Date(log.timestamp).toLocaleString(),
          `${log.resident.firstName} ${log.resident.lastName}`,
          `${log.medication.name} (${log.medication.dosage})`,
          log.status,
          log.administeredBy.name
        ];
        tableRows.push(rowData);
      });

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 45,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [79, 70, 229] }, // Indigo 600
        alternateRowStyles: { fillColor: [249, 250, 251] }, // Gray 50
      });

      doc.save("cqc-emar-report.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF report.");
    }
    setDownloading(false);
  };

  return (
    <button 
      onClick={generatePDF}
      disabled={downloading}
      className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-70"
    >
      <Download className="w-5 h-5" /> 
      {downloading ? "Generating..." : "Download CQC Report"}
    </button>
  );
}
