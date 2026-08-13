export const calculatePercentage = (marksObtained, maxMarks) => {
  if (!maxMarks || maxMarks <= 0) {
    return 0;
  }

  return Number(
    ((marksObtained / maxMarks) * 100).toFixed(2)
  );
};


export const calculateGrade = (percentage) => {
  if (percentage >= 90) {
    return "A+";
  }

  if (percentage >= 80) {
    return "A";
  }

  if (percentage >= 70) {
    return "B";
  }

  if (percentage >= 60) {
    return "C";
  }

  if (percentage >= 50) {
    return "D";
  }

  if (percentage >= 40) {
    return "E";
  }

  return "F";
};


export const calculateStatus = (percentage) => {
  return percentage >= 40 ? "Pass" : "Fail";
};