import html2pdf from "html2pdf.js";

/**
 *
 * @param {object} profileData
 * @returns {void}  // Directly downloads PDF
 */
const generateResume = (profileData) => {
  const {
    name,
    headline,
    email,
    phone,
    location,
    experience,
    availability,
    summary,
    skills,
    education,
    projects,
    certifications,
    currentSalary,
    expectedSalary,
    preferredLocation,
    image
  } = profileData;

  const profileImage = image
    ? `<img src="${image}" alt="${name}" style="width:100px;height:100px;border-radius:50%;object-fit:cover;margin-bottom:10px;"/>`
    : "";

  const style = `
    <style>
      body { font-family: 'Inter', sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f8f8f8; }
      .resume-container { max-width: 800px; margin: 20px auto; background: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border-top: 5px solid #ff9900; }
      .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #eee; }
      .header h1 { font-size: 2.2em; color: #333; margin: 0; font-weight: 700; }
      .header p { font-size: 1.1em; color: #555; margin: 5px 0; }
      .contact-info { display: flex; justify-content: center; flex-wrap: wrap; gap: 15px; margin-top: 15px; font-size: 0.95em; color: #666; }
      .section { margin-bottom: 25px; }
      .section-title { font-size: 1.3em; color: #ff9900; border-bottom: 2px solid #ffcc66; padding-bottom: 5px; margin-bottom: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;}
      .content p, .content ul, .content li { margin-bottom: 6px; font-size: 0.95em; color: #444; }
      .content ul { list-style-type: disc; padding-left: 20px; }
      .skills-list { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px; }
      .skill-badge { background-color: #ffe0b2; color: #e65100; padding: 5px 10px; border-radius: 15px; font-size: 0.85em; font-weight: 500; }
      .detail-item { margin-bottom: 6px; }
      .detail-item strong { color: #333; }
    </style>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  `;

  const skillsList = skills
    ? skills.split(",").map((skill) => `<span class="skill-badge">${skill.trim()}</span>`).join("")
    : "";

  const resumeHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>${name || "Resume"}</title>
      ${style}
    </head>
    <body>
      <div class="resume-container">
        <div class="header">
          ${profileImage}
          <h1>${name || "Your Name"}</h1>
          <p>${headline || "Professional Headline"}</p>
          <div class="contact-info">
            <span>${email || ""}</span> | 
            <span>${phone || ""}</span> | 
            <span>${location || ""}</span>
          </div>
        </div>

        ${summary ? `
        <div class="section">
          <h2 class="section-title">Professional Summary</h2>
          <div class="content"><p>${summary}</p></div>
        </div>` : ""}

        ${skills ? `
        <div class="section">
          <h2 class="section-title">Skills</h2>
          <div class="content skills-list">${skillsList}</div>
        </div>` : ""}

        ${experience ? `
        <div class="section">
          <h2 class="section-title">Experience</h2>
          <div class="content"><p>${experience}</p></div>
        </div>` : ""}

        ${education ? `
        <div class="section">
          <h2 class="section-title">Education</h2>
          <div class="content"><p>${education}</p></div>
        </div>` : ""}

        ${projects ? `
        <div class="section">
          <h2 class="section-title">Projects</h2>
          <div class="content"><p>${projects}</p></div>
        </div>` : ""}

        ${certifications ? `
        <div class="section">
          <h2 class="section-title">Certifications</h2>
          <div class="content"><p>${certifications}</p></div>
        </div>` : ""}

        <div class="section">
          <h2 class="section-title">Additional Information</h2>
          <div class="content">
            ${currentSalary ? `<div class="detail-item"><strong>Current Salary:</strong> ${currentSalary}</div>` : ""}
            ${expectedSalary ? `<div class="detail-item"><strong>Expected Salary:</strong> ${expectedSalary}</div>` : ""}
            ${preferredLocation ? `<div class="detail-item"><strong>Preferred Location:</strong> ${preferredLocation}</div>` : ""}
            ${availability ? `<div class="detail-item"><strong>Availability:</strong> ${availability}</div>` : ""}
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  // ✅ Convert HTML → PDF
  const element = document.createElement("div");
  element.innerHTML = resumeHTML;

  const opt = {
    margin: 0.5,
    filename: `${name || "resume"}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "a4", orientation: "portrait" }
  };

  html2pdf().set(opt).from(element).save();
};

export default generateResume;
