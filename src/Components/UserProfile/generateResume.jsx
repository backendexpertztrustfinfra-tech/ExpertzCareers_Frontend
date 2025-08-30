/**
 *
 * @param {object} profileData
 * @returns {string} 
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

  const profileImage = image ? `<img src="${image}" alt="${name}" class="w-24 h-24 rounded-full object-cover mr-4 border-2 border-gray-300"/>` : '';

  const style = `
    <style>
      body { font-family: 'Inter', sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f8f8f8; }
      .resume-container { max-width: 800px; margin: 20px auto; background: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border-top: 5px solid #ff9900; }
      .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #eee; }
      .header h1 { font-size: 2.8em; color: #333; margin: 0; font-weight: 700; }
      .header p { font-size: 1.1em; color: #555; margin: 5px 0; }
      .contact-info { display: flex; justify-content: center; flex-wrap: wrap; gap: 15px; margin-top: 15px; }
      .contact-info span { display: flex; align-items: center; gap: 5px; color: #666; font-size: 0.95em; }
      .section { margin-bottom: 25px; }
      .section-title { font-size: 1.8em; color: #ff9900; border-bottom: 2px solid #ffcc66; padding-bottom: 5px; margin-bottom: 15px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;}
      .content p, .content ul, .content li { margin-bottom: 8px; font-size: 1em; color: #444; }
      .content ul { list-style-type: disc; padding-left: 20px; }
      .skills-list { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px; }
      .skill-badge { background-color: #ffe0b2; color: #e65100; padding: 6px 12px; border-radius: 20px; font-size: 0.9em; font-weight: 500; }
      .detail-item { margin-bottom: 10px; }
      .detail-item strong { color: #333; }
      .flex-row { display: flex; align-items: center; }
      .flex-col { display: flex; flex-direction: column; }
      .text-center { text-align: center; }
      .capitalize { text-transform: capitalize; }
    </style>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  `;

  const experienceText = experience ? `<div class="detail-item"><strong>Experience:</strong> ${experience}</div>` : '';
  const availabilityText = availability ? `<div class="detail-item"><strong>Availability:</strong> ${availability}</div>` : '';
  const skillsList = skills ? skills.split(',').map(skill => `<span class="skill-badge">${skill.trim()}</span>`).join('') : '';
  const currentSalaryText = currentSalary ? `<div class="detail-item"><strong>Current Salary:</strong> ${currentSalary}</div>` : '';
  const expectedSalaryText = expectedSalary ? `<div class="detail-item"><strong>Expected Salary:</strong> ${expectedSalary}</div>` : '';
  const preferredLocationText = preferredLocation ? `<div class="detail-item"><strong>Preferred Location:</strong> ${preferredLocation}</div>` : '';

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${name || "Resume"}</title>
        ${style}
    </head>
    <body>
        <div class="resume-container">
            <div class="header">
                <div class="flex-row items-center justify-center mb-4">
                    ${profileImage}
                    <div class="flex-col text-center">
                        <h1>${name || "Your Name"}</h1>
                        <p class="text-gray-600">${headline || "Professional Headline"}</p>
                    </div>
                </div>
                <div class="contact-info">
                    <span>${email || "your.email@example.com"}</span> |
                    <span>${phone || "+123-456-7890"}</span> |
                    <span>${location || "City, Country"}</span>
                </div>
            </div>

            ${summary ? `
            <div class="section">
                <h2 class="section-title">Professional Summary</h2>
                <div class="content">
                    <p>${summary}</p>
                </div>
            </div>` : ''}

            ${skills ? `
            <div class="section">
                <h2 class="section-title">Skills</h2>
                <div class="content skills-list">
                    ${skillsList}
                </div>
            </div>` : ''}

            ${experienceText ? `
            <div class="section">
                <h2 class="section-title">Experience</h2>
                <div class="content">
                    ${experienceText}
                    <!-- You can add more detailed experience items here if your profile data supports it -->
                </div>
            </div>` : ''}

            ${education ? `
            <div class="section">
                <h2 class="section-title">Education</h2>
                <div class="content">
                    <p>${education}</p>
                    <!-- You can add more detailed education items here if your profile data supports it -->
                </div>
            </div>` : ''}

            ${projects ? `
            <div class="section">
                <h2 class="section-title">Projects</h2>
                <div class="content">
                    <p>${projects}</p>
                    <!-- You can add more detailed project items here if your profile data supports it -->
                </div>
            </div>` : ''}

            ${certifications ? `
            <div class="section">
                <h2 class="section-title">Certifications</h2>
                <div class="content">
                    <p>${certifications}</p>
                    <!-- You can add more detailed certification items here if your profile data supports it -->
                </div>
            </div>` : ''}

            <div class="section">
              <h2 class="section-title">Additional Information</h2>
              <div class="content">
                ${currentSalaryText}
                ${expectedSalaryText}
                ${preferredLocationText}
                ${availabilityText}
              </div>
            </div>
        </div>
    </body>
    </html>
  `;
};

export default generateResume;
