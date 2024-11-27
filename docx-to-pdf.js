// Get elements
const convertDocxButton = document.getElementById("convert-docx");
const docxInput = document.getElementById("docx-input");
const docxInfo = document.getElementById("docx-info");
const conversionStatusMessage = document.getElementById("conversion-status-message");

// Enable the "Convert to PDF" button when a DOCX file is selected
docxInput.addEventListener("change", function() {
    if (docxInput.files.length > 0) {
        convertDocxButton.disabled = false;
        docxInfo.textContent = `${docxInput.files.length} DOCX file(s) selected`;
        conversionStatusMessage.textContent = ''; // Clear any previous status message
    } else {
        convertDocxButton.disabled = true;
        docxInfo.textContent = 'No DOCX selected';
    }
});

// Event listener for "Convert to PDF" button
convertDocxButton.addEventListener("click", convertToPdf);

// Function to convert DOCX to PDF
async function convertToPdf() {
    const file = docxInput.files[0];

    if (!file) {
        alert("Please upload a DOCX file to convert.");
        return;
    }

    // Read DOCX content using mammoth.js
    const arrayBuffer = await file.arrayBuffer();
    try {
        const { value: textContent } = await mammoth.extractRawText({ arrayBuffer });

        // Check if content is extracted
        if (!textContent) {
            throw new Error("No text content found in the DOCX file.");
        }

        // Create a new PDF document using PDF-lib
        const pdfDoc = await PDFLib.PDFDocument.create();
        const page = pdfDoc.addPage([600, 800]);
        const font = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica);

        // Add the DOCX text content to the PDF
        const margin = 50;
        const maxWidth = 500;
        let yPosition = 750;

        // Add the content line by line to avoid overflowing the page
        const lines = textContent.split("\n");
        for (const line of lines) {
            if (yPosition < 50) {
                break; // Stop if there is no more space on the page
            }

            page.drawText(line, {
                x: margin,
                y: yPosition,
                font: font,
                size: 12,
                maxWidth: maxWidth,
                lineHeight: 14,
            });

            yPosition -= 20; // Move to the next line
        }

        // Save the PDF
        const pdfBytes = await pdfDoc.save();
        const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(pdfBlob);
        downloadLink.download = 'converted.pdf';
        downloadLink.click();

        // Update the status message
        conversionStatusMessage.textContent = 'Conversion complete! PDF is ready for download.';

    } catch (error) {
        console.error("Error converting DOCX to PDF:", error);
        conversionStatusMessage.textContent = 'Error occurred while converting DOCX to PDF.';
    }
}
