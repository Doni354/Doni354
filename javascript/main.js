/**
 * AIDIL FITRAH ROMADHONI (DONI) — OFFICIAL PORTFOLIO JAVASCRIPT
 * Real-time Clock, Theme Switching, Project Filtering, Modal Dialogs & Micro-interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initClock();
  initNav();
  initProjectFilters();
  initProjectModals();
  initCopyActions();
  initContactForm();
  initKeyboardShortcuts();
});

/* ==========================================================================
   1. Theme Management (Dark / Light with System Preference & LocalStorage)
   ========================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeIcon');
  
  // Detect saved preference or system default
  const savedTheme = localStorage.getItem('doni-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    setTheme('dark');
  } else {
    setTheme('light');
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      playClickSound();
      const isDark = document.documentElement.classList.contains('dark');
      setTheme(isDark ? 'light' : 'dark');
    });
  }

  // Listen to system changes if user hasn't explicitly overridden
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('doni-theme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });
}

function setTheme(theme) {
  const themeIcon = document.getElementById('themeIcon');
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
    document.documentElement.style.colorScheme = 'dark';
    localStorage.setItem('doni-theme', 'dark');
    if (themeIcon) {
      themeIcon.className = 'fa-solid fa-sun';
    }
  } else {
    document.documentElement.classList.remove('dark');
    document.documentElement.style.colorScheme = 'light';
    localStorage.setItem('doni-theme', 'light');
    if (themeIcon) {
      themeIcon.className = 'fa-solid fa-moon';
    }
  }
}

/* ==========================================================================
   2. Live Surabaya / WIB Digital Clock
   ========================================================================== */
function initClock() {
  const clockEl = document.getElementById('surabayaClock');
  const dateEl = document.getElementById('surabayaDate');
  
  function update() {
    const now = new Date();
    // Options for Western Indonesia Time (WIB, Asia/Jakarta)
    const timeFormatter = new Intl.DateTimeFormat('id-ID', {
      timeZone: 'Asia/Jakarta',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    
    const dateFormatter = new Intl.DateTimeFormat('id-ID', {
      timeZone: 'Asia/Jakarta',
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    if (clockEl) {
      clockEl.textContent = `${timeFormatter.format(now)} WIB`;
    }
    if (dateEl) {
      dateEl.textContent = dateFormatter.format(now);
    }
  }

  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   3. Navigation, Active Observer & Mobile Drawer
   ========================================================================== */
function initNav() {
  const mobileToggle = document.getElementById('mobileNavToggle');
  const mobileMenu = document.getElementById('mobileNavMenu');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      playClickSound();
      mobileMenu.classList.toggle('open');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.className = mobileMenu.classList.contains('open') ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
      }
    });

    // Close mobile menu when clicking outside or on a link
    document.addEventListener('click', (e) => {
      if (!mobileToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.remove('open');
        const icon = mobileToggle.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-bars';
      }
    });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileMenu) {
        mobileMenu.classList.remove('open');
        const icon = mobileToggle ? mobileToggle.querySelector('i') : null;
        if (icon) icon.className = 'fa-solid fa-bars';
      }
    });
  });

  // Active section tracking on scroll
  const sections = document.querySelectorAll('section[id], div[id="hero"]');
  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 160;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   4. Project Filtering
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playClickSound();
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category.includes(filter)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* ==========================================================================
   5. Project Modals & Detailed Previews
   ========================================================================== */
const projectsData = {
  velinked: {
    title: "VeLinked — Real-Time IoT Fleet & Device Telemetry",
    category: "IoT & Real-Time Telemetry Platform",
    image: "assets/VeLinked.png",
    description: "VeLinked is a state-of-the-art vehicle and device telematics dashboard engineered to communicate bi-directionally with connected hardware via Firebase. Designed for fleet management, the platform tracks real-time sensor streams, battery metrics, engine diagnostics, and geographical coordinates with sub-second latency.",
    problemSolution: "Traditional fleet management suffers from disjointed data reporting and delayed vehicle status updates. VeLinked solves this by creating a unified reactive data bridge between ESP32/IoT nodes and a browser interface using Firebase Realtime Database and Firestore, allowing operators to monitor fleet health and receive instant alarms.",
    features: [
      "Real-time bidirectional device synchronization using Firebase",
      "Live sensor visualization (GPS, speed, battery, diagnostic status)",
      "Multi-vehicle monitoring dashboard with online/offline health badges",
      "Instant push alerts on critical anomaly detection",
      "Responsive, touch-friendly UI for operations centers and mobile tablets"
    ],
    tech: ["Firebase Firestore", "Realtime Database", "JavaScript (ES6+)", "IoT Telemetry", "WebSockets", "CSS3 Grid"],
    liveUrl: "https://velinked-web.web.app/",
    githubUrl: null
  },
  kasir: {
    title: "Kasir.IDon — Enterprise Point-of-Sale (POS) & Retail ERP",
    category: "Full-Stack System • UKK SMK Certified",
    image: "assets/KasirIDon.png",
    description: "Kasir.IDon is an enterprise-grade POS and inventory accounting software crafted for retail and commercial businesses. Built as a premier competency certification (UKK RPL) project, it encapsulates full retail lifecycle operations: multi-role access control, barcode-ready sales terminals, inventory ledgering, automated stock thresholds, and receipt printing.",
    problemSolution: "Small-to-medium retail outlets often lose revenue due to inaccurate inventory counts and slow checkout processing. Kasir.IDon addresses this with an optimized transactional database model, automated low-stock notifications, customer loyalty discounts, and visual sales velocity charts.",
    features: [
      "Multi-role role-based authentication (Admin, Manager, Cashier)",
      "Instant POS transaction checkout with automated change calculation",
      "Inventory tracking with automatic restock alert triggers",
      "Membership management and tiered discount point calculation",
      "Comprehensive revenue reports with date-range filters & exportable receipts",
      "Visual sales performance charts powered by Chart.js"
    ],
    tech: ["Laravel (PHP)", "MySQL", "JavaScript", "Blade Templating", "Chart.js", "Bootstrap", "Receipt Engine"],
    liveUrl: null,
    githubUrl: "https://github.com/Doni354/Kasir.IDon"
  },
  foodies: {
    title: "Foodies — Interactive Culinary E-Commerce Platform",
    category: "Web Application • Culinary Commerce",
    image: "assets/Foodies.png",
    description: "Foodies is an end-to-end culinary shopping platform developed to streamline food and beverage ordering. It features a modern product catalog, dynamic cart management, order submission workflows, and an administrative control panel for real-time inventory and pricing updates.",
    problemSolution: "Built during Doni's early web development journey to answer a real merchant request, Foodies replaces paper ordering with a smooth digital menu, reducing ordering friction and empowering owners with central order tracking.",
    features: [
      "Dynamic product showcase with category filtering & pricing",
      "Interactive cart with client-side quantity management",
      "Customer checkout flow with direct order recording",
      "Admin portal for full product CRUD (Create, Read, Update, Delete) & pricing",
      "Responsive layout optimized for smartphones and desktop ordering"
    ],
    tech: ["PHP", "MySQL", "JavaScript", "CSS3", "Responsive UI"],
    liveUrl: "https://foodiesxiakl1.000webhostapp.com/",
    githubUrl: "https://github.com/Doni354/Foodies"
  },
  eppg: {
    title: "E-PPG — Regional Attendance & Syllabus Management",
    category: "Full-Stack System • Multi-Regional Education",
    image: "assets/EPPG.png",
    description: "E-PPG is a centralized regional attendance and educational material tracking system engineered to serve multi-branch learning institutions. It allows regional teachers and branch admins to record daily attendance, upload course materials, and monitor student participation in real time.",
    problemSolution: "Educational organizations spanning multiple regional branches frequently face data fragmentation and manual reporting delays. E-PPG centralizes branch student data into a unified database, enabling cross-region analytics and automated attendance audits.",
    features: [
      "Multi-regional administrative portal with branch-specific permissions",
      "Live daily attendance logger with timestamp and status records",
      "Course curriculum and material repository accessible by authorized educators",
      "Regional aggregation dashboard for student attendance rate inspection",
      "Data export and regional performance auditing"
    ],
    tech: ["PHP", "MySQL", "JavaScript", "Role Auth", "Data Tables", "CSS3"],
    liveUrl: null,
    githubUrl: "https://github.com/Doni354/E-PPG"
  },
  smartschool: {
    title: "SmartSchool — Student Permission Management Platform",
    category: "Production Web App • School Governance",
    image: "assets/smartschool.png",
    description: "SmartSchool is an active, production-grade web application engineered to manage and streamline student leave permissions across school institutions. Actively deployed and trusted to handle over 1,000+ permit requests with complete digital verification trails.",
    problemSolution: "Paper-based school permission slips are notoriously vulnerable to loss, unauthorized approval, and lack of accountability. SmartSchool replaces paper slips with an automated cloud approval pipeline, enabling administrative staff and teachers to instantly inspect student attendance records.",
    features: [
      "Digital student leave authorization handling 1,000+ live permit records",
      "Administrative approval dashboard with instant search and status filtering",
      "Real-time database integration via Firebase Firestore",
      "Mobile-friendly interface accessible across smartphones and classroom desktops"
    ],
    tech: ["Firebase", "JavaScript", "Cloud Firestore", "Responsive UI"],
    liveUrl: "https://smartschool-34158.web.app/",
    githubUrl: null
  },
  infria: {
    title: "INFRIA — Universal Conversational AI Infrastructure",
    category: "PKM-KI • AI Infrastructure & Platform",
    image: "assets/infria.png",
    description: "INFRIA (AI Infrastructure for Applications) is an enterprise AI backend layer designed to bridge disparate software ecosystems with conversational AI, RAG knowledge retrieval, and dynamic function calling without requiring developers to build custom AI pipelines from scratch.",
    problemSolution: "Integrating specialized AI conversational workflows into existing mobile or web apps typically requires months of custom model fine-tuning and backend middleware. INFRIA solves this by offering a unified API gateway and SDKs that orchestrate LLM requests, dynamic function execution, and workflow automations seamlessly.",
    features: [
      "Unified AI API gateway & microservice architecture for client applications",
      "Dynamic Function Calling enabling AI to trigger application actions directly",
      "Retrieval-Augmented Generation (RAG) knowledge retrieval pipelines",
      "Workflow automation and webhook triggers powered by n8n and Node.js",
      "Flutter SDK and Next.js portal integration for rapid deployment"
    ],
    tech: ["Next.js", "Node.js", "Express", "Firebase Functions", "Firestore", "n8n", "Flutter SDK", "LLM"],
    liveUrl: null,
    githubUrl: null
  },
  vorce: {
    title: "Vorce — Business Collaboration & Task Management Backend",
    category: "Production Backend • Enterprise SaaS",
    image: "assets/vorce.png",
    description: "Vorce is an enterprise operations and team collaboration platform. As backend engineer, architected the core RESTful task management endpoints, multi-tenant company schemas, state transition workflows, and Firestore security access levels.",
    problemSolution: "Modern enterprise teams struggle with fractured task coordination and lack of verified proof-of-work evidence. Designed robust backend data models (/companies/{idCompany}/tasks/{taskId}) supporting seamless status transitions and role-based permissions.",
    features: [
      "Scalable RESTful API for task lifecycle management (In-Progress, Pending, Completed)",
      "Multi-tenant company data isolation and role authorization in Firestore",
      "Task completion evidence submission and gamified point reward calculations",
      "Admin verification workflows and automated state synchronization",
      "Production deployment supporting the official Vorce mobile app on Google Play"
    ],
    tech: ["Node.js", "Firebase Firestore", "RESTful API", "Cloud Functions", "GCP"],
    liveUrl: "https://vorce.id/",
    githubUrl: null
  },
  spmb: {
    title: "SPMB / PPDB Tulungagung — Admissions Dashboard & Load Testing",
    category: "Client Project • Government Admissions",
    image: "assets/spmb.png",
    description: "Tailored administrative dashboard and frontend UI redesign for the Junior High School (SMP) student admissions system in Tulungagung Regency. Executed high-concurrency load and stress testing using the k6 engine.",
    problemSolution: "Admissions periods produce massive concurrent spikes that often bring regional registration servers down. Conducted systematic load testing simulating thousands of concurrent applicants with k6, benchmarked bottlenecks, and provided optimized dashboard views for school operators.",
    features: [
      "Modernized administrative dashboard for applicant processing and verification",
      "High-concurrency load testing and bottleneck profiling with k6",
      "Real-time applicant distribution statistics and regional quota visualization",
      "Optimized frontend asset delivery for high-traffic peak periods"
    ],
    tech: ["Web Development", "k6 (Load Testing)", "JavaScript", "Bootstrap", "REST API"],
    liveUrl: null,
    githubUrl: null
  },
  elecomp: {
    title: "PT Elecomp Software House — 25+ Client Websites & SEO Optimization",
    category: "6-Month Internship • Software House",
    image: "assets/elecomp.png",
    description: "Completed an intensive 6-month software house internship at PT Elecomp Software House (July – December 2024), developing around 25 client company profile websites, technical on-page SEO architectures, and Google PageSpeed optimizations.",
    problemSolution: "Businesses frequently suffer from slow website load times and low Google visibility. Conducted audits, eliminated render-blocking resources, optimized image compression pipelines, and built high-converting responsive company profiles.",
    features: [
      "Engineered ~25 responsive company profile websites tailored to business clients",
      "On-page technical SEO optimization boosting Google search indexation",
      "Core Web Vitals & PageSpeed optimization achieving high mobile scores",
      "Cross-browser testing and responsive design implementation"
    ],
    tech: ["HTML5", "CSS3", "JavaScript", "PHP", "SEO Tuning", "PageSpeed Insights"],
    liveUrl: null,
    githubUrl: null
  },
  wisnufarma: {
    title: "WisnuFarma & CMS Module — Pharmacy Web Application",
    category: "Haltec Client • Healthcare Commerce",
    image: "assets/wisnufarma.png",
    description: "Developed core CMS modules and pharmacy management features for the WisnuFarma web application in collaboration with Haltec / HalteCreative software house.",
    problemSolution: "Pharmaceutical businesses need secure, structured administrative control to manage medicine inventories, categories, and public informational portals. Built customized CMS modules integrated directly into the production web system.",
    features: [
      "Dedicated CMS administrative control panel for medicine and content management",
      "Secure authentication and session verification protocols",
      "Clean modular code integrated into the production WisnuFarma platform",
      "Responsive user interface optimized for desktop and mobile pharmacists"
    ],
    tech: ["PHP", "JavaScript", "MySQL", "CMS Architecture", "Responsive CSS"],
    liveUrl: "https://wisnu-farma.com/login",
    githubUrl: null
  },
  noury: {
    title: "Noury — POS & Pre-Order Commerce Platform",
    category: "Academic Entrepreneurship • Commerce Platform",
    image: "assets/noury.png",
    description: "Noury is a Point-of-Sale (POS) and merchandise pre-order management platform created for university entrepreneurship initiatives. Encapsulates transaction accounting, inventory tracking, and customer pre-order workflows.",
    problemSolution: "Pre-order merchandise campaigns frequently suffer from disorganized order logs and payment confusion. Noury unifies order intake, payment verification, and delivery tracking in one intuitive web platform.",
    features: [
      "Point of Sale (POS) transaction register with rapid order entry",
      "Pre-order merchandise management tracking customer order stages",
      "Inventory tracking with stock availability limits",
      "Cloudinary asset storage for product photography and promotional banners"
    ],
    tech: ["Next.js", "Firebase", "Cloudinary", "Vercel", "TailwindCSS"],
    liveUrl: "https://noury-se.vercel.app/",
    githubUrl: "https://github.com/Doni354/black-market"
  },
  simplempg: {
    title: "Simple MPG — Instant Browser Mini-Games Hub",
    category: "Web Platform • Game Development",
    image: "assets/simplempg.png",
    description: "Simple MPG (Multiplayer Games) is an instant-play browser gaming platform requiring zero downloads. Features Tic Tac Toe with intelligent AI opponent algorithms and real-time multiplayer synced via Firebase.",
    problemSolution: "Casual online games are usually weighed down by mandatory app downloads and intrusive ads. Simple MPG provides a featherweight, instant-play web hub where users can immediately challenge an AI or invite friends via link.",
    features: [
      "Zero-install browser gameplay running on lightweight native canvas & DOM",
      "Tic Tac Toe with smart AI opponent powered by minimax decision algorithms",
      "Real-time peer-to-peer multiplayer mode synchronized via Firebase",
      "Clean tactile UI designed for touchscreens and desktop screens alike"
    ],
    tech: ["JavaScript (ES6+)", "Firebase Realtime DB", "HTML5 Canvas", "CSS3 Animations"],
    liveUrl: "https://simplempg-6c08f.web.app/",
    githubUrl: null
  },
  classlyai: {
    title: "Classly AI — AI-Augmented Learning Management System",
    category: "ZTE Competition • AI EdTech Concept",
    image: "assets/classlyai.png",
    description: "Backend developer and AI integration specialist for an AI-powered Learning Management System (LMS) created for the national ZTE innovation competition. Concept served as the foundational forerunner to INFRIA.",
    problemSolution: "Conventional LMS portals present one-size-fits-all materials without interactive feedback. Integrated conversational AI assist to guide learners through complex coursework and provide personalized hints.",
    features: [
      "Conversational AI tutoring integration for student assignment assistance",
      "Backend REST API architecture supporting course materials and submissions",
      "Evaluated architectural bottlenecks leading to the creation of universal AI backend (INFRIA)",
      "Multi-role user authentication separating students, teachers, and guardians"
    ],
    tech: ["Node.js", "Express", "AI Integration", "RESTful API", "Cloud Storage"],
    liveUrl: null,
    githubUrl: null
  },
  cetakkartu: {
    title: "Web Cetak Kartu Pelajar — ID Card Generator",
    category: "Administrative Tool • Automation",
    image: "assets/cetakkartu.png",
    description: "An automated web application designed to generate student ID cards in bulk. Fetches roster data from Google Sheets API, pairs student portraits, and formats pixel-perfect A4 printing templates.",
    problemSolution: "Creating hundreds of student ID cards manually in graphic software consumes days of repetitive labor. This tool automates data ingestion, photo alignment, and A4 print layout generation in seconds.",
    features: [
      "Automated roster synchronization from Google Sheets API",
      "Cloudinary portrait image processing and dynamic scaling",
      "Pixel-perfect A4 grid print layout calibrated for standard laminators",
      "Automated student barcode and QR code generation"
    ],
    tech: ["JavaScript", "Google Sheets API", "Cloudinary", "CSS Print Media", "Vercel"],
    liveUrl: "https://cetak-kartu-pelajar.vercel.app/",
    githubUrl: "https://github.com/Doni354/cetak-kartu-pelajar"
  },
  rfid: {
    title: "IoT RFID Attendance System — Microcontroller to Cloud",
    category: "IoT & Embedded • Cloud Telemetry",
    image: "assets/rfid.png",
    description: "An internet-connected hardware attendance solution combining RFID contactless smartcard readers, an ESP32/microcontroller, and real-time Google Sheets cloud logging.",
    problemSolution: "Physical attendance sheets cause administrative queues and manual entry errors. Built an autonomous IoT scanner that reads contactless RFID cards and automatically logs verified timestamps to the cloud.",
    features: [
      "High-speed contactless card UID scanning via RC522 RFID module",
      "Autonomous WiFi telemetry streaming attendance records to Google Sheets",
      "Local audio-visual status feedback (LED indicator & buzzer confirmation)",
      "Tamper-resistant student identification and timestamp verification"
    ],
    tech: ["ESP32 / ESP8266", "C++", "RFID RC522", "Google Sheets API", "IoT Telemetry"],
    liveUrl: null,
    githubUrl: "https://github.com/Doni354/Absensi-RFID"
  },
  bemweb: {
    title: "Riset BEM Goes to Desa 2026 — Web Platform",
    category: "Community Platform • Information Portal",
    image: "assets/BEM.png",
    description: "Portal web publikasi resmi untuk program Riset BEM Goes to Desa 2026. Menyajikan dokumentasi riset desa, transparansi program pengabdian, dan kanal informasi bagi masyarakat serta mahasiswa.",
    problemSolution: "Program pengabdian masyarakat sering terkendala keterbatasan akses informasi publik dan pelaporan dokumentasi yang terpusat. Dibangun web platform cepat dan responsif agar luaran riset dan kegiatan mahasiswa dapat diakses transparan oleh seluruh pihak.",
    features: [
      "Portal web publikasi riset dan dokumentasi kegiatan BEM Goes to Desa 2026",
      "Deployed live di risetbemgtd2026.vercel.app dengan performa cepat dan responsif",
      "Antarmuka yang bersih dan mudah dinavigasi oleh masyarakat maupun civitas akademika",
      "Struktur konten terorganisir untuk pelaporan berkala hasil penelitian desa"
    ],
    tech: ["JavaScript", "Web Platform", "Responsive UI", "Vercel"],
    liveUrl: "https://risetbemgtd2026.vercel.app/",
    githubUrl: "https://github.com/Doni354/risetBEMGTD2026"
  },
  piralarm: {
    title: "IoT PIR Motion Alarm — BEM GTD 2026 Perimeter Security",
    category: "IoT & Embedded Systems • Hardware Security",
    image: "assets/piralarm.png",
    description: "Perangkat keras pendeteksi intrusi perimeter berbasis sensor gerak PIR dan mikrokontroler untuk sistem keamanan posko desa BEM Goes to Desa 2026. Dirancang hemat daya dengan pemicu alarm akustik instan saat terdeteksi pergerakan.",
    problemSolution: "Posko pengabdian desa di area pedalaman seringkali minim penerangan dan rawan intrusi malam hari. Dibuat sistem alarm motion detection berbasis PIR dengan konsumsi daya rendah dan aktuator alarm suara yang efektif memberi peringatan perimeter.",
    features: [
      "Sistem deteksi intrusi perimeter berbasis sensor Passive Infrared (PIR)",
      "Firmware mikrokontroler C++ teroptimasi dengan konsumsi daya efisien",
      "Pemicu respon instan dengan aktivasi alarm akustik saat sensor terpicu",
      "Sirkuit mandiri yang tangguh dan portabel untuk dipasang di berbagai titik posko"
    ],
    tech: ["Microcontroller", "C++", "PIR Motion Sensor", "Acoustic Alarm", "Hardware"],
    liveUrl: null,
    githubUrl: "https://github.com/Doni354/risetBEMGTD2026-Hardware"
  }
};

function initProjectModals() {
  const modal = document.getElementById('projectModal');
  const closeBtn = document.getElementById('closeProjectModalBtn');
  const viewBtns = document.querySelectorAll('.view-project-details-btn');

  if (!modal) return;

  viewBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      playClickSound();
      const projectId = btn.getAttribute('data-project');
      const data = projectsData[projectId];
      if (!data) return;

      document.getElementById('modalProjectTitle').textContent = data.title;
      document.getElementById('modalProjectCategory').textContent = data.category;
      document.getElementById('modalProjectImg').src = data.image;
      document.getElementById('modalProjectImg').alt = data.title;
      document.getElementById('modalProjectDesc').textContent = data.description;
      document.getElementById('modalProjectArchitecture').textContent = data.problemSolution;

      // Populate features
      const featuresList = document.getElementById('modalProjectFeatures');
      featuresList.innerHTML = '';
      data.features.forEach(feat => {
        const li = document.createElement('li');
        li.textContent = feat;
        featuresList.appendChild(li);
      });

      // Populate tech
      const techBox = document.getElementById('modalProjectTech');
      techBox.innerHTML = '';
      data.tech.forEach(t => {
        const span = document.createElement('span');
        span.className = 'tech-tag';
        span.textContent = t;
        techBox.appendChild(span);
      });

      // Actions
      const liveBtn = document.getElementById('modalLiveLink');
      const ghBtn = document.getElementById('modalGithubLink');
      const hwBtn = document.getElementById('modalHardwareLink');
      if (hwBtn) hwBtn.remove();

      if (data.liveUrl) {
        liveBtn.href = data.liveUrl;
        liveBtn.style.display = 'inline-flex';
      } else {
        liveBtn.style.display = 'none';
      }

      if (data.githubUrl) {
        ghBtn.href = data.githubUrl;
        ghBtn.style.display = 'inline-flex';
        ghBtn.innerHTML = (projectId === 'piralarm' || projectId === 'rfid')
          ? '<i class="fa-solid fa-microchip"></i> Hardware Repo'
          : '<i class="fa-brands fa-github"></i> Repository';
      } else {
        ghBtn.style.display = 'none';
      }

      modal.showModal();
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      playClickSound();
      modal.close();
    });
  }

  // Backdrop click closes modal
  modal.addEventListener('click', (e) => {
    const dialogDimensions = modal.getBoundingClientRect();
    if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      modal.close();
    }
  });
}

/* ==========================================================================
   6. Copy-to-Clipboard & Toast Alerts
   ========================================================================== */
function initCopyActions() {
  const copyButtons = document.querySelectorAll('.copy-trigger');
  
  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      playClickSound();
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast(`Copied ${textToCopy} to clipboard! ✨`);
        const originalText = btn.innerHTML;
        btn.innerHTML = `<i class="fa-solid fa-check"></i> Copied!`;
        setTimeout(() => {
          btn.innerHTML = originalText;
        }, 2000);
      }).catch(() => {
        showToast(`Failed to copy. Please manually copy: ${textToCopy}`);
      });
    });
  });
}

function showToast(message) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color:#10b981;"></i> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

/* ==========================================================================
   8. Interactive Contact & Message Composer
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('quickMessageForm');
  const sendWaBtn = document.getElementById('sendViaWhatsAppBtn');
  const sendEmailBtn = document.getElementById('sendViaEmailBtn');

  if (!form) return;

  if (sendWaBtn) {
    sendWaBtn.addEventListener('click', () => {
      playClickSound();
      const name = document.getElementById('msgName').value.trim() || 'Visitor';
      const subject = document.getElementById('msgSubject').value.trim() || 'Inquiry / Project';
      const body = document.getElementById('msgBody').value.trim() || 'Halo Doni, saya tertarik untuk berdiskusi.';

      const formattedText = `Halo Doni!\nNama: ${name}\nTopik: ${subject}\nPesan: ${body}`;
      const url = `https://wa.me/6289683322400?text=${encodeURIComponent(formattedText)}`;
      window.open(url, '_blank');
    });
  }

  if (sendEmailBtn) {
    sendEmailBtn.addEventListener('click', () => {
      playClickSound();
      const name = document.getElementById('msgName').value.trim() || 'Visitor';
      const subject = document.getElementById('msgSubject').value.trim() || 'Collaboration Inquiry';
      const body = document.getElementById('msgBody').value.trim() || 'Halo Doni, saya tertarik untuk berdiskusi dengan Anda mengenai web development / Firebase.';

      const mailtoUrl = `mailto:doni.smpn1@gmail.com?subject=${encodeURIComponent(`[Portfolio] ${subject} - from ${name}`)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailtoUrl;
    });
  }
}

/* ==========================================================================
   9. Keyboard Shortcuts (T for theme, Esc for modal)
   ========================================================================== */
function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // If typing in input, ignore
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

    if (e.key === 't' || e.key === 'T') {
      const isDark = document.documentElement.classList.contains('dark');
      setTheme(isDark ? 'light' : 'dark');
      showToast(`Switched to ${isDark ? 'Light' : 'Dark'} Mode (Press 'T' anytime)`);
    }
  });
}

/* ==========================================================================
   10. Subtle Audio Feedback (Web Audio API Synthesizer)
   ========================================================================== */
function playClickSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.015, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch (_) {
    // Audio context not allowed or unsupported; fail silently
  }
}
