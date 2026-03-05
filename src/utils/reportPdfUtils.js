import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const generatePDFFromContainer = async (containerRef) => {
    if (!containerRef.current) return null;

    const originalCreatePattern = CanvasRenderingContext2D.prototype.createPattern;
    CanvasRenderingContext2D.prototype.createPattern = function (image, repetition) {
        if (image && (image.width === 0 || image.height === 0)) return null;
        return originalCreatePattern.call(this, image, repetition);
    };

    try {
        const pages = containerRef.current.querySelectorAll(".report-page");
        const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: [1000, 1415] });

        for (let i = 0; i < pages.length; i++) {
            const canvas = await html2canvas(pages[i], {
                scale: 2, useCORS: true, allowTaint: true, backgroundColor: null,
                width: 1000, height: 1415, logging: false,
            });
            const imgData = canvas.toDataURL("image/jpeg", 0.95);
            if (i > 0) pdf.addPage([1000, 1415]);
            pdf.addImage(imgData, "JPEG", 0, 0, 1000, 1415);
        }

        return pdf;
    } finally {
        CanvasRenderingContext2D.prototype.createPattern = originalCreatePattern;
    }
};
