import html2pdf from "html2pdf.js"

/**
 * Comprehensive Resume Generator - Includes ALL user profile data
 * @param {object} profileData - Complete user profile data
 * @returns {void} - Directly downloads PDF only
 */
const generateResume = (profileData) => {
  const {
    name = "",
    designation = "",
    email = "",
    phone = "",
    location = "",
    experience = "",
    bio = "",
    summary = "",
    Skills = "",
    skills = "",
    qualification = "",
    Experience = "",
    projects = "",
    certificationlink = "",
    currentSalary = "",
    expectedSalary = "",
    preferredLocation = "",
    previousCompany = "",
    portfioliolink = "",
    image = "",
    recruterPhone = "",
    recruterCompany = "",
    recruterCompanyType = "",
    recruterGstIn = "",
    recruterCompanyAddress = "",
    recruterIndustry = "",
  } = profileData

  // Use Skills or skills field (fallback)
  const parseJSON = (data) => {
    if (!data) return null
    try {
      return typeof data === "string" ? JSON.parse(data) : data
    } catch (e) {
      return data
    }
  }

  const skillsData = parseJSON(Skills || skills) || []
  const qualificationData = parseJSON(qualification) || []
  const experienceData = parseJSON(Experience) || []
  const summaryData = summary || bio || ""

  const profileImage = image
    ? `<img src="${image}" alt="${name}" style="width:120px;height:120px;border-radius:50%;object-fit:cover;margin-bottom:15px;border:4px solid #2563eb;"/>`
    : ""

  const style = `
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { 
        font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
        line-height: 1.6; 
        color: #1f2937; 
        background: #ffffff;
        font-size: 14px;
      }
      .resume-container { 
        max-width: 800px; 
        margin: 0 auto; 
        background: #ffffff; 
        padding: 40px; 
        min-height: 100vh;
      }
      .header { 
        text-align: center; 
        margin-bottom: 40px; 
        padding-bottom: 30px; 
        border-bottom: 3px solid #2563eb;
        background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        padding: 30px;
        border-radius: 15px;
        margin-bottom: 30px;
      }
      .header h1 { 
        font-size: 2.5em; 
        color: #1e293b; 
        margin: 15px 0 10px 0; 
        font-weight: 700; 
        letter-spacing: -0.5px;
      }
      .header .designation { 
        font-size: 1.3em; 
        color: #2563eb; 
        margin: 10px 0 20px 0; 
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
      .contact-info { 
        display: flex; 
        justify-content: center; 
        flex-wrap: wrap; 
        gap: 20px; 
        margin-top: 20px; 
        font-size: 1em; 
        color: #4b5563;
      }
      .contact-item {
        background: #ffffff;
        padding: 8px 16px;
        border-radius: 20px;
        border: 1px solid #e5e7eb;
        font-weight: 500;
      }
      .section { 
        margin-bottom: 35px; 
        page-break-inside: avoid;
      }
      .section-title { 
        font-size: 1.4em; 
        color: #2563eb; 
        border-bottom: 2px solid #3b82f6; 
        padding-bottom: 8px; 
        margin-bottom: 20px; 
        font-weight: 700; 
        text-transform: uppercase; 
        letter-spacing: 0.5px;
        position: relative;
      }
      .section-title::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 50px;
        height: 2px;
        background: #1d4ed8;
      }
      .content { 
        font-size: 1em; 
        color: #374151; 
        line-height: 1.7;
      }
      .content p, .content ul, .content li { 
        margin-bottom: 10px; 
      }
      .content ul { 
        list-style-type: none; 
        padding-left: 0; 
      }
      .content li {
        padding: 8px 0;
        border-bottom: 1px solid #f3f4f6;
        position: relative;
        padding-left: 20px;
      }
      .content li::before {
        content: '▸';
        color: #2563eb;
        font-weight: bold;
        position: absolute;
        left: 0;
      }
      .skills-grid { 
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 15px; 
        margin-top: 15px; 
      }
      .skill-item { 
        background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); 
        color: #1e40af; 
        padding: 12px 18px; 
        border-radius: 25px; 
        font-size: 0.9em; 
        font-weight: 600; 
        text-align: center;
        border: 1px solid #bfdbfe;
        box-shadow: 0 2px 4px rgba(37, 99, 235, 0.1);
      }
      .detail-section {
        background: #f8fafc;
        padding: 25px;
        border-radius: 12px;
        margin: 20px 0;
        border-left: 4px solid #2563eb;
      }
      .detail-item { 
        margin-bottom: 12px; 
        padding: 10px 0;
        border-bottom: 1px solid #e5e7eb;
      }
      .detail-item:last-child {
        border-bottom: none;
      }
      .detail-item strong { 
        color: #1e293b; 
        font-weight: 600;
        display: inline-block;
        min-width: 140px;
      }
      .link-item {
        color: #2563eb;
        text-decoration: none;
        font-weight: 500;
      }
      .link-item:hover {
        text-decoration: underline;
      }
      .two-column {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 30px;
        margin-top: 20px;
      }
      @media print {
        body { font-size: 12px; }
        .resume-container { padding: 20px; }
        .section { margin-bottom: 25px; }
      }
    </style>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  `

  // Process skills into grid format
  const skillsList = Array.isArray(skillsData)
    ? skillsData.map((skill) => `<div class="skill-item">${skill.trim()}</div>`).join("")
    : typeof skillsData === "string"
      ? skillsData
          .split(",")
          .map((skill) => `<div class="skill-item">${skill.trim()}</div>`)
          .join("")
      : ""

  const qualificationHTML =
    Array.isArray(qualificationData) && qualificationData.length > 0
      ? qualificationData
          .map(
            (qual) => `
        <div class="detail-item">
          <strong>${qual.degree || "Degree"}</strong><br/>
          <span style="color: #6b7280;">${qual.institution || ""}</span><br/>
          ${qual.startDate ? `<span style="font-size: 0.9em; color: #9ca3af;">${qual.startDate} - ${qual.currentlyPursuing ? "Present" : qual.endDate || ""}</span>` : ""}
        </div>
      `,
          )
          .join("")
      : typeof qualification === "string" && qualification
        ? `<div class="detail-item">${qualification}</div>`
        : ""

  const experienceHTML =
    Array.isArray(experienceData) && experienceData.length > 0
      ? experienceData
          .map(
            (exp) => `
        <div class="detail-item">
          <strong>${exp.designation || "Position"}</strong> at <strong>${exp.company || "Company"}</strong><br/>
          ${exp.startDate ? `<span style="font-size: 0.9em; color: #9ca3af;">${exp.startDate} - ${exp.currentlyWorking ? "Present" : exp.endDate || ""}</span>` : ""}
          ${exp.description ? `<p style="margin-top: 8px; color: #4b5563;">${exp.description}</p>` : ""}
        </div>
      `,
          )
          .join("")
      : ""

  const resumeHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${name || "Professional Resume"}</title>
      ${style}
    </head>
    <body>
      <div class="resume-container">
         Header Section 
        <div class="header">
          ${profileImage}
          <h1>${name || "Your Name"}</h1>
          ${designation ? `<div class="designation">${designation}</div>` : ""}
          <div class="contact-info">
            ${email ? `<span class="contact-item">📧 ${email}</span>` : ""}
            ${phone ? `<span class="contact-item">📱 ${phone}</span>` : ""}
            ${location ? `<span class="contact-item">📍 ${location}</span>` : ""}
          </div>
        </div>

         Professional Summary 
        ${
          summaryData
            ? `
        <div class="section">
          <h2 class="section-title">Professional Summary</h2>
          <div class="content">
            <p>${summaryData}</p>
          </div>
        </div>`
            : ""
        }

         Skills Section 
        ${
          skillsList
            ? `
        <div class="section">
          <h2 class="section-title">Core Skills & Expertise</h2>
          <div class="skills-grid">
            ${skillsList}
          </div>
        </div>`
            : ""
        }

         Professional Experience 
        ${
          experienceHTML
            ? `
        <div class="section">
          <h2 class="section-title">Professional Experience</h2>
          <div class="detail-section">
            ${experienceHTML}
          </div>
        </div>`
            : ""
        }

         Education & Qualifications 
        ${
          qualificationHTML
            ? `
        <div class="section">
          <h2 class="section-title">Education & Qualifications</h2>
          <div class="detail-section">
            ${qualificationHTML}
          </div>
        </div>`
            : ""
        }

         Projects & Portfolio 
        ${
          projects || portfioliolink
            ? `
        <div class="section">
          <h2 class="section-title">Projects & Portfolio</h2>
          <div class="content">
            ${projects ? `<p><strong>Projects:</strong> ${projects}</p>` : ""}
            ${portfioliolink ? `<p><strong>Portfolio:</strong> <a href="${portfioliolink}" class="link-item" target="_blank">${portfioliolink}</a></p>` : ""}
          </div>
        </div>`
            : ""
        }

         Certifications 
        ${
          certificationlink
            ? `
        <div class="section">
          <h2 class="section-title">Certifications & Achievements</h2>
          <div class="content">
            <p><a href="${certificationlink}" class="link-item" target="_blank">View Certifications</a></p>
          </div>
        </div>`
            : ""
        }

         Salary & Preferences 
        ${
          currentSalary || expectedSalary || preferredLocation
            ? `
        <div class="section">
          <h2 class="section-title">Compensation & Preferences</h2>
          <div class="detail-section">
            ${currentSalary ? `<div class="detail-item"><strong>Current Salary:</strong> ${currentSalary}</div>` : ""}
            ${expectedSalary ? `<div class="detail-item"><strong>Expected Salary:</strong> ${expectedSalary}</div>` : ""}
            ${preferredLocation ? `<div class="detail-item"><strong>Preferred Location:</strong> ${preferredLocation}</div>` : ""}
          </div>
        </div>`
            : ""
        }
      </div>
    </body>
    </html>
  `

  // Create temporary element for PDF generation
  const element = document.createElement("div")
  element.innerHTML = resumeHTML

  // PDF generation options - ONLY PDF, no HTML download
  const opt = {
    margin: [0.5, 0.5, 0.5, 0.5],
    filename: `${name || "Professional_Resume"}_CV.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      letterRendering: true,
      allowTaint: false,
    },
    jsPDF: {
      unit: "in",
      format: "a4",
      orientation: "portrait",
      compress: true,
    },
    pagebreak: { mode: ["avoid-all", "css", "legacy"] },
  }

  // Generate and download ONLY PDF
  html2pdf()
    .set(opt)
    .from(element)
    .save()
    .then(() => {
      console.log("✅ PDF Resume generated successfully!")
    })
    .catch((error) => {
      console.error("❌ Error generating PDF:", error)
    })
}

export default generateResume
