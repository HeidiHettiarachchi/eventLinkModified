import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import { FiDownload } from "react-icons/fi";
import { IEvent } from "../../types/IResponse";
import logo from "../../../public/assets/logo.png";

const DownloadReportButton = ({ filteredEvents }: { filteredEvents: IEvent[] }) => {
  const generateReport = () => {
    const doc = new jsPDF();
    const brandColor = '#069efd';
    const accentColor = '#f45a01';
    
    // Logo dimensions
    const LOGO_WIDTH = 27;
    const LOGO_HEIGHT = 27;
    
    // Create header
    const drawHeader = () => {
      const pageWidth = doc.internal.pageSize.width;
      
      // Solid color header with accent border
      doc.setFillColor(brandColor);
      doc.rect(0, 0, pageWidth, 50, 'F');
      
      // Add accent border at bottom
      doc.setFillColor(accentColor);
      doc.rect(0, 48, pageWidth, 2, 'F');
    };

    // Create compact footer
    const drawFooter = () => {
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      
      // Footer with brand color
      doc.setFillColor(brandColor);
      doc.rect(0, pageHeight - 15, pageWidth, 15, 'F');
      
      // White contact info
      doc.setFontSize(9);
      doc.setTextColor(255, 255, 255);
      doc.text("Contact: +94 11 800 000 000", 
        pageWidth / 2, 
        pageHeight - 10,
        { align: 'center' }
      );
      doc.text("eventlink@gmail.com", 
        pageWidth / 2, 
        pageHeight - 5,
        { align: 'center' }
      );
    };

    const generateReportWithLogo = async () => {
      try {
        // Draw header
        drawHeader();
        
        // Add logo
        const response = await fetch(logo);
        const blob = await response.blob();
        const logoData = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
        
        doc.addImage(logoData as string, 'PNG', 14, 12, LOGO_WIDTH, LOGO_HEIGHT);
        
        // Add title (white text)
        doc.setFontSize(18);
        doc.setTextColor(255, 255, 255);
        doc.text("Event Link | Event Report", 14 + LOGO_WIDTH + 10, 30);
        
        // Add generation info (light text)
        doc.setFontSize(10);
        doc.setTextColor(240, 240, 240);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14 + LOGO_WIDTH + 10, 40);
        doc.text("Event Management System", 14 + LOGO_WIDTH + 10, 45);
        
        // Prepare table data
        const tableData = filteredEvents.map(event => [
          event.eventName || "-",
          event.eventDate || "-",
          event.eventStartTime || "-",
          event.eventFinishTime || "-",
          event.eventType || "-",
          event.eventStatus || "-",
          event.eventVenue || "-",
          event.eventBudget ? `Rs. ${event.eventBudget.toLocaleString()}` : "-"
        ]);
        
        // Add table
        autoTable(doc, {
          head: [
            ["Event Name", "Date", "Start Time", "End Time", 
             "Type", "Status", "Venue", "Budget"]
          ],
          body: tableData,
          startY: 55,
          styles: {
            fontSize: 9,
            cellPadding: 3,
            overflow: 'linebreak',
            valign: 'middle',
            halign: 'left',
            fillColor: false,
            textColor: '#333333',
            lineColor: '#e0e0e0',
            lineWidth: 0.2
          },
          headStyles: {
            fillColor: brandColor,
            textColor: '#ffffff',
            fontSize: 10,
            fontStyle: 'bold',
            halign: 'center',
            valign: 'middle'
          },
          alternateRowStyles: {
            fillColor: '#f8f8f8'
          },
          columnStyles: {
            0: { cellWidth: 30, fontStyle: 'bold' },
            1: { cellWidth: 28, halign: 'center' },
            2: { cellWidth: 15, halign: 'center' },
            3: { cellWidth: 15, halign: 'center' },
            4: { cellWidth: 28, halign: 'center' },
            5: { cellWidth: 25, halign: 'center' },
            6: { cellWidth: 25 },
            7: { cellWidth: 18, halign: 'right' }
          },
          margin: { left: 14 },
          didDrawPage: () => drawFooter()
        });
        
        doc.save(`EventLink_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
      } catch (error) {
        console.error("Error generating report:", error);
        generateReportWithoutLogo();
      }
    };

    const generateReportWithoutLogo = () => {
      drawHeader();
      
      // Add title
      doc.setFontSize(18);
      doc.setTextColor(255, 255, 255);
      doc.text("Event Link | Event Report", 14, 30);
      
      // Add generation info
      doc.setFontSize(10);
      doc.setTextColor(240, 240, 240);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 40);
      doc.text("Event Management System", 14, 45);
      
      // Generate table with footer
      autoTable(doc, {
        head: [
          ["Event Name", "Date", "Start Time", "End Time", 
           "Type", "Status", "Venue", "Budget"]
        ],
        body: filteredEvents.map(event => [
          event.eventName || "-",
          event.eventDate || "-",
          event.eventStartTime || "-",
          event.eventFinishTime || "-",
          event.eventType || "-",
          event.eventStatus || "-",
          event.eventVenue || "-",
          event.eventBudget ? `Rs. ${event.eventBudget.toLocaleString()}` : "-"
        ]),
        startY: 55,
        styles: {
          fontSize: 9,
          cellPadding: 3,
          overflow: 'linebreak',
          valign: 'middle',
          halign: 'left',
          fillColor: false,
          textColor: '#333333',
          lineColor: '#e0e0e0',
          lineWidth: 0.2
        },
        headStyles: {
          fillColor: brandColor,
          textColor: '#ffffff',
          fontSize: 10,
          fontStyle: 'bold',
          halign: 'center',
          valign: 'middle'
        },
        alternateRowStyles: {
          fillColor: '#f8f8f8'
        },
        columnStyles: {
          0: { cellWidth: 30, fontStyle: 'bold' },
          1: { cellWidth: 28, halign: 'center' },
          2: { cellWidth: 15, halign: 'center' },
          3: { cellWidth: 15, halign: 'center' },
          4: { cellWidth: 28, halign: 'center' },
          5: { cellWidth: 25, halign: 'center' },
          6: { cellWidth: 25 },
          7: { cellWidth: 20, halign: 'center' }
        },
        margin: { left: 14 },
        didDrawPage: () => drawFooter()
      });
      
      doc.save(`EventLink_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
    };

    generateReportWithLogo();
  };

  return (
    <button
      onClick={generateReport}
      className="flex items-center px-4 py-2 bg-[#069efd] text-white rounded-lg hover:bg-[#0580d0] transition-colors shadow-md"
      title="Download Report"
      disabled={filteredEvents.length === 0}
    >
      <FiDownload className="mr-2" />
      <span className="font-medium">Generate Report</span>
    </button>
  );
};

export default DownloadReportButton;