function sanitizeHtml(dirty) {
  if (!dirty) return ""

  const parser = new DOMParser()
  const doc = parser.parseFromString(dirty, "text/html")

  const whitelist = {
    P: [],
    BR: [],
    STRONG: [],
    B: [],
    EM: [],
    I: [],
    U: [],
    UL: [],
    OL: [],
    LI: [],
    A: ["href"],
  }

  function cleanNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      return document.createTextNode(node.textContent)
    }
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return null
    }
    const tag = node.tagName.toUpperCase()
    if (!whitelist[tag]) {
      const frag = document.createDocumentFragment()
      node.childNodes.forEach((child) => {
        const cleaned = cleanNode(child)
        if (cleaned) frag.appendChild(cleaned)
      })
      return frag
    }
    const el = document.createElement(tag.toLowerCase())
    if (tag === "A") {
      const href = node.getAttribute("href")
      if (href && /^(https?:|mailto:|tel:)/i.test(href)) {
        el.setAttribute("href", href)
        el.setAttribute("target", "_blank")
        el.setAttribute("rel", "noopener noreferrer")
      }
    }
    node.childNodes.forEach((child) => {
      const cleaned = cleanNode(child)
      if (cleaned) el.appendChild(cleaned)
    })
    return el
  }

  const frag = document.createDocumentFragment()
  doc.body.childNodes.forEach((child) => {
    const c = cleanNode(child)
    if (c) frag.appendChild(c)
  })
  const container = document.createElement("div")
  container.appendChild(frag)
  return container.innerHTML
}

const JobDescriptionBox = ({ job }) => {
  if (!job) return null

  return (
    <div className="border rounded-xl p-6 shadow-md">
      <h3 className="text-lg font-bold mb-4">Job Description</h3>

      {Array.isArray(job.description) ? (
        <ul className="list-disc list-inside space-y-2">
          {job.description.map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ul>
      ) : job.description ? (
        <div
          className="prose prose-sm max-w-none text-gray-700"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(job.description) }}
        />
      ) : (
        <p className="text-sm text-gray-500">No job description provided.</p>
      )}
    </div>
  )
}

export default JobDescriptionBox
