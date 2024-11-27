// Get elements
const createPdfButton = document.getElementById("create-pdf");
const imageInput = document.getElementById("image-input");
const imageInfo = document.getElementById("image-info");
const pdfStatusMessage = document.getElementById("pdf-status-message");

// Enable the "Create PDF" button when an image is selected
imageInput.addEventListener("change", function() {
    if (imageInput.files.length > 0) {
        createPdfButton.disabled = false;
        imageInfo.textContent = `${imageInput.files.length} image(s) selected`;
        pdfStatusMessage.textContent = ''; // Clear any previous status message
    } else {
        createPdfButton.disabled = true;
        imageInfo.textContent = 'No image selected';
    }
});

// Event listener for "Create PDF" button
createPdfButton.addEventListener("click", createPdf);

// Function to create PDF from the selected image
async function createPdf() {
    const file = imageInput.files[0];

    if (!file) {
        alert("Please upload an image to create a PDF.");
        return;
    }

    const reader = new FileReader();

    reader.onload = async function(event) {
        const imgData = event.target.result;

        try {
            // Create a new PDF document
            const pdfDoc = await PDFLib.PDFDocument.create();
            const page = pdfDoc.addPage([600, 800]);

            // Embed the image (check if it's a JPG or PNG)
            let image;
            if (file.type === "image/jpeg") {
                image = await pdfDoc.embedJpg(imgData);
            } else if (file.type === "image/png") {
                image = await pdfDoc.embedPng(imgData);
            } else {
                throw new Error("Unsupported image format. Please upload a JPG or PNG file.");
            }

            const { width, height } = image;

            // Calculate scaling to fit the page
            const scale = Math.min(600 / width, 800 / height); // Scale to fit within the page
            const x = (600 - width * scale) / 2; // Center horizontally
            const y = (800 - height * scale) / 2; // Center vertically

            // Draw the image on the PDF page
            page.drawImage(image, {
                x,
                y,
                width: width * scale,
                height: height * scale,
            });

            // Save the PDF
            const pdfBytes = await pdfDoc.save();
            const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(pdfBlob);
            downloadLink.download = 'created-pdf.pdf';
            downloadLink.click();

            // Update status message
            pdfStatusMessage.textContent = 'PDF Created! 🎉 Your download will begin shortly.';
            pdfStatusMessage.classList.remove('error');
            pdfStatusMessage.classList.add('success');
        } catch (error) {
            console.error("Error creating PDF:", error);
            pdfStatusMessage.textContent = 'Error occurred while creating the PDF.';
            pdfStatusMessage.classList.remove('success');
            pdfStatusMessage.classList.add('error');
        }
    };

    // Read the image file as a Data URL
    reader.readAsDataURL(file);
}
