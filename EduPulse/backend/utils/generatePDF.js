import PDFDocument from "pdfkit";

const generateResultPDF = (
  student,
  results,
  performance,
  res
) => {
  const doc = new PDFDocument({
    margin: 50
  });

  res.setHeader(
    "Content-Type",
    "application/pdf"
  );

  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${student.studentId}-result.pdf"`
  );

  doc.pipe(res);

  // Title
  doc
    .fontSize(22)
    .text("EduTrack Result Report", {
      align: "center"
    });

  doc.moveDown();

  // Student Details
  doc.fontSize(12);
  doc.text(`Student ID: ${student.studentId}`);
  doc.text(`Name: ${student.name}`);
  doc.text(`Email: ${student.email || "N/A"}`);

  doc.moveDown();

  // Performance Summary
  doc.fontSize(16).text("Performance Summary");

  doc.moveDown(0.5);

  doc.text(
    `Overall Percentage: ${performance.overallPercentage}%`
  );

  doc.text(
    `Passed Subjects: ${performance.passedSubjects}`
  );

  doc.text(
    `Failed Subjects: ${performance.failedSubjects}`
  );

  doc.moveDown();

  // Subject Results
  doc.fontSize(16).text("Subject Results");

  doc.moveDown();

  results.forEach((result, index) => {
    doc.fontSize(11);

    doc.text(
      `${index + 1}. ${result.subject?.name || "Subject"}`
    );

    doc.text(
      `Marks: ${result.marksObtained}/${result.maxMarks}`
    );

    doc.text(
      `Percentage: ${result.percentage}%`
    );

    doc.text(`Grade: ${result.grade}`);

    doc.text(`Status: ${result.status}`);

    doc.moveDown();
  });

  doc.end();
};

export default generateResultPDF;