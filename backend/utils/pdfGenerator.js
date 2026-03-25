const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generateReportCard = async (studentName, results, outputPath) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument();
        const stream = fs.createWriteStream(outputPath);

        doc.pipe(stream);

        // Header
        doc.fontSize(25).text('Institute Management System', { align: 'center' });
        doc.moveDown();
        doc.fontSize(20).text('Student Report Card', { align: 'center' });
        doc.moveDown();

        // Student Info
        doc.fontSize(14).text(`Student Name: ${studentName}`);
        doc.text(`Date: ${new Date().toLocaleDateString()}`);
        doc.moveDown();

        // Table Header
        doc.fontSize(12).text('Subject/Exam', 100, doc.y, { continued: true });
        doc.text('Marks Obtained', 250, doc.y, { continued: true });
        doc.text('Max Marks', 400, doc.y);
        doc.moveTo(100, doc.y).lineTo(500, doc.y).stroke();
        doc.moveDown(0.5);

        // Results
        results.forEach(res => {
            doc.text(res.exam.title, 100, doc.y, { continued: true });
            doc.text(res.marksObtained.toString(), 250, doc.y, { continued: true });
            doc.text(res.exam.maxMarks.toString(), 400, doc.y);
            doc.moveDown(0.5);
        });

        doc.end();

        stream.on('finish', () => resolve(outputPath));
        stream.on('error', reject);
    });
};

module.exports = { generateReportCard };
