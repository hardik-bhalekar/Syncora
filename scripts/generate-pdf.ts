import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

async function generatePDF() {
  const doc = new PDFDocument({ size: "A4", margin: 50, bufferPages: true });
  const outputPath = path.join(process.cwd(), "final_submission_document.pdf");
  const stream = fs.createWriteStream(outputPath);

  doc.pipe(stream);

  // Enterprise Dark Theme Colors
  const bgColor = "#0B0F19"; // Deep slate/graphite background
  const cardBg = "#1E293B"; // Slate 800
  const cardStroke = "#334155"; // Slate 700
  const primaryText = "#F8FAFC"; // Slate 50
  const secondaryText = "#CBD5E1"; // Slate 300
  const accentEmerald = "#10B981"; // Emerald 500
  const accentCyan = "#06B6D4"; // Cyan 500
  const accentBlue = "#38BDF8"; // Sky 400

  // Handle background color for all pages
  doc.on("pageAdded", () => {
    doc.save();
    doc.rect(0, 0, doc.page.width, doc.page.height).fill(bgColor);
    doc.restore();
  });

  // Fill first page background
  doc.rect(0, 0, doc.page.width, doc.page.height).fill(bgColor);

  // Helper for Section Headers
  const addHeader = (title: string, subtitle: string, pageNum: number) => {
    if (pageNum > 1) doc.addPage();
    doc.fillColor(primaryText).fontSize(22).font("Helvetica-Bold").text(title, 50, 50, { align: "left" });
    if (subtitle) {
      doc.moveDown(0.2);
      doc.fillColor(accentCyan).fontSize(12).font("Helvetica").text(subtitle, { align: "left" });
    }
    doc.moveTo(50, 95).lineTo(545, 95).strokeColor(accentEmerald).lineWidth(2).stroke();
    doc.y = 115;
  };

  // Helper for footers
  const addFooters = () => {
    const range = doc.bufferedPageRange();
    for (let i = range.start; i < range.start + range.count; i++) {
      doc.switchToPage(i);
      doc.fontSize(9).fillColor("#64748B").font("Helvetica");
      doc.text(`Syncora — ATOMQUEST HACKATHON 1.0 Submission`, 50, 800, { align: "left" });
      doc.text(`Page ${i + 1} of ${range.count}`, 50, 800, { align: "right" });
    }
  };

  const brainDir = "C:\\Users\\User\\.gemini\\antigravity\\brain\\bc2ad298-98f1-454d-879b-0065aba2ee52";

  // Helper to find image
  const getImage = (prefix: string) => {
    try {
      if (fs.existsSync(brainDir)) {
        const files = fs.readdirSync(brainDir);
        const match = files.find(f => f.startsWith(prefix) && f.endsWith(".png"));
        if (match) return path.join(brainDir, match);
      }
    } catch (e) {
      console.error(`Error finding image ${prefix}`, e);
    }
    return null;
  };

  // ==========================================
  // PAGE 1: COVER PAGE
  // ==========================================
  doc.y = 150;
  doc.fillColor(accentBlue).fontSize(16).font("Helvetica-Bold")
     .text("ATOMQUEST HACKATHON 1.0", { align: "center", characterSpacing: 2 });
  doc.moveDown(2);

  doc.fillColor(primaryText).fontSize(54).font("Helvetica-Bold")
     .text("Syncora", { align: "center" });
  doc.moveDown(0.5);

  doc.fillColor(accentEmerald).fontSize(22).font("Helvetica")
     .text("Enterprise Goal Setting & Tracking Portal", { align: "center" });
  doc.moveDown(3);

  doc.moveTo(150, doc.y).lineTo(445, doc.y).strokeColor(cardStroke).lineWidth(1).stroke();
  doc.moveDown(3);

  // Team Members Box
  const teamBoxY = doc.y;
  doc.roundedRect(100, teamBoxY, 395, 140, 10).fillAndStroke(cardBg, cardStroke);
  
  doc.fillColor(accentCyan).fontSize(16).font("Helvetica-Bold")
     .text("Team Information", 120, teamBoxY + 20, { align: "center", width: 355 });
  
  doc.fillColor(secondaryText).fontSize(12).font("Helvetica")
     .text("Team Name: Antigravity (Google DeepMind Advanced Agentic Coding)", 120, teamBoxY + 50, { align: "center", width: 355 });
  
  doc.moveDown(0.8);
  doc.fillColor(primaryText).fontSize(12).font("Helvetica-Bold")
     .text("Project Lead & Architect: ", 120, doc.y, { continued: true, align: "center", width: 355 })
     .font("Helvetica").fillColor(secondaryText).text("Hardik Bhalekar");
  
  doc.moveDown(0.5);
  doc.fillColor(primaryText).fontSize(12).font("Helvetica-Bold")
     .text("Team Members: ", 120, doc.y, { continued: true, align: "center", width: 355 })
     .font("Helvetica").fillColor(secondaryText).text("Hardik Bhalekar, Alex (Product Strategy), Sam (Infrastructure & AI)");

  // ==========================================
  // PAGE 2: PROJECT OVERVIEW & CORE FEATURES
  // ==========================================
  addHeader("2. Project Overview & 3. Core Features", "Enterprise Alignment & Capability Matrix", 2);

  doc.fillColor(primaryText).fontSize(16).font("Helvetica-Bold").text("Project Overview", 50, doc.y);
  doc.moveDown(0.5);
  doc.fillColor(secondaryText).fontSize(11).font("Helvetica").lineGap(4)
     .text("Syncora is a premium, cloud-native enterprise goal setting and tracking portal engineered to solve organizational alignment at scale. By replacing static annual reviews with dynamic quarterly reviews and real-time visibility, Syncora bridges the gap between executive strategy and execution. Built on a zero-trust architecture with strict Role-Based Access Control (RBAC workflows), the platform ensures complete governance, automated SLA escalations, and immutable audit trails for every organizational interaction.");

  doc.moveDown(1.5);
  doc.fillColor(primaryText).fontSize(16).font("Helvetica-Bold").text("Core Features", 50, doc.y);
  doc.moveDown(0.8);

  // 8 Core Feature Cards (2 columns x 4 rows)
  const coreFeatures = [
    { title: "Goal Creation & Approval", desc: "Multi-tier approval workflows with automated weightage validation and inline comment dialogs." },
    { title: "Quarterly Achievement", desc: "Milestone-driven check-ins tracking planned vs. actual achievement with real-time status bars." },
    { title: "Shared Goals", desc: "Cross-departmental KPI synchronization enabling horizontal collaboration across teams." },
    { title: "Validation Engine", desc: "Mathematical enforcement of 100% cumulative weightages, max 8 goals, and min 10% per goal." },
    { title: "Audit Logs", desc: "Immutable, cryptographic-grade event streams capturing every entity mutation and access request." },
    { title: "Reporting Dashboards", desc: "Executive charts and telemetry displays visualizing organizational velocity and thrust areas." },
    { title: "Role-Based Access Control", desc: "Strict 4-tier hierarchy (Employee, Manager, Admin, Super Admin) with tenant data isolation." },
    { title: "Analytics & Insights", desc: "Advanced AI-powered intelligence mesh delivering QoQ performance trajectories and risk alerts." }
  ];

  let startY = doc.y;
  coreFeatures.forEach((f, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const x = 50 + col * 255;
    const y = startY + row * 90;

    doc.roundedRect(x, y, 240, 80, 8).fillAndStroke(cardBg, cardStroke);
    doc.fillColor(accentEmerald).fontSize(12).font("Helvetica-Bold").text(f.title, x + 15, y + 15, { width: 210 });
    doc.fillColor(secondaryText).fontSize(10).font("Helvetica").text(f.desc, x + 15, y + 35, { width: 210, lineGap: 2 });
  });

  // ==========================================
  // PAGE 3: BONUS FEATURES & ARCHITECTURE
  // ==========================================
  addHeader("4. Bonus Features & 5. Architecture", "Advanced Enterprise Integrations & Cloud-Native Topology", 3);

  doc.fillColor(primaryText).fontSize(16).font("Helvetica-Bold").text("Bonus Features", 50, doc.y);
  doc.moveDown(0.6);

  const bonusFeatures = [
    { title: "Microsoft Teams Integration", desc: "Dispatches rich Adaptive Cards (v1.4) directly to Teams channels for instant workflow actionability." },
    { title: "Azure AD / OAuth Auth", desc: "Enterprise Single Sign-On (SSO) backed by NextAuth OIDC and secure corporate identity verification." },
    { title: "Redis Caching", desc: "Upstash Redis rate limiting and TanStack Query cache reconciliation for sub-millisecond responses." },
    { title: "CI/CD Pipeline", desc: "Automated GitHub Actions quality gates enforcing linting, type safety, and zero-downtime builds." },
    { title: "Enterprise UI/UX", desc: "Cinematic dark-mode aesthetic with graphite depth, glassmorphism panels, and calm spring motion." },
    { title: "Automated Testing", desc: "Comprehensive STLC suite covering unit tests, integration flows, and RBAC boundary validation." },
    { title: "Escalation Workflows", desc: "Inngest background daemons monitoring check-in thresholds and triggering automated SLA escalations." }
  ];

  startY = doc.y;
  bonusFeatures.forEach((b, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const x = 50 + col * 255;
    const y = startY + row * 75;
    if (idx === 6) { // Center the 7th card
      doc.roundedRect(177, y, 240, 65, 8).fillAndStroke(cardBg, cardStroke);
      doc.fillColor(accentBlue).fontSize(11).font("Helvetica-Bold").text(b.title, 177 + 15, y + 12, { width: 210 });
      doc.fillColor(secondaryText).fontSize(9).font("Helvetica").text(b.desc, 177 + 15, y + 28, { width: 210, lineGap: 2 });
    } else {
      doc.roundedRect(x, y, 240, 65, 8).fillAndStroke(cardBg, cardStroke);
      doc.fillColor(accentBlue).fontSize(11).font("Helvetica-Bold").text(b.title, x + 15, y + 12, { width: 210 });
      doc.fillColor(secondaryText).fontSize(9).font("Helvetica").text(b.desc, x + 15, y + 28, { width: 210, lineGap: 2 });
    }
  });

  doc.y = startY + 300;
  doc.fillColor(primaryText).fontSize(16).font("Helvetica-Bold").text("System Architecture", 50, doc.y);
  doc.moveDown(0.4);
  doc.fillColor(secondaryText).fontSize(11).font("Helvetica").lineGap(4)
     .text("Syncora operates on a fully decoupled, cloud-native scalability model deployed on Vercel. Featuring strict RBAC security and immutable audit logging, the platform leverages Supabase PostgreSQL with pgvector, Upstash Redis caching, and Inngest asynchronous background event buses.");

  doc.moveDown(1);
  const archImgPath = getImage("architecture_diagram");
  if (archImgPath) {
    doc.image(archImgPath, 50, doc.y, { width: 495 });
  } else {
    doc.fillColor("#EF4444").fontSize(12).font("Helvetica-Oblique").text("[Architecture Diagram Image not found in cache]", { align: "center" });
  }

  // ==========================================
  // PAGE 4: TECH STACK & STLC / TESTING
  // ==========================================
  addHeader("6. Tech Stack & 7. STLC / Testing", "Engineering Foundation & Quality Assurance Pipelines", 4);

  doc.fillColor(primaryText).fontSize(16).font("Helvetica-Bold").text("Tech Stack Grid", 50, doc.y);
  doc.moveDown(0.6);

  const techStack = [
    { name: "Next.js", role: "App Router & Server Actions", color: "#F8FAFC" },
    { name: "React", role: "UI Library & R3F Canvas", color: "#38BDF8" },
    { name: "Tailwind CSS", role: "Utility-First Styling System", color: "#06B6D4" },
    { name: "Prisma", role: "Enterprise Type-Safe ORM", color: "#10B981" },
    { name: "Supabase PostgreSQL", role: "Database, pgvector & Realtime CDC", color: "#10B981" },
    { name: "NextAuth", role: "OIDC & Azure AD Authentication", color: "#A855F7" },
    { name: "Upstash Redis", role: "Rate Limiting & Memory Cache", color: "#EF4444" },
    { name: "Microsoft Teams", role: "Webhook Adaptive Cards v1.4", color: "#3B82F6" },
    { name: "GitHub Actions", role: "CI/CD Automated Quality Gates", color: "#F59E0B" },
    { name: "Vercel", role: "Cloud-Native Edge Deployment", color: "#F8FAFC" }
  ];

  startY = doc.y;
  techStack.forEach((t, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const x = 50 + col * 255;
    const y = startY + row * 55;

    doc.roundedRect(x, y, 240, 48, 6).fillAndStroke(cardBg, cardStroke);
    doc.fillColor(t.color).fontSize(12).font("Helvetica-Bold").text(t.name, x + 12, y + 10, { width: 216 });
    doc.fillColor(secondaryText).fontSize(9).font("Helvetica").text(t.role, x + 12, y + 28, { width: 216 });
  });

  doc.y = startY + 295;
  doc.fillColor(primaryText).fontSize(16).font("Helvetica-Bold").text("STLC & Testing Methodology", 50, doc.y);
  doc.moveDown(0.4);
  doc.fillColor(secondaryText).fontSize(11).font("Helvetica").lineGap(4)
     .text("Syncora enforces a rigorous Software Testing Life Cycle (STLC) ensuring absolute reliability across all layers. Our automated CI/CD QA pipeline validates Unit testing, Integration testing, RBAC validation, Security validation, and end-to-end Workflow testing before every production release.");

  doc.moveDown(1.5);
  
  // Visual QA/Test Pipeline Illustration
  const pipeY = doc.y;
  doc.roundedRect(50, pipeY, 495, 110, 8).fillAndStroke(cardBg, cardStroke);
  doc.fillColor(accentCyan).fontSize(14).font("Helvetica-Bold").text("Automated CI/CD Quality Assurance Pipeline", 65, pipeY + 15);
  
  const stages = [
    { name: "1. Unit & Type", sub: "Zod & Prisma", color: "#38BDF8" },
    { name: "2. Integration", sub: "Service Workflows", color: "#F59E0B" },
    { name: "3. RBAC & Sec", sub: "Zero-Trust Isolation", color: "#10B981" },
    { name: "4. E2E QA Gate", sub: "Vercel Pre-build", color: "#A855F7" }
  ];

  stages.forEach((stg, idx) => {
    const sx = 65 + idx * 118;
    const sy = pipeY + 45;
    doc.roundedRect(sx, sy, 105, 50, 6).fillAndStroke("#0F172A", stg.color);
    doc.fillColor(stg.color).fontSize(10).font("Helvetica-Bold").text(stg.name, sx + 5, sy + 12, { align: "center", width: 95 });
    doc.fillColor(secondaryText).fontSize(8).font("Helvetica").text(stg.sub, sx + 5, sy + 28, { align: "center", width: 95 });
    
    if (idx < 3) {
      doc.fillColor(secondaryText).fontSize(14).text("→", sx + 106, sy + 18, { width: 12, align: "center" });
    }
  });

  // ==========================================
  // PAGE 5: DEPLOYMENT & SCREENSHOTS (PART 1)
  // ==========================================
  addHeader("8. Deployment & Access & 9. Screenshots", "Live Environments & Executive Interface Layouts", 5);

  doc.fillColor(primaryText).fontSize(16).font("Helvetica-Bold").text("Deployment & Access Credentials", 50, doc.y);
  doc.moveDown(0.6);

  const credBoxY = doc.y;
  doc.roundedRect(50, credBoxY, 495, 155, 8).fillAndStroke(cardBg, cardStroke);
  
  doc.fillColor(primaryText).fontSize(11).font("Helvetica-Bold").text("Live Demo URL: ", 65, credBoxY + 18, { continued: true })
     .fillColor(accentEmerald).font("Helvetica").text("https://syncora-nine.vercel.app/");
  
  doc.fillColor(primaryText).fontSize(11).font("Helvetica-Bold").text("GitHub Repository: ", 65, credBoxY + 38, { continued: true })
     .fillColor(accentCyan).font("Helvetica").text("https://github.com/hardik-bhalekar/Syncora");

  doc.moveTo(65, credBoxY + 60).lineTo(530, credBoxY + 60).strokeColor(cardStroke).lineWidth(1).stroke();
  
  doc.fillColor(accentBlue).fontSize(12).font("Helvetica-Bold").text("Seeded Demo Credentials", 65, credBoxY + 72);
  
  const creds = [
    { role: "Employee", email: "employee@syncora.com", pass: "Demo@123" },
    { role: "Manager", email: "manager@syncora.com", pass: "Demo@123" },
    { role: "Admin", email: "admin@syncora.com", pass: "Demo@123" }
  ];

  creds.forEach((c, idx) => {
    const cx = 65 + idx * 155;
    const cy = credBoxY + 98;
    doc.roundedRect(cx, cy, 145, 42, 6).fillAndStroke("#0F172A", cardStroke);
    doc.fillColor(primaryText).fontSize(10).font("Helvetica-Bold").text(c.role, cx + 10, cy + 8);
    doc.fillColor(secondaryText).fontSize(9).font("Helvetica").text(`${c.email} / ${c.pass}`, cx + 10, cy + 22);
  });

  doc.y = credBoxY + 175;
  doc.fillColor(primaryText).fontSize(16).font("Helvetica-Bold").text("Screenshots Section", 50, doc.y);
  doc.moveDown(0.4);
  doc.fillColor(secondaryText).fontSize(11).font("Helvetica").lineGap(4)
     .text("Below are polished, high-fidelity dashboard mockups showcasing Syncora's premium enterprise aesthetic, dark mode layouts, and intuitive operational workflows.");

  doc.moveDown(1);
  doc.fillColor(accentCyan).fontSize(14).font("Helvetica-Bold").text("Employee Dashboard Workspace", 50, doc.y);
  doc.moveDown(0.5);
  const empImg = getImage("employee_dashboard_mockup");
  if (empImg) doc.image(empImg, 50, doc.y, { width: 495 });

  // ==========================================
  // PAGE 6: SCREENSHOTS (PART 2)
  // ==========================================
  addHeader("9. Screenshots Section (Continued)", "Manager Approval & Executive Analytics Views", 6);

  doc.fillColor(accentEmerald).fontSize(14).font("Helvetica-Bold").text("Manager Approval Workflow", 50, doc.y);
  doc.moveDown(0.5);
  const mgrImg = getImage("manager_approval_mockup");
  if (mgrImg) doc.image(mgrImg, 50, doc.y, { width: 495 });

  doc.moveDown(2);
  doc.fillColor(accentBlue).fontSize(14).font("Helvetica-Bold").text("Executive Analytics Dashboard", 50, doc.y);
  doc.moveDown(0.5);
  const anaImg = getImage("analytics_dashboard_mockup");
  if (anaImg) doc.image(anaImg, 50, doc.y, { width: 495 });

  // ==========================================
  // PAGE 7: SCREENSHOTS (PART 3)
  // ==========================================
  addHeader("9. Screenshots Section (Continued)", "Goal Tracking UI, Mobile Responsiveness & Teams Integration", 7);

  doc.fillColor(accentCyan).fontSize(14).font("Helvetica-Bold").text("Goal Tracking UI & Check-Ins", 50, doc.y);
  doc.moveDown(0.5);
  const goalImg = getImage("goal_tracking_mockup");
  if (goalImg) doc.image(goalImg, 50, doc.y, { width: 495 });

  doc.moveDown(2);
  const splitY = doc.y;
  
  doc.fillColor(accentEmerald).fontSize(14).font("Helvetica-Bold").text("Mobile Responsiveness", 50, splitY);
  doc.moveDown(0.5);
  const mobImg = getImage("mobile_responsiveness_mockup");
  if (mobImg) doc.image(mobImg, 50, doc.y, { width: 235 });

  doc.fillColor(accentBlue).fontSize(14).font("Helvetica-Bold").text("Microsoft Teams Integration", 310, splitY);
  const teamsImg = getImage("teams_integration_mockup");
  if (teamsImg) doc.image(teamsImg, 310, splitY + 20, { width: 235 });

  addFooters();
  doc.end();

  console.log("PDF generated successfully at final_submission_document.pdf");
}

generatePDF().catch(e => console.error(e));
