// PDF to DOCX page logic
const pdfInput = document.getElementById("pdf-input");
const convertBtn = document.getElementById("convert-pdf-btn");
const fileInfo = document.getElementById("file-info");
const statusMessage = document.getElementById("status-message");

let pdfFile;

// Enable "Convert to DOCX" button when a file is selected
pdfInput.addEventListener("change", function() {
    if (pdfInput.files.length > 0) {
        pdfFile = pdfInput.files[0];
        fileInfo.textContent = `${pdfFile.name} selected`;
        convertBtn.disabled = false;
        statusMessage.textContent = ''; // Clear previous status
    } else {
        convertBtn.disabled = true;
        fileInfo.textContent = 'No file selected';
    }
});

// Event listener for "Convert to DOCX" button
convertBtn.addEventListener("click", convertPdfToDocx);

async function convertPdfToDocx() {
    if (!pdfFile) {
        alert("Please upload a PDF to convert.");
        return;
    }

    // Simulate conversion process (since real PDF to DOCX requires backend)
    try {
        statusMessage.textContent = "Converting PDF to DOCX... Please wait!";
        statusMessage.classList.remove("error");
        statusMessage.classList.add("success");

        // Simulate a delay to mimic a real conversion process
        setTimeout(function() {
            // Here we will just create a dummy DOCX file as we can't fully convert PDF to DOCX client-side
            const docxBlob = new Blob([`
                <html xmlns:w="urn:schemas-microsoft-com:office:word">
                    <body>
                        <h1>This is a converted DOCX file from PDF</h1>
                        <p>This file is a simulation of a PDF to DOCX conversion process.</p>
                    </body>
                </html>
            `], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });

            // Create a download link
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(docxBlob);
            downloadLink.download = "converted-file.docx";
            downloadLink.click();

            statusMessage.textContent = "DOCX Created! 🎉 Your download will begin shortly.";
            statusMessage.classList.remove("error");
            statusMessage.classList.add("success");
        }, 2000); // Simulate 2 seconds delay
    } catch (error) {
        console.error("Error during PDF to DOCX conversion:", error);
        statusMessage.textContent = "Error occurred while converting the PDF.";
        statusMessage.classList.remove("success");
        statusMessage.classList.add("error");
    }
}
