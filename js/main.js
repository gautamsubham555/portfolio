/**
 * SUBHAM.DEV - MAIN JAVASCRIPT CONTROLLER
 * Handles interactive navigation, typewriter, project filtering,
 * live Machine Learning simulator, modal controllers, and contact actions.
 */

document.addEventListener('DOMContentLoaded', () => {
  initTypewriter();
  initNavigation();
  initFilterTabs();
  initMLPredictor();
  initInteractiveTerminal();
  initContactForm();
  initModals();
  initCopyActions();
  initPaletteSwitcher();
});

/* ==========================================================================
   1. TYPEWRITER EFFECT
   ========================================================================== */
function initTypewriter() {
  const element = document.getElementById('typewriter-text');
  if (!element) return;

  const roles = [
    'Software Development Engineer (SDE)',
    'Full-Stack & Systems Developer',
    'AI / Machine Learning Engineer',
    'Data Scientist & Pipeline Architect',
    'Competitive Programmer (Pupil 1242)'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let delay = 100;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      element.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      delay = 45;
    } else {
      element.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      delay = 90;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      delay = 2000; // Pause at full word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 400; // Pause before typing next
    }

    setTimeout(type, delay);
  }

  type();
}

/* ==========================================================================
   2. NAVIGATION & ACTIVE SPY SCROLL
   ========================================================================== */
function initNavigation() {
  const header = document.getElementById('main-nav');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Scroll effect on header
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('bg-slate-950/85', 'backdrop-blur-md', 'border-b', 'border-slate-800/80', 'shadow-lg');
      header.classList.remove('bg-transparent');
    } else {
      header.classList.remove('bg-slate-950/85', 'backdrop-blur-md', 'border-b', 'border-slate-800/80', 'shadow-lg');
      header.classList.add('bg-transparent');
    }

    // Scroll spy
    let currentSection = '';
    const scrollPos = window.scrollY + 140;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('text-cyan-400', 'font-semibold');
      link.classList.add('text-slate-300');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('text-cyan-400', 'font-semibold');
        link.classList.remove('text-slate-300');
      }
    });
  });

  // Mobile menu toggle
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
      mobileMenu.classList.toggle('hidden');
    });

    // Close mobile menu on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

/* ==========================================================================
   3. SKILLS & PROJECTS FILTERING
   ========================================================================== */
function initFilterTabs() {
  // Project Filter
  const projectFilterBtns = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  projectFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Set active button
      projectFilterBtns.forEach(b => {
        b.classList.remove('bg-cyan-500', 'text-slate-950', 'border-cyan-400');
        b.classList.add('bg-slate-900/80', 'text-slate-300', 'border-slate-800');
      });
      btn.classList.add('bg-cyan-500', 'text-slate-950', 'border-cyan-400');
      btn.classList.remove('bg-slate-900/80', 'text-slate-300', 'border-slate-800');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category.includes(filter)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 30);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px) scale(0.96)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // Skill category filter
  const skillFilterBtns = document.querySelectorAll('.skill-filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  skillFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      skillFilterBtns.forEach(b => {
        b.classList.remove('bg-emerald-500', 'text-slate-950', 'border-emerald-400');
        b.classList.add('bg-slate-900/80', 'text-slate-300', 'border-slate-800');
      });
      btn.classList.add('bg-emerald-500', 'text-slate-950', 'border-emerald-400');
      btn.classList.remove('bg-slate-900/80', 'text-slate-300', 'border-slate-800');

      const filter = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const cat = card.getAttribute('data-skill-cat');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'block';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
    });
  });
}

/* ==========================================================================
   4. INTERACTIVE LIVE MACHINE LEARNING PREDICTOR
   Simulates Subham's Diabetes Prediction Pipeline with real weights & normalization
   ========================================================================== */
function initMLPredictor() {
  const glucoseInput = document.getElementById('ml-glucose');
  const bpInput = document.getElementById('ml-bp');
  const insulinInput = document.getElementById('ml-insulin');
  const bmiInput = document.getElementById('ml-bmi');
  const ageInput = document.getElementById('ml-age');

  if (!glucoseInput) return;

  const glucoseVal = document.getElementById('val-glucose');
  const bpVal = document.getElementById('val-bp');
  const insulinVal = document.getElementById('val-insulin');
  const bmiVal = document.getElementById('val-bmi');
  const ageVal = document.getElementById('val-age');

  const predictBtn = document.getElementById('btn-run-prediction');
  const presetLowBtn = document.getElementById('preset-low');
  const presetHighBtn = document.getElementById('preset-high');
  const presetBorderlineBtn = document.getElementById('preset-borderline');

  const resultContainer = document.getElementById('ml-result-display');
  const scoreBar = document.getElementById('ml-probability-bar');
  const scorePercent = document.getElementById('ml-probability-percent');
  const diagnosticBadge = document.getElementById('ml-diagnostic-badge');
  const diagnosticSummary = document.getElementById('ml-diagnostic-summary');
  const pipelineTrace = document.getElementById('ml-pipeline-trace');

  // Input sync
  function updateDisplays() {
    glucoseVal.textContent = glucoseInput.value + ' mg/dL';
    bpVal.textContent = bpInput.value + ' mmHg';
    insulinVal.textContent = insulinInput.value + ' µU/mL';
    bmiVal.textContent = bmiInput.value + ' kg/m²';
    ageVal.textContent = ageInput.value + ' yrs';
  }

  [glucoseInput, bpInput, insulinInput, bmiInput, ageInput].forEach(slider => {
    slider.addEventListener('input', updateDisplays);
  });
  updateDisplays();

  // Presets
  if (presetLowBtn) {
    presetLowBtn.addEventListener('click', () => {
      glucoseInput.value = 92;
      bpInput.value = 68;
      insulinInput.value = 65;
      bmiInput.value = 22.4;
      ageInput.value = 24;
      updateDisplays();
      runInference();
      showToast('Loaded Healthy Benchmark Preset', 'success');
    });
  }

  if (presetBorderlineBtn) {
    presetBorderlineBtn.addEventListener('click', () => {
      glucoseInput.value = 138;
      bpInput.value = 82;
      insulinInput.value = 145;
      bmiInput.value = 28.5;
      ageInput.value = 42;
      updateDisplays();
      runInference();
      showToast('Loaded Borderline Diagnostic Preset', 'info');
    });
  }

  if (presetHighBtn) {
    presetHighBtn.addEventListener('click', () => {
      glucoseInput.value = 185;
      bpInput.value = 94;
      insulinInput.value = 280;
      bmiInput.value = 36.8;
      ageInput.value = 54;
      updateDisplays();
      runInference();
      showToast('Loaded Elevated Risk Preset', 'warning');
    });
  }

  function runInference() {
    const rawGlucose = parseFloat(glucoseInput.value);
    const rawBP = parseFloat(bpInput.value);
    const rawInsulin = parseFloat(insulinInput.value);
    const rawBMI = parseFloat(bmiInput.value);
    const rawAge = parseFloat(ageInput.value);

    // 1. Statistical Imputation simulation (Handle zeros/anomalies)
    const imputedGlucose = rawGlucose === 0 ? 120.9 : rawGlucose;
    const imputedBP = rawBP === 0 ? 69.1 : rawBP;
    const imputedInsulin = rawInsulin === 0 ? 79.8 : rawInsulin;
    const imputedBMI = rawBMI === 0 ? 31.99 : rawBMI;

    // 2. Feature Standardization: z = (x - mean) / std (Pima Dataset Parameters)
    const zGlucose = (imputedGlucose - 120.89) / 31.97;
    const zBP = (imputedBP - 69.1) / 19.35;
    const zInsulin = (imputedInsulin - 79.8) / 115.24;
    const zBMI = (imputedBMI - 31.99) / 7.88;
    const zAge = (rawAge - 33.24) / 11.76;

    // 3. Logistic Regression Coefficients
    // Intercept: -0.85
    // Weights: Glucose: 1.15, BMI: 0.72, Age: 0.38, Insulin: 0.12, BP: -0.05
    const logit = -0.85 + (1.15 * zGlucose) + (0.72 * zBMI) + (0.38 * zAge) + (0.12 * zInsulin) + (-0.05 * zBP);

    // 4. Sigmoid activation: 1 / (1 + e^-logit)
    const probability = 1 / (1 + Math.exp(-logit));
    const percent = Math.round(probability * 100);

    // Visual feedback
    if (pipelineTrace) {
      pipelineTrace.innerHTML = `
        <div class="p-3 bg-slate-900/90 rounded-lg border border-emerald-500/20 text-xs font-mono space-y-1">
          <div class="text-emerald-400 font-semibold flex items-center gap-1.5">
            <span class="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            Pipeline Execution Log:
          </div>
          <div class="text-slate-400">1. Raw Vector: [Glu: ${rawGlucose}, BP: ${rawBP}, Ins: ${rawInsulin}, BMI: ${rawBMI}, Age: ${rawAge}]</div>
          <div class="text-slate-400">2. Imputation & Scaling: z_glu=${zGlucose.toFixed(2)}, z_bmi=${zBMI.toFixed(2)}, z_age=${zAge.toFixed(2)}</div>
          <div class="text-slate-400">3. Logit z: ${logit.toFixed(3)} | Sigmoid σ(z): <span class="text-cyan-300">${probability.toFixed(4)}</span></div>
          <div class="text-emerald-300 font-medium">4. Output Classification: ${percent >= 50 ? 'Class 1 (Diabetic Risk Detected)' : 'Class 0 (Negative / Non-Diabetic)'}</div>
        </div>
      `;
    }

    if (scoreBar && scorePercent && diagnosticBadge && diagnosticSummary) {
      scoreBar.style.width = `${percent}%`;
      scorePercent.textContent = `${percent}%`;

      if (percent < 38) {
        scoreBar.className = 'h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700 ease-out';
        diagnosticBadge.className = 'px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 inline-flex items-center gap-1.5';
        diagnosticBadge.innerHTML = '<span>🟢 Low Risk Indicator</span>';
        diagnosticSummary.textContent = 'Glycemic indices and physiological markers indicate normal diagnostic stability. Standard maintenance profile recommended.';
      } else if (percent < 62) {
        scoreBar.className = 'h-full bg-gradient-to-r from-amber-500 to-orange-400 transition-all duration-700 ease-out';
        diagnosticBadge.className = 'px-3 py-1 rounded-full text-xs font-semibold bg-amber-950/80 text-amber-300 border border-amber-500/40 inline-flex items-center gap-1.5';
        diagnosticBadge.innerHTML = '<span>🟡 Borderline / Pre-Diabetic</span>';
        diagnosticSummary.textContent = 'Elevated markers detected in BMI or fasting glucose. Recommend routine fasting plasma glucose check and lifestyle review.';
      } else {
        scoreBar.className = 'h-full bg-gradient-to-r from-rose-500 to-red-500 transition-all duration-700 ease-out';
        diagnosticBadge.className = 'px-3 py-1 rounded-full text-xs font-semibold bg-rose-950/80 text-rose-300 border border-rose-500/40 inline-flex items-center gap-1.5';
        diagnosticBadge.innerHTML = '<span>🔴 High Risk Classification</span>';
        diagnosticSummary.textContent = 'Statistical markers indicate high correlation with diabetic status. Supervised clinical evaluation and glucose tolerance test advised.';
      }
    }
  }

  if (predictBtn) {
    predictBtn.addEventListener('click', () => {
      predictBtn.disabled = true;
      predictBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg> Executing Pipeline...
      `;
      setTimeout(() => {
        runInference();
        predictBtn.disabled = false;
        predictBtn.innerHTML = `
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg> Run ML Inference Pipeline
        `;
        showToast('ML inference calculated successfully!', 'success');
      }, 350);
    });
  }

  // Run initial calculation
  runInference();
}

/* ==========================================================================
   5. INTERACTIVE TERMINAL / CODE WORKBENCH
   ========================================================================== */
function initInteractiveTerminal() {
  const tabs = document.querySelectorAll('.terminal-tab');
  const codeScreens = document.querySelectorAll('.terminal-code');
  const terminalInput = document.getElementById('terminal-cli-input');
  const terminalOutput = document.getElementById('terminal-cli-output');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('bg-slate-800', 'text-cyan-400', 'border-b-2', 'border-cyan-400');
        t.classList.add('text-slate-400', 'hover:text-slate-200');
      });
      tab.classList.add('bg-slate-800', 'text-cyan-400', 'border-b-2', 'border-cyan-400');
      tab.classList.remove('text-slate-400');

      const targetId = tab.getAttribute('data-target');
      codeScreens.forEach(screen => {
        if (screen.id === targetId) {
          screen.classList.remove('hidden');
        } else {
          screen.classList.add('hidden');
        }
      });
    });
  });

  // Mini CLI input support
  if (terminalInput && terminalOutput) {
    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const cmd = terminalInput.value.trim().toLowerCase();
        terminalInput.value = '';

        let response = '';
        if (cmd === 'help') {
          response = 'Available commands: about, skills, codeforces, leetcode, codechef, github, linkedin, theme, projects, contact, clear';
        } else if (cmd === 'about') {
          response = 'Subham - B.Tech CSE (2023-2027) | Delhi Skill and Entrepreneurship University | CGPA 7.1/10';
        } else if (cmd === 'skills') {
          response = 'Languages: C++, Java, Python | ML: Scikit-learn, Pandas, NumPy | Web: HTML5, CSS3, JS, REST APIs';
        } else if (cmd === 'codeforces') {
          response = 'Codeforces Rank: Pupil (Max Rating: 1242) &bull; <a href="https://codeforces.com/profile/gautamsubham555" target="_blank" rel="noopener noreferrer" class="text-cyan-400 underline">https://codeforces.com/profile/gautamsubham555</a>';
        } else if (cmd === 'leetcode') {
          response = 'LeetCode Profile: <a href="https://leetcode.com/u/Subhamthegreat007/" target="_blank" rel="noopener noreferrer" class="text-amber-400 underline">https://leetcode.com/u/Subhamthegreat007/</a>';
        } else if (cmd === 'codechef') {
          response = 'CodeChef Profile: <a href="https://www.codechef.com/users/canny_team_49" target="_blank" rel="noopener noreferrer" class="text-amber-400 underline">https://www.codechef.com/users/canny_team_49</a>';
        } else if (cmd === 'github') {
          response = 'GitHub Profile: <a href="https://github.com/gautamsubham555" target="_blank" rel="noopener noreferrer" class="text-cyan-400 underline">https://github.com/gautamsubham555</a>';
        } else if (cmd === 'linkedin') {
          response = 'LinkedIn: <a href="https://www.linkedin.com/in/subham130304/" target="_blank" rel="noopener noreferrer" class="text-blue-400 underline">https://www.linkedin.com/in/subham130304/</a>';
        } else if (cmd === 'theme' || cmd === 'palette') {
          const btn = document.getElementById('theme-palette-btn');
          if (btn) btn.click();
          response = 'Cycling background palette! Options: Aurora, Oceanic, Sunset.';
        } else if (cmd === 'projects') {
          response = '1. Diabetes Prediction Pipeline (ML)  2. Scalable REST API  3. DSA Workbench  4. Java Systems Suite';
        } else if (cmd === 'contact') {
          response = 'Email: gautamsubham777@gmail.com | Phone: +91 9555648657';
        } else if (cmd === 'clear') {
          terminalOutput.innerHTML = '';
          return;
        } else {
          response = `Command not recognized: "${cmd}". Type "help" for a list of commands.`;
        }

        const cmdLine = document.createElement('div');
        cmdLine.className = 'text-xs font-mono text-slate-300 mt-1';
        cmdLine.innerHTML = `<span class="text-cyan-400">subham@dev:~$</span> ${cmd}<br><span class="text-emerald-400">${response}</span>`;
        terminalOutput.appendChild(cmdLine);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
      }
    });
  }
}

/* ==========================================================================
   6. CONTACT FORM & LIVE VALIDATION
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const messageInput = document.getElementById('contact-message');
  const charCounter = document.getElementById('char-count');

  if (messageInput && charCounter) {
    messageInput.addEventListener('input', () => {
      charCounter.textContent = `${messageInput.value.length} / 500`;
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const subject = document.getElementById('contact-subject').value.trim();
      const message = document.getElementById('contact-message').value.trim();
      const submitBtn = document.getElementById('contact-submit-btn');

      // Basic validation
      if (!name || !email || !subject || !message) {
        showToast('Please fill out all required fields.', 'error');
        return;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        showToast('Please enter a valid email address.', 'error');
        return;
      }

      // Simulate sending
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-slate-950 inline" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg> Dispatching Message...
        `;
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg> Send Message
          `;
        }

        form.reset();
        if (charCounter) charCounter.textContent = '0 / 500';

        // Show success modal
        const modal = document.getElementById('contact-success-modal');
        if (modal) modal.showModal();
        showToast('Message sent! Subham will get back to you shortly.', 'success');
      }, 700);
    });
  }
}

/* ==========================================================================
   7. MODAL CONTROLLERS
   ========================================================================== */
function initModals() {
  // Generic modal openers
  document.querySelectorAll('[data-open-modal]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetModalId = btn.getAttribute('data-open-modal');
      const modal = document.getElementById(targetModalId);
      if (modal) modal.showModal();
    });
  });

  // Generic modal closers
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('dialog');
      if (modal) modal.close();
    });
  });

  // Light dismiss on backdrop click
  document.querySelectorAll('dialog').forEach(modal => {
    modal.addEventListener('click', (e) => {
      const rect = modal.getBoundingClientRect();
      const isInDialog = (
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width
      );
      if (!isInDialog) {
        modal.close();
      }
    });
  });

  // Print resume button
  const printResumeBtn = document.getElementById('btn-print-resume');
  if (printResumeBtn) {
    printResumeBtn.addEventListener('click', () => {
      window.print();
    });
  }
}

/* ==========================================================================
   8. ONE-CLICK COPY & TOAST NOTIFICATIONS
   ========================================================================== */
function initCopyActions() {
  document.querySelectorAll('[data-copy-text]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const text = btn.getAttribute('data-copy-text');
      const label = btn.getAttribute('data-copy-label') || 'Text';

      navigator.clipboard.writeText(text).then(() => {
        showToast(`Copied ${label} to clipboard!`, 'success');
      }).catch(() => {
        // Fallback
        const temp = document.createElement('textarea');
        temp.value = text;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
        showToast(`Copied ${label} to clipboard!`, 'success');
      });
    });
  });
}

function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border text-sm max-w-sm';

  let icon = '';
  if (type === 'success') {
    toast.classList.add('bg-slate-900/95', 'text-emerald-300', 'border-emerald-500/40', 'backdrop-blur-md');
    icon = `<svg class="w-5 h-5 text-emerald-400 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>`;
  } else if (type === 'warning') {
    toast.classList.add('bg-slate-900/95', 'text-amber-300', 'border-amber-500/40', 'backdrop-blur-md');
    icon = `<svg class="w-5 h-5 text-amber-400 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>`;
  } else if (type === 'error') {
    toast.classList.add('bg-slate-900/95', 'text-rose-300', 'border-rose-500/40', 'backdrop-blur-md');
    icon = `<svg class="w-5 h-5 text-rose-400 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/></svg>`;
  } else {
    toast.classList.add('bg-slate-900/95', 'text-cyan-300', 'border-cyan-500/40', 'backdrop-blur-md');
    icon = `<svg class="w-5 h-5 text-cyan-400 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>`;
  }

  toast.innerHTML = `
    ${icon}
    <div class="flex-1 font-medium">${message}</div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, 3200);
}

/* ==========================================================================
   9. PALETTE MOOD SWITCHER (Multi-Color Gradient Mesh)
   ========================================================================== */
function initPaletteSwitcher() {
  const btn = document.getElementById('theme-palette-btn');
  const label = document.getElementById('current-palette-label');
  if (!btn) return;

  const palettes = [
    { id: 'aurora', name: 'Aurora', class: '' },
    { id: 'oceanic', name: 'Oceanic', class: 'theme-oceanic' },
    { id: 'sunset', name: 'Sunset', class: 'theme-sunset' }
  ];

  let currentIndex = 0;

  btn.addEventListener('click', () => {
    palettes.forEach(p => {
      if (p.class) document.body.classList.remove(p.class);
    });

    currentIndex = (currentIndex + 1) % palettes.length;
    const current = palettes[currentIndex];

    if (current.class) {
      document.body.classList.add(current.class);
    }

    if (label) {
      label.textContent = current.name;
    }

    showToast(`Switched background to ${current.name} Palette ✨`, 'info');
  });
}
