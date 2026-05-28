export async function exportResumeAsPdf(elementId = "resume-export") {
  const element = document.getElementById(elementId);
  if (!element) return;

  const html2pdf = (await import("html2pdf.js")).default;
  const name = document.querySelector("[data-resume-name]")?.textContent?.trim() || "resume";

  await html2pdf()
    .set({
      margin: 0,
      filename: `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "resume"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2.5, useCORS: true, letterRendering: true, scrollX: 0, scrollY: 0, windowWidth: 794 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: { mode: "css" }
    })
    .from(element)
    .save();
}
