import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const generatePDFFromContainer = async (containerRef, { landscape = false } = {}) => {
    if (!containerRef.current) return null;

    const originalCreatePattern = CanvasRenderingContext2D.prototype.createPattern;
    CanvasRenderingContext2D.prototype.createPattern = function (image, repetition) {
        if (image && (image.width === 0 || image.height === 0)) return null;
        return originalCreatePattern.call(this, image, repetition);
    };

    const orientation = landscape ? "landscape" : "portrait";
    const pageW = landscape ? 1415 : 1000;
    const pageH = landscape ? 820 : 1415;

    try {
        const pages = containerRef.current.querySelectorAll(".report-page");
        const pdf = new jsPDF({ orientation, unit: "px", format: [pageW, pageH] });

        for (let i = 0; i < pages.length; i++) {
            const canvas = await html2canvas(pages[i], {
                scale: 2, useCORS: true, allowTaint: true, backgroundColor: null,
                width: pageW, height: pageH, logging: false,
            });
            const imgData = canvas.toDataURL("image/jpeg", 0.95);
            if (i > 0) pdf.addPage([pageW, pageH]);
            pdf.addImage(imgData, "JPEG", 0, 0, pageW, pageH);
        }

        return pdf;
    } finally {
        CanvasRenderingContext2D.prototype.createPattern = originalCreatePattern;
    }
};
