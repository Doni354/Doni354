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
    title: "VeLinked — Real-Time IoT Fleet Telemetry (FIKSI 2024 Gold Winner)",
    category: "IoT Platform • FIKSI 2024 National Winner (Gold Medal)",
    image: "assets/VeLinked.png",
    description: "VeLinked is our national gold-medal-winning project at FIKSI 2024 (Festival Inovasi dan Kewirausahaan Siswa Indonesia, Kemendikbud). It connects physical IoT hardware nodes to a real-time web dashboard via Firebase to monitor fleet metrics such as speed, GPS coordinates, battery voltage, and engine diagnostics with instant live updates.",
    problemSolution: "Vehicle fleet management often suffers from disconnected hardware reporting and delayed status logs. VeLinked solves this by creating a reliable telemetry bridge between ESP32 microcontroller nodes and a web dashboard using Firebase Realtime Database, giving operators real-time fleet visibility and instant alerts.",
    features: [
      "National Winner (Gold Medal) in Digital Technology at FIKSI 2024 (Kemendikbud)",
      "Real-time bidirectional device synchronization using Firebase",
      "Live sensor visualization (GPS, speed, battery voltage, diagnostic alerts)",
      "Multi-vehicle monitoring dashboard with online/offline status tracking",
      "Responsive and mobile-friendly interface for field monitoring"
    ],
    tech: ["Firebase Firestore", "Realtime Database", "JavaScript (ES6+)"],
    liveUrl: "https://velinked-web.web.app/",
    githubUrl: null
  },
  kasir: {
    title: "Kasir.IDon — Point of Sale (POS) & Inventory System",
    category: "Full-Stack System • UKK SMK Project",
    image: "assets/KasirIDon.png",
    description: "Kasir.IDon is a web-based Point of Sale and inventory management app built for my UKK competency examination at SMK Negeri 1 Boyolangu. It covers sales transactions, role-based logins, inventory stock alerts, and receipt printing.",
    problemSolution: "Retail shops often struggle with inventory discrepancies and slow checkouts. Kasir.IDon provides a clean transaction interface with automatic stock calculation, membership discount points, and sales summary charts.",
    features: [
      "Role-based access for Admin, Manager, and Cashier",
      "Fast checkout workflow with automatic change calculation",
      "Inventory management with low-stock warning thresholds",
      "Member management and loyalty discount points",
      "Printable transaction receipts and sales summary reports",
      "Visual revenue charts powered by Chart.js"
    ],
    tech: ["Laravel (PHP)", "MySQL", "JavaScript", "Blade Templating", "Chart.js", "Bootstrap", "Receipt Engine"],
    liveUrl: null,
    githubUrl: "https://github.com/Doni354/Kasir.IDon"
  },
  foodies: {
    title: "Foodies — Online Food Ordering Website",
    category: "Food Ordering E-Commerce",
    image: "assets/Foodies.png",
    description: "Foodies was my debut web project, created during my early web development learning phase to fulfill a request. It is an online food ordering platform where customers can browse menus, manage a shopping cart, and submit orders.",
    problemSolution: "Replaces manual food ordering with a simple digital menu, allowing customers to order online and providing admins with a dashboard to update menu items and prices.",
    features: [
      "Dynamic product catalog with categories and pricing",
      "Client-side cart calculation and item quantity management",
      "Customer order checkout flow",
      "Admin dashboard for managing food items (CRUD)",
      "Mobile-responsive ordering layout"
    ],
    tech: ["PHP", "MySQL", "JavaScript", "CSS3", "Responsive UI"],
    liveUrl: "https://foodiesxiakl1.000webhostapp.com/",
    githubUrl: "https://github.com/Doni354/Foodies"
  },
  eppg: {
    title: "E-PPG — Regional Attendance & Learning Portal",
    category: "Attendance & Learning Portal",
    image: "assets/EPPG.png",
    description: "E-PPG is a web portal built to manage student attendance and learning materials across multiple regional branches. It allows branch teachers to log daily attendance and share materials centrally.",
    problemSolution: "Educational organizations with multiple regional branches often have fragmented attendance records. E-PPG centralizes branch student data so regional supervisors can review attendance logs and material access in one place.",
    features: [
      "Multi-user role authentication for branch admins and teachers",
      "Daily student attendance logging with timestamp verification",
      "Course material upload and repository for students",
      "Regional attendance summaries and reporting filters",
      "Responsive interface accessible across devices"
    ],
    tech: ["PHP", "MySQL", "JavaScript", "Role Auth", "Data Tables", "CSS3"],
    liveUrl: null,
    githubUrl: "https://github.com/Doni354/E-PPG"
  },
  smartschool: {
    title: "SmartSchool — Student Permission Slip Platform",
    category: "School Permission Portal",
    image: "assets/smartschool.png",
    description: "SmartSchool is a web application designed to digitize student leave and permission slips. Actively used in school environments, it has processed over 1,000+ student permission requests with digital approval logs.",
    problemSolution: "Paper permission slips get lost easily and lack quick verification. SmartSchool automates the permission workflow, allowing students or guardians to submit requests and staff to approve them in real time via Firebase Firestore.",
    features: [
      "Digital student permission slip submissions (1,000+ processed)",
      "Fast administrative search and approval dashboard",
      "Cloud Firestore integration for real-time status updates",
      "Mobile-optimized design for teachers and students"
    ],
    tech: ["Firebase", "JavaScript", "Cloud Firestore", "Responsive UI"],
    liveUrl: "https://smartschool-34158.web.app/",
    githubUrl: null
  },
  infria: {
    title: "INFRIA — Universal Conversational AI Infrastructure",
    category: "AI Infrastructure • Ongoing Competition Project",
    image: "assets/infria.png",
    description: "INFRIA (AI Infrastructure for Applications) is an ongoing innovation project currently being prepared for upcoming student competitions. It serves as an AI backend and API gateway layer to help developers integrate conversational AI, knowledge retrieval (RAG), and dynamic action triggers into their apps without building complex AI pipelines from scratch.",
    problemSolution: "Adding custom AI workflows into existing applications often requires months of boilerplate API development and middleware setup. INFRIA provides a streamlined API gateway and client SDKs that handle LLM requests, webhook automations, and knowledge retrieval seamlessly.",
    features: [
      "Ongoing research & development project for upcoming competitions",
      "Centralized AI API gateway for web and mobile client applications",
      "Dynamic function calling support allowing AI to execute app actions",
      "Context-aware knowledge retrieval (RAG) pipelines",
      "Workflow automation integration using n8n and Node.js microservices",
      "Client SDK integration for Next.js web portals and Flutter mobile apps"
    ],
    tech: ["Next.js", "Node.js", "Express", "Firebase Functions", "Firestore", "n8n", "Flutter SDK", "LLM"],
    liveUrl: null,
    githubUrl: null
  },
  vorce: {
    title: "Vorce — Business Collaboration & Task API",
    category: "Task & Collaboration Platform",
    image: "assets/vorce.png",
    description: "Vorce is a team operations and task management platform. As backend developer, I built the RESTful task endpoints, company tenant data structures, and Firestore security rules that power the mobile application on Google Play.",
    problemSolution: "Teams need a reliable way to assign tasks, submit completion proof, and track progress across departments. Built structured backend models in Firestore (/companies/{idCompany}/tasks/{taskId}) with verified status transitions and role permissions.",
    features: [
      "RESTful API for task lifecycles (Pending, In Progress, Completed)",
      "Multi-company data isolation and role permissions in Firestore",
      "Task completion evidence submission and point reward tracking",
      "Real-time state synchronization across web and mobile clients",
      "Backend support for the official Vorce Android app on Google Play"
    ],
    tech: ["Node.js", "Firebase Firestore", "RESTful API", "Cloud Functions", "GCP"],
    liveUrl: "https://vorce.id/",
    githubUrl: null
  },
  spmb: {
    title: "SPMB / PPDB — Student Admissions & k6 Testing",
    category: "Admissions Dashboard & Testing",
    image: "assets/spmb.png",
    description: "Redesigned the administrative admissions dashboard for Junior High School (SMP) student registration in Tulungagung Regency. Also performed load and stress testing using k6 to evaluate system performance during peak application periods.",
    problemSolution: "Student admissions create massive traffic spikes that can slow down or crash servers. Conducted simulated stress tests with k6 to identify throughput bottlenecks and optimized the admin dashboard for school operators.",
    features: [
      "Clean administrative dashboard for reviewing student admissions",
      "Simulated concurrent traffic and bottleneck testing with k6",
      "Real-time statistics on applicant quotas and school selections",
      "Optimized frontend assets for fast loading during peak hours"
    ],
    tech: ["Web Development", "k6 (Load Testing)", "JavaScript", "Bootstrap", "REST API"],
    liveUrl: null,
    githubUrl: null
  },
  elecomp: {
    title: "PT Elecomp — 25+ Client Websites & SEO",
    category: "6-Month Internship • Software House",
    image: "assets/elecomp.png",
    description: "During a 6-month internship at PT Elecomp Software House (July – December 2024), I built approximately 25 company profile websites for business clients, configured on-page technical SEO, and optimized mobile Google PageSpeed scores.",
    problemSolution: "Many client websites were slow and not ranking on search engines. Audited page structures, reduced render-blocking assets, optimized images, and delivered responsive, fast-loading business websites.",
    features: [
      "Developed ~25 responsive business company profile websites",
      "On-page SEO setup (meta tags, sitemaps, semantic hierarchy)",
      "PageSpeed optimization for fast mobile loading scores",
      "Cross-browser and multi-device compatibility testing"
    ],
    tech: ["HTML5", "CSS3", "JavaScript", "PHP", "SEO Tuning", "PageSpeed Insights"],
    liveUrl: null,
    githubUrl: null
  },
  wisnufarma: {
    title: "WisnuFarma & CMS — Pharmacy Web Application",
    category: "Pharmacy CMS & Web Portal",
    image: "assets/wisnufarma.png",
    description: "Developed CMS modules and pharmacy management features for WisnuFarma in collaboration with Haltec software house, giving pharmacy operators an administrative portal to manage catalog items and updates.",
    problemSolution: "Pharmacies need a reliable way to update medicine information, categories, and announcements without touching code. Built a clean CMS module integrated directly into their production web system.",
    features: [
      "Custom CMS admin panel for medicine catalog and content updates",
      "Session authentication and role authorization",
      "Clean modular code integrated into the production codebase",
      "Responsive layout for desktop and mobile pharmacist use"
    ],
    tech: ["PHP", "JavaScript", "MySQL", "CMS Architecture", "Responsive CSS"],
    liveUrl: "https://wisnu-farma.com/login",
    githubUrl: null
  },
  noury: {
    title: "Noury — POS & Pre-Order Platform",
    category: "Merchandise & POS Platform",
    image: "assets/noury.png",
    description: "A web application built with Next.js and Firebase to handle campus merchandise pre-orders and on-site sales transactions, backed by Cloudinary image storage for product showcases.",
    problemSolution: "Merchandise sales on campus often rely on manual chat orders and messy spreadsheets. Noury simplifies order entry, payment verification, and stock tracking in one place.",
    features: [
      "POS checkout interface for quick in-person sales",
      "Pre-order tracking from customer order to fulfillment",
      "Real-time stock limit and inventory tracking",
      "Cloudinary image integration for product catalogs and banners"
    ],
    tech: ["Next.js", "Firebase", "Cloudinary", "Vercel", "TailwindCSS"],
    liveUrl: "https://noury-se.vercel.app/",
    githubUrl: "https://github.com/Doni354/black-market"
  },
  simplempg: {
    title: "Simple MPG — Browser Mini-Games Hub",
    category: "Browser Mini-Games",
    image: "assets/simplempg.png",
    description: "Simple MPG is a lightweight browser gaming site built with vanilla JavaScript and Firebase. Features Tic Tac Toe with an AI opponent powered by the Minimax algorithm and online multiplayer mode.",
    problemSolution: "Casual web games are often cluttered with heavy downloads and ads. Simple MPG runs instantly in any browser with zero installation, letting players play solo against AI or invite a friend via link.",
    features: [
      "Zero-install browser gameplay with HTML5 canvas and clean DOM",
      "Tic Tac Toe AI opponent powered by Minimax decision logic",
      "Real-time 2-player multiplayer synchronized via Firebase",
      "Clean, responsive controls for touchscreens and desktop"
    ],
    tech: ["JavaScript (ES6+)", "Firebase Realtime DB", "HTML5 Canvas", "CSS3 Animations"],
    liveUrl: "https://simplempg-6c08f.web.app/",
    githubUrl: null
  },
  classlyai: {
    title: "Classly AI — Learning Management with AI Tutor",
    category: "ZTE Competition • AI LMS Concept",
    image: "assets/classlyai.png",
    description: "Backend development and conversational AI integration for an intelligent LMS concept submitted to the national ZTE innovation competition. This concept was the early precursor to the INFRIA platform.",
    problemSolution: "Traditional online classrooms lack instant interactive help when students are stuck on homework. We integrated an AI tutor into the LMS to answer questions and give hints on course materials.",
    features: [
      "Conversational AI tutor to assist students with coursework questions",
      "RESTful backend API for courses, materials, and submissions",
      "Multi-role logins separating students and instructors",
      "Provided the architectural foundation that inspired INFRIA"
    ],
    tech: ["Node.js", "Express", "AI Integration", "RESTful API", "Cloud Storage"],
    liveUrl: null,
    githubUrl: null
  },
  cetakkartu: {
    title: "Web Cetak Kartu Pelajar — ID Card Generator",
    category: "Student ID Card Generator",
    image: "assets/cetakkartu.png",
    description: "An automated web tool designed to generate student ID cards in bulk. Reads roster information from Google Sheets API, pairs student portraits via Cloudinary, and formats print-ready A4 templates.",
    problemSolution: "Creating hundreds of student cards manually in graphic software takes hours of repetitive work. This tool automates data fetching, photo alignment, and A4 printing grids in just a few clicks.",
    features: [
      "Direct roster import from Google Sheets API",
      "Cloudinary photo processing and automatic aspect ratio scaling",
      "Print-ready A4 grid layout aligned for standard laminators",
      "Automatic student barcode and QR code generation"
    ],
    tech: ["JavaScript", "Google Sheets API", "Cloudinary", "CSS Print Media", "Vercel"],
    liveUrl: "https://cetak-kartu-pelajar.vercel.app/",
    githubUrl: "https://github.com/Doni354/cetak-kartu-pelajar"
  },
  rfid: {
    title: "IoT RFID Attendance — Microcontroller to Cloud",
    category: "IoT Hardware & Telemetry",
    image: "assets/rfid.png",
    description: "A hardware attendance device combining an ESP32 microcontroller, RC522 RFID card reader, and Google Sheets cloud logging over WiFi.",
    problemSolution: "Manual attendance rosters cause queues and recording errors. Built a standalone IoT scanner that reads RFID smartcards and automatically pushes verified timestamps to Google Sheets in real time.",
    features: [
      "Fast contactless smartcard scanning with RC522 module",
      "WiFi telemetry logging timestamps straight to Google Sheets",
      "Audio-visual feedback with LED indicator and buzzer",
      "Portable hardware setup suitable for classrooms and labs"
    ],
    tech: ["ESP32 / ESP8266", "C++", "RFID RC522", "Google Sheets API", "IoT Telemetry"],
    liveUrl: null,
    githubUrl: "https://github.com/Doni354/Absensi-RFID"
  },
  bemweb: {
    title: "Riset BEM Goes to Desa 2026 — Web Platform",
    category: "BEM Goes to Desa 2026 • Web Platform",
    image: "assets/BEM.png",
    description: "The official web publication portal for the BEM Goes to Desa 2026 program. Documents student rural research, community service initiatives, and project updates.",
    problemSolution: "Community service programs often lack centralized public documentation. Built a fast, responsive website on Vercel so research outputs and student village activities are publicly accessible.",
    features: [
      "Official documentation portal for BEM Goes to Desa 2026",
      "Deployed live on Vercel with fast load times and clean navigation",
      "Responsive layout accessible for community members and university students",
      "Organized content structure for ongoing village research updates"
    ],
    tech: ["JavaScript", "Web Platform", "Responsive UI", "Vercel"],
    liveUrl: "https://risetbemgtd2026.vercel.app/",
    githubUrl: "https://github.com/Doni354/risetBEMGTD2026"
  },
  piralarm: {
    title: "IoT PIR Motion Alarm — Perimeter Security",
    category: "BEM GTD 2026 • Hardware Security",
    image: "assets/piralarm.png",
    description: "A perimeter intrusion alarm built with a PIR motion sensor, microcontroller, and buzzer for the student community post during BEM Goes to Desa 2026. Designed for low power consumption with instant acoustic alarm triggers.",
    problemSolution: "Community posts in rural areas often have limited lighting and need perimeter monitoring at night. Built a low-power motion detection alarm that sounds immediately when motion is detected.",
    features: [
      "Perimeter motion detection using a Passive Infrared (PIR) sensor",
      "Optimized C++ firmware for efficient battery consumption",
      "Instant acoustic buzzer alarm trigger upon movement detection",
      "Compact, standalone hardware setup easy to place around the post"
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
