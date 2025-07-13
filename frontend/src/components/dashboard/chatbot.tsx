import React, { useState } from 'react';
import jsPDF from 'jspdf';
import { marked } from 'marked';
import { convert } from 'html-to-text';

import '../../components_css/dashboard_css/chatbot.css';
import ChatbotImage from '../dashboard/chatBot.png';
import PdfImage from '../dashboard/report.png';
import RawDataImage from '../dashboard/rawdata.png';

export const DashboardChatbotTile: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleReport = async () => {
    try {
      setLoading(true);

      // 1. Trigger backend pipeline to run Python scripts
      const pipelineRes = await fetch('http://localhost:3000/api/pipeline/report', {
        method: 'POST',
      });

      if (!pipelineRes.ok) {
        throw new Error('Failed to start report pipeline');
      }

      // 2. Optionally, poll for pipeline completion
      //    Here, we simply wait a fixed interval, but you can implement polling for status
      //    Adjust the timeout as per your backend pipeline duration
      await new Promise((resolve) => setTimeout(resolve, 8000));

      // 3. Fetch both markdown reports using fetch API
      const [prereportRes, cleanedreportRes] = await Promise.all([
        fetch('http://localhost:3000/api/prereport/latest'),
        fetch('http://localhost:3000/api/cleanedreport/latest'),
      ]);

      if (!prereportRes.ok || !cleanedreportRes.ok) {
        throw new Error('Failed to fetch report data');
      }

      const prereportData = await prereportRes.json();
      const cleanedreportData = await cleanedreportRes.json();

      // Extract markdown strings
      const prereportMarkdown = prereportData.data || '';
      const cleanedreportMarkdown = cleanedreportData.data || '';

      // Await markdown parsing if marked.parse returns a Promise
      const prereportHtml = await marked.parse(prereportMarkdown);
      const cleanedreportHtml = await marked.parse(cleanedreportMarkdown);

      // Convert HTML to plain text
      const options = { wordwrap: 130 };
      const prereportText = convert(prereportHtml, options);
      const cleanedreportText = convert(cleanedreportHtml, options);

      // Helper to generate a paginated PDF for a section
      const generatePdf = (title: string, text: string, filename: string) => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth() - 20; // 10pt margin on each side
        const pageHeight = doc.internal.pageSize.getHeight();
        const lineHeight = 7;
        const marginTop = 20;

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.text(title, 10, marginTop);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);

        let lines = doc.splitTextToSize(text, pageWidth);
        let currentY = marginTop + 10;

        lines.forEach((line: string) => {
          if (currentY > pageHeight - 10) {
            doc.addPage();
            currentY = marginTop;
          }
          doc.text(line, 10, currentY);
          currentY += lineHeight;
        });

        doc.save(filename);
      };

      // Generate and download Prereport PDF
      generatePdf('Prereport', prereportText, 'prereport.pdf');

      // Generate and download Cleaned Report PDF
      generatePdf('Cleaned Report', cleanedreportText, 'cleanedreport.pdf');
    } catch (error) {
      alert('Failed to generate report. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChat = () => (window.location.href = '/chatbot');
  const handleDownload = () => (window.location.href = '/download-raw');

  return (
    <div className="chatbot-card">
      <div className="chatbot-title">Actions</div>

      <div
        className="chatbot-section chatbot-section-hover"
        onClick={handleChat}
        tabIndex={0}
      >
        <div className="chatbot-section-content">
          <img src={ChatbotImage} alt="Chatbot" className="chatbot-section-img" />
          <div className="chatbot-section-text">Ask our chatbot your questions</div>
        </div>
      </div>

      <div className="chatbot-divider" />

      <div
        className="chatbot-section chatbot-section-hover"
        onClick={handleDownload}
        tabIndex={0}
      >
        <div className="chatbot-section-content reverse">
          <div className="chatbot-section-text">Download raw scrapped data</div>
          <img src={RawDataImage} alt="Raw Data" className="chatbot-section-img" />
        </div>
      </div>

      <div className="chatbot-divider" />

      <div
        className="chatbot-section chatbot-section-hover"
        onClick={handleReport}
        tabIndex={0}
        style={{ position: 'relative' }}
      >
        <div className="chatbot-section-content">
          <img src={PdfImage} alt="PDF Report" className="chatbot-section-img" />
          <div className="chatbot-section-text">Download detailed report</div>
        </div>
        {loading && (
          <div className="chatbot-loading-overlay">
            <div className="chatbot-spinner" />
            <span className="chatbot-loading-text">Generating report...</span>
          </div>
        )}
      </div>
    </div>
  );
};