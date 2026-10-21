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
  initCVModal();
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

      if (data.liveUrl) {
        liveBtn.href = data.liveUrl;
        liveBtn.style.display = 'inline-flex';
      } else {
        liveBtn.style.display = 'none';
      }

      if (data.githubUrl) {
        ghBtn.href = data.githubUrl;
        ghBtn.style.display = 'inline-flex';
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
   6. CV / Resume Modal
   ========================================================================== */
function initCVModal() {
  const cvModal = document.getElementById('cvModal');
  const openCVBtns = document.querySelectorAll('.open-cv-modal-btn');
  const closeCVBtn = document.getElementById('closeCVModalBtn');

  if (!cvModal) return;

  openCVBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      playClickSound();
      cvModal.showModal();
    });
  });

  if (closeCVBtn) {
    closeCVBtn.addEventListener('click', () => {
      playClickSound();
      cvModal.close();
    });
  }

  cvModal.addEventListener('click', (e) => {
    const dialogDimensions = cvModal.getBoundingClientRect();
    if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      cvModal.close();
    }
  });
}

/* ==========================================================================
   7. Copy-to-Clipboard & Toast Alerts
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
