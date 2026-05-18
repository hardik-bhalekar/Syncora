import PDFDocument from "pdfkit"
import fs from "fs"
import path from "path"

async function generatePDF() {
  const doc = new PDFDocument({ size: "A4", margin: 50, bufferPages: true })
  const outputPath = path.join(process.cwd(), "final_submission_document.pdf")
  const stream = fs.createWriteStream(outputPath)

  doc.pipe(stream)

  // Colors
  const primaryColor = "#0F172A" // Slate 900
  const accentColor = "#059669" // Emerald 600
  const textColor = "#334155" // Slate 700
  const titleColor = "#1E293B" // Slate 800

  // Helper for page headers
  const addHeader = (title: string, pageNum: number) => {
    if (pageNum > 1) doc.addPage()
    doc.fillColor(primaryColor).fontSize(24).font("Helvetica-Bold").text(title, { align: "left" })
    doc.moveTo(50, 85).lineTo(545, 85).strokeColor(accentColor).lineWidth(2).stroke()
    doc.moveDown(2)
  }

  // Helper for footers
  const addFooters = () => {
    const range = doc.bufferedPageRange()
    for (let i = range.start; i < range.start + range.count; i++) {
      doc.switchToPage(i)
      doc.fontSize(9).fillColor("#94A3B8").font("Helvetica")
      doc.text(`Syncora — Hackathon Final Submission`, 50, 780, { align: "left" })
      doc.text(`Page ${i + 1} of ${range.count}`, 50, 780, { align: "right" })
    }
  }

  // ==========================================
  // PAGE 1: Title & Problem Statement
  // ==========================================
  doc.moveDown(3)
  doc.fillColor(primaryColor).fontSize(36).font("Helvetica-Bold").text("SYNCORA", { align: "center" })
  doc.moveDown(0.5)
  doc.fillColor(accentColor).fontSize(16).font("Helvetica").text("Enterprise Goal Alignment & Workflow Orchestration Portal", { align: "center" })
  doc.moveDown(4)

  doc.fillColor(titleColor).fontSize(18).font("Helvetica-Bold").text("Team Information", { align: "left" })
  doc.moveDown(0.5)
  doc.fillColor(textColor).fontSize(12).font("Helvetica-Bold").text("Team Name: ", { continued: true }).font("Helvetica").text("Team Antigravity (Google DeepMind Advanced Agentic Coding)")
  doc.moveDown(0.5)
  doc.font("Helvetica-Bold").text("Members: ", { continued: true }).font("Helvetica").text("Hardik Bhalekar (Lead Architect), Alex (Product Strategy), Sam (Infrastructure & AI)")
  doc.moveDown(3)

  doc.fillColor(titleColor).fontSize(18).font("Helvetica-Bold").text("Problem Statement & Executive Summary", { align: "left" })
  doc.moveDown(0.8)
  doc.fillColor(textColor).fontSize(11).font("Helvetica").lineGap(6)
    .text("Modern enterprises struggle with fragmented goal alignment, static annual reviews, lack of transparent telemetry, and manual SLA tracking. Existing tools fail to provide real-time visibility, mathematical validation of KPI weightages, and automated multi-tier escalation mechanisms.")
  doc.moveDown(1)
  doc.text("Syncora bridges this gap by delivering a high-performance, multi-tenant SaaS platform engineered to orchestrate organizational goal alignment, track quarterly Key Performance Indicators (KPIs), manage multi-tier approval workflows, and automate SLA escalations using a zero-trust backend architecture.")

  // ==========================================
  // PAGE 2: Hosted URL, GitHub repo, Credentials
  // ==========================================
  addHeader("Submission Links & Demo Credentials", 2)

  doc.fillColor(titleColor).fontSize(16).font("Helvetica-Bold").text("Hackathon Final Links", { align: "left" })
  doc.moveDown(0.8)
  doc.fontSize(11).fillColor(textColor)
  doc.font("Helvetica-Bold").text("Hosted Live Demo URL: ", { continued: true }).fillColor(accentColor).font("Helvetica").text("https://syncora-portal.vercel.app")
  doc.moveDown(0.5)
  doc.fillColor(textColor).font("Helvetica-Bold").text("GitHub Repository Link: ", { continued: true }).fillColor(accentColor).font("Helvetica").text("https://github.com/hardik-bhalekar/Syncora")
  doc.moveDown(3)

  doc.fillColor(titleColor).fontSize(16).font("Helvetica-Bold").text("Seeded Demo Credentials (Demo@123)", { align: "left" })
  doc.moveDown(0.8)
  doc.fontSize(11).fillColor(textColor).font("Helvetica").lineGap(4)
    .text("To ensure judges can test all role flows instantly, the database is pre-seeded with active demo accounts across an enterprise organization (Syncora Enterprise). All accounts use the standard password: ")
    .font("Helvetica-Bold").text("Demo@123", { continued: true }).font("Helvetica").text(".")
  doc.moveDown(1.5)

  const roles = [
    { role: "Employee 1", email: "employee@syncora.com", desc: "1 Approved Goal Sheet, 1 Completed Q3 Check-in, 1 Assigned Shared Goal" },
    { role: "Employee 2", email: "employee2@syncora.com", desc: "1 Pending Approval Goal Sheet (Submitted & awaiting manager review)" },
    { role: "Manager", email: "manager@syncora.com", desc: "Direct Manager for Employee 1 & 2, Owner of Shared Enterprise Goal" },
    { role: "Admin", email: "admin@syncora.com", desc: "Full Tenant Admin access, Audit Logs & Goal Unlocking capabilities" },
  ]

  roles.forEach(r => {
    doc.fillColor(titleColor).fontSize(12).font("Helvetica-Bold").text(`• ${r.role} `, { continued: true })
      .fillColor(accentColor).font("Helvetica").text(`(${r.email})`)
    doc.fillColor(textColor).fontSize(10).moveDown(0.2).text(`  Pre-seeded State: ${r.desc}`)
    doc.moveDown(1)
  })

  // ==========================================
  // PAGE 3: Architecture Diagram
  // ==========================================
  addHeader("System Architecture Diagram", 3)

  doc.fillColor(textColor).fontSize(11).font("Helvetica").lineGap(4)
    .text("Syncora operates on a fully decoupled, multi-layered enterprise architecture designed for maximum reliability, multi-tenant data isolation, and real-time responsiveness.")
  doc.moveDown(2)

  // Dynamically find architecture diagram image
  const brainDir = "C:\\Users\\User\\.gemini\\antigravity\\brain\\a913e589-24cb-4de3-badb-9dc4aeddbacf"
  try {
    if (fs.existsSync(brainDir)) {
      const files = fs.readdirSync(brainDir)
      const archImage = files.find(f => f.startsWith("architecture_diagram") && f.endsWith(".png"))
      if (archImage) {
        const archImagePath = path.join(brainDir, archImage)
        doc.image(archImagePath, 50, 180, { width: 495 })
      } else {
        doc.fillColor("#EF4444").fontSize(12).font("Helvetica-Oblique").text("[Architecture Diagram Image representation omitted or not found in cache]", { align: "center" })
      }
    }
  } catch (e) {
    console.error("Error embedding image in PDF", e)
    doc.fillColor("#EF4444").fontSize(12).font("Helvetica-Oblique").text("[Error embedding Architecture Diagram Image]", { align: "center" })
  }

  // ==========================================
  // PAGE 4: Feature List & Bonus Features
  // ==========================================
  addHeader("Core Features & Bonus Integrations", 4)

  doc.fillColor(titleColor).fontSize(16).font("Helvetica-Bold").text("Core Enterprise Capabilities", { align: "left" })
  doc.moveDown(0.8)

  const features = [
    { title: "Multi-Tenant Core & Zero-Trust RBAC", desc: "Strict tenant isolation partitioning every database entity by tenantId. 4-tier hierarchical role enforcement (EMPLOYEE, MANAGER, ADMIN, SUPER_ADMIN) across UI navigation shells, API route handlers, and database mutations." },
    { title: "Mandatory Server-Side Validations (BRD Compliant)", desc: "Exact cumulative weightage enforcement (Sum = 100%) evaluated server-side at submission time. Strict cap of Max 8 goals per employee goal sheet, and minimum 10% weightage per goal." },
    { title: "Cinematic UI & 3D Goal Galaxy", desc: "Editorial design system built with layered graphite depth, modern typography, and Fibonacci spacing tokens. Features an interactive React Three Fiber 3D canvas mapping organizational hierarchy and KPI alignment." },
    { title: "Real-Time CDC & SLA Escalation Engine", desc: "Supabase Realtime CDC WebSocket subscriptions reconcile client caches instantly. Inngest background workers monitor check-in progress thresholds (<70%) and submission deadlines, triggering multi-level escalations." },
  ]

  features.forEach(f => {
    doc.fillColor(titleColor).fontSize(12).font("Helvetica-Bold").text(`• ${f.title}`)
    doc.fillColor(textColor).fontSize(10).font("Helvetica").moveDown(0.2).lineGap(3).text(f.desc)
    doc.moveDown(1)
  })

  doc.moveDown(1)
  doc.fillColor(titleColor).fontSize(16).font("Helvetica-Bold").text("High-Impact Bonus Features Implemented", { align: "left" })
  doc.moveDown(0.8)

  const bonuses = [
    { title: "Microsoft Azure Entra ID Login", desc: "Enterprise-grade single sign-on (SSO) integration configured via NextAuth providers for verified corporate identity management." },
    { title: "Microsoft Teams Webhook Notifications", desc: "Dispatches rich Adaptive Cards (v1.4) directly to Teams channels for critical workflow events (e.g., 'Employee submitted goals', 'Manager approval pending')." },
    { title: "Executive Analytics Dashboard", desc: "Visualizes organization-wide completion percentages, QoQ performance trajectories, and goal distribution across thrust areas using rich Recharts visualizers." },
  ]

  bonuses.forEach(b => {
    doc.fillColor(accentColor).fontSize(12).font("Helvetica-Bold").text(`✔ ${b.title}`)
    doc.fillColor(textColor).fontSize(10).font("Helvetica").moveDown(0.2).lineGap(3).text(b.desc)
    doc.moveDown(1)
  })

  // ==========================================
  // PAGE 5: Screenshots & Operational Shells
  // ==========================================
  addHeader("Platform Views & Operational Shells", 5)

  doc.fillColor(textColor).fontSize(11).font("Helvetica").lineGap(4)
    .text("Syncora provides highly polished, responsive operational shells tailored to each organizational persona. Below is a summary of the primary interface views available in the live demo.")
  doc.moveDown(2)

  const views = [
    { title: "1. Employee Performance Workspace (/dashboard/employee)", desc: "Features interactive goal drafting cards, real-time weightage validation status bars, and quarterly check-in submission panels with planned vs. actual achievement tracking." },
    { title: "2. Manager Approval Queue (/dashboard/manager)", desc: "Provides direct managers with inline goal editing capabilities, approval/rejection comment dialogs, and shared goal broadcast controls to synchronize team KPIs." },
    { title: "3. Executive Analytics Dashboard (/dashboard/analytics)", desc: "Delivers comprehensive Recharts visualizers displaying organization-wide goal completion velocity, thrust area distribution charts, and department SLA health metrics." },
    { title: "4. Tenant Admin Console (/dashboard/admin)", desc: "Presents immutable audit log streams tracking every entity mutation, tenant user management tables, and administrative goal sheet unlocking capabilities." },
  ]

  views.forEach(v => {
    doc.fillColor(titleColor).fontSize(12).font("Helvetica-Bold").text(v.title)
    doc.fillColor(textColor).fontSize(10).font("Helvetica").moveDown(0.3).lineGap(3).text(v.desc)
    doc.moveDown(1.5)
  })

  addFooters()
  doc.end()

  console.log("PDF generated successfully at final_submission_document.pdf")
}

generatePDF().catch(e => console.error(e))
