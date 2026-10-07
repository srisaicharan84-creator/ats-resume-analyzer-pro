const form = document.getElementById('resume-form');
const generateBtn = document.getElementById('generate-btn');
const targetRoleInput = document.getElementById('target-role');
const backgroundInput = document.getElementById('background-text');
const presetSelect = document.getElementById('preset-select');
const formError = document.getElementById('form-error');
const dashboard = document.getElementById('dashboard');
const resumePreview = document.getElementById('resume-preview');
const matchProbabilityEl = document.getElementById('match-probability');
const scoreRing = document.getElementById('score-ring');
const matchCaption = document.getElementById('match-caption');
const presentSkillsEl = document.getElementById('present-skills');
const missingSkillsEl = document.getElementById('missing-skills');
const downloadPdfBtn = document.getElementById('download-pdf');

const SKILL_CATALOGS = {
  frontend: [
    { name: 'HTML5', aliases: ['html5', 'html'] },
    { name: 'CSS3', aliases: ['css3', 'css'] },
    { name: 'JavaScript', aliases: ['javascript', 'js', 'es6'] },
    { name: 'TypeScript', aliases: ['typescript', 'ts'] },
    { name: 'React', aliases: ['react', 'react.js', 'reactjs'] },
    { name: 'Responsive Design', aliases: ['responsive', 'mobile-first', 'media queries'] },
    { name: 'Git', aliases: ['git', 'github'] },
    { name: 'REST APIs', aliases: ['rest', 'api', 'apis'] },
    { name: 'Testing', aliases: ['jest', 'testing library', 'cypress', 'unit test'] },
    { name: 'Accessibility', aliases: ['a11y', 'accessibility', 'wcag', 'aria'] },
  ],
  fullstack: [
    { name: 'JavaScript', aliases: ['javascript', 'js'] },
    { name: 'TypeScript', aliases: ['typescript'] },
    { name: 'React', aliases: ['react'] },
    { name: 'Node.js', aliases: ['node', 'node.js', 'nodejs'] },
    { name: 'SQL', aliases: ['sql', 'postgres', 'postgresql', 'mysql'] },
    { name: 'REST APIs', aliases: ['rest', 'api'] },
    { name: 'Git', aliases: ['git', 'github'] },
    { name: 'Docker', aliases: ['docker'] },
    { name: 'Cloud', aliases: ['aws', 'gcp', 'azure', 'cloud'] },
    { name: 'CI/CD', aliases: ['ci/cd', 'github actions', 'pipeline'] },
  ],
  python: [
    { name: 'Python', aliases: ['python'] },
    { name: 'Django / FastAPI', aliases: ['django', 'fastapi', 'flask'] },
    { name: 'SQL', aliases: ['sql', 'postgres', 'postgresql'] },
    { name: 'REST APIs', aliases: ['rest', 'api'] },
    { name: 'Git', aliases: ['git', 'github'] },
    { name: 'Testing', aliases: ['pytest', 'unittest', 'testing'] },
    { name: 'Docker', aliases: ['docker'] },
    { name: 'Linux', aliases: ['linux', 'unix'] },
    { name: 'Data structures', aliases: ['algorithms', 'data structures'] },
    { name: 'Cloud', aliases: ['aws', 'gcp', 'azure'] },
  ],
  general: [
    { name: 'Communication', aliases: ['communication', 'stakeholder', 'presentation'] },
    { name: 'Problem solving', aliases: ['problem solving', 'debugging', 'troubleshoot'] },
    { name: 'Collaboration', aliases: ['collaborat', 'cross-functional', 'team'] },
    { name: 'Git', aliases: ['git', 'github'] },
    { name: 'Documentation', aliases: ['documentation', 'technical writing'] },
    { name: 'Agile', aliases: ['agile', 'scrum', 'kanban'] },
  ],
};

const PRESETS = {
  frontend: {
    role: 'Frontend Developer at Northstar Labs',
    background: [
      'Jordan Hale',
      'Frontend-leaning software engineer with 4 years building responsive product UIs.',
      '',
      'Experience',
      '- Built React dashboards with HTML5, CSS3, and JavaScript for a B2B analytics product.',
      '- Partnered with design on accessibility (ARIA, keyboard flows) and responsive layouts.',
      '- Integrated REST APIs and improved perceived performance with lazy loading.',
      '- Used Git/GitHub daily; reviewed PRs and wrote component documentation.',
      '',
      'Skills: HTML, CSS, JavaScript, React, Git, REST APIs, accessibility, responsive design',
      'Education: B.S. Computer Science',
    ].join('\n'),
  },
  fullstack: {
    role: 'Full Stack Developer at Harbor Systems',
    background: [
      'Alex Rivera',
      'Full stack engineer shipping features from database to UI.',
      '',
      'Experience',
      '- Developed React clients and Node.js services for a logistics platform.',
      '- Designed PostgreSQL schemas and REST APIs used by internal tools.',
      '- Containerized services with Docker and deployed to AWS.',
      '- Maintained GitHub Actions pipelines and wrote TypeScript across the stack.',
      '',
      'Skills: JavaScript, TypeScript, React, Node.js, SQL, PostgreSQL, REST, Git, Docker, AWS, CI/CD',
      'Education: B.S. Software Engineering',
    ].join('\n'),
  },
  python: {
    role: 'Python Engineer at Meridian Data',
    background: [
      'Sam Okonkwo',
      'Backend engineer focused on Python services and data pipelines.',
      '',
      'Experience',
      '- Built FastAPI services and Django admin tools for an analytics product.',
      '- Wrote SQL against PostgreSQL and automated tests with pytest.',
      '- Operated Linux servers, used Git daily, and shipped Docker images.',
      '- Collaborated with data science on REST integrations.',
      '',
      'Skills: Python, FastAPI, Django, SQL, PostgreSQL, pytest, Git, Docker, Linux, REST APIs',
      'Education: M.S. Computer Science',
    ].join('\n'),
  },
};

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function showError(message) {
  formError.hidden = false;
  formError.textContent = message;
}

function clearError() {
  formError.hidden = true;
  formError.textContent = '';
}

function setLoading(isLoading) {
  generateBtn.disabled = isLoading;
  generateBtn.textContent = isLoading ? 'Generating…' : 'Generate Resume';
}

/* ---------- What-if score simulation ---------- */

let baseMatchScore = 0;
let totalCatalogLength = 0;
let missingSkillOrder = [];              // fixed order: decides badge colour AND ring segment order
const simulatedAddedSkills = new Set();  // missing skills the user has clicked

const SKILL_COLORS = [
  { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe', hex: '#2563eb' },
  { bg: '#fdf4ff', text: '#a21caf', border: '#f5d0fe', hex: '#c026d3' },
  { bg: '#fff7ed', text: '#c2410c', border: '#fed7aa', hex: '#ea580c' },
  { bg: '#fefce8', text: '#a16207', border: '#fef08a', hex: '#ca8a04' },
  { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0', hex: '#16a34a' },
  { bg: '#fdf2f8', text: '#be185d', border: '#fbcfe8', hex: '#db2777' },
  { bg: '#f8fafc', text: '#334155', border: '#cbd5e1', hex: '#475569' },
];

function colorForSkill(name) {
  const i = missingSkillOrder.indexOf(name);
  return SKILL_COLORS[(i < 0 ? 0 : i) % SKILL_COLORS.length];
}

function baseCaption(score) {
  return score >= 80
    ? 'Strong alignment with the target role.'
    : score >= 60
      ? 'Solid foundation with a few high-impact gaps. Click a missing skill to see your score grow!'
      : 'Prioritize the missing skills. Click one to see how much your score grows!';
}

function updateScoreRingAndSimulation() {
  const boostPerSkill = totalCatalogLength > 0 ? Math.round(88 / totalCatalogLength) : 8;
  const selected = missingSkillOrder.filter((s) => simulatedAddedSkills.has(s));
  const simulatedScore = Math.min(99, baseMatchScore + selected.length * boostPerSkill);

  matchProbabilityEl.textContent = `${simulatedScore}%`;
  scoreRing.style.setProperty('--p', String(simulatedScore));

  // base score in navy, then one coloured slice per selected skill, then grey
  const stops = [`#0f2744 0% ${baseMatchScore}%`];
  let currentPct = baseMatchScore;
  selected.forEach((skillName) => {
    const nextPct = Math.min(99, currentPct + boostPerSkill);
    stops.push(`${colorForSkill(skillName).hex} ${currentPct}% ${nextPct}%`);
    currentPct = nextPct;
  });
  stops.push(`#e2e8f0 ${currentPct}% 100%`);
  scoreRing.style.background = `conic-gradient(${stops.join(', ')})`;

  matchCaption.textContent = selected.length > 0
    ? `Simulation: +${selected.length} skill(s) selected. Potential match score: ${simulatedScore}%. (Your resume is unchanged.)`
    : baseCaption(baseMatchScore);
}

function renderSkills(listEl, skills, isMissing = false) {
  listEl.innerHTML = '';
  if (!Array.isArray(skills) || skills.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'empty';
    empty.textContent = isMissing ? 'No missing skills - perfect match!' : 'None listed';
    listEl.appendChild(empty);
    return;
  }

  skills.forEach((skill) => {
    const item = document.createElement('li');
    item.textContent = String(skill);

    if (isMissing) {
      const color = colorForSkill(skill);
      const selected = simulatedAddedSkills.has(skill);

      item.style.backgroundColor = color.bg;
      item.style.color = color.text;
      item.style.border = `1px solid ${color.border}`;
      item.style.cursor = 'pointer';
      item.style.opacity = selected ? '0.5' : '1';
      item.style.textDecoration = selected ? 'line-through' : 'none';
      item.title = 'Click to simulate adding this skill to your match score';

      item.addEventListener('click', () => {
        if (simulatedAddedSkills.has(skill)) simulatedAddedSkills.delete(skill);
        else simulatedAddedSkills.add(skill);
        renderSkills(listEl, skills, true);
        updateScoreRingAndSimulation();
      });
    }

    listEl.appendChild(item);
  });
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'resume';
}

function detectCatalogKey(targetRole) {
  const text = targetRole.toLowerCase();
  if (/(front[- ]?end|react|ui engineer)/.test(text)) return 'frontend';
  if (/(full[- ]?stack|node|mern)/.test(text)) return 'fullstack';
  if (/(python|django|fastapi|backend)/.test(text)) return 'python';
  return 'general';
}

function hasAlias(haystack, alias) {
  const needle = alias.toLowerCase();
  if (needle.length <= 2) {
    return new RegExp(`(^|[^a-z0-9])${needle}([^a-z0-9]|$)`, 'i').test(haystack);
  }
  return haystack.includes(needle);
}

function analyzeBackground(targetRole, background) {
  const catalogKey = detectCatalogKey(targetRole);
  const catalog = SKILL_CATALOGS[catalogKey] || SKILL_CATALOGS.general;
  const haystack = background.toLowerCase();
  const present = [];
  const missing = [];

  catalog.forEach((skill) => {
    const found = skill.aliases.some((alias) => hasAlias(haystack, alias));
    if (found) present.push(skill.name);
    else missing.push(skill.name);
  });

  const coverage = catalog.length ? present.length / catalog.length : 0.5;
  const lengthBoost = Math.min(background.length / 1800, 0.12);
  const match = Math.round(Math.min(96, Math.max(38, coverage * 88 + lengthBoost * 100 + 6)));

  return { present, missing, match, catalogKey };
}

function extractName(background) {
  const first = background.split(/\n/).map((line) => line.trim()).find(Boolean) || '';
  if (first && first.length <= 48 && !/experience|skills|education|summary/i.test(first)) {
    return first.replace(/^[-•\d.\s]+/, '');
  }
  return 'Candidate';
}

function extractBullets(background) {
  const lines = background.split(/\n/).map((line) => line.trim()).filter(Boolean);
  const bullets = lines
    .filter((line) => /^[-•*]/.test(line) || /developed|built|led|designed|improved|created|shipped/i.test(line))
    .map((line) => line.replace(/^[-•*]+\s*/, ''))
    .slice(0, 6);

  if (bullets.length) return bullets;

  return [
    'Translated product requirements into reliable, well-structured software.',
    'Collaborated with stakeholders to ship incremental improvements.',
    'Documented work and used version control for maintainable delivery.',
  ];
}

function buildResumeHtml(targetRole, background, analysis) {
  const name = escapeHtml(extractName(background));
  const role = escapeHtml(targetRole);
  const summary = `Results-oriented professional targeting ${role}. Demonstrated strengths in ${analysis.present.slice(0, 4).join(', ') || 'core delivery skills'}, with a focus on clear communication and measurable impact.`;
  const bullets = extractBullets(background).map((item) => `<li>${escapeHtml(item)}</li>`).join('');
  const skills = analysis.present.length
    ? analysis.present.map((skill) => `<li>${escapeHtml(skill)}</li>`).join('')
    : '<li>Core professional competencies evidenced in background</li>';

  return `
    <h1>${name}</h1>
    <p class="resume-meta">${role} · ATS-optimized resume</p>
    <h2>Professional Summary</h2>
    <p>${escapeHtml(summary)}</p>
    <h2>Core Competencies</h2>
    <ul>${skills}</ul>
    <h2>Selected Experience</h2>
    <ul>${bullets}</ul>
    <h2>Skill gap notes</h2>
    <p>Priority development areas for this role: ${escapeHtml(analysis.missing.slice(0, 4).join(', ') || 'none identified')}.</p>
  `;
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function simulateAnalysis(targetRole, background) {
  await sleep(450);
  const analysis = analyzeBackground(targetRole, background);
  return {
    rewritten_resume_html: buildResumeHtml(targetRole, background, analysis),
    match_probability: analysis.match,
    present_skills: analysis.present,
    missing_skills: analysis.missing,
  };
}

const MAX_FILE_BYTES = 5 * 1024 * 1024;
const PDFJS_VERSION = '3.11.174';
const PDFJS_WORKER_URL = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.worker.min.js`;

const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const browseBtn = document.getElementById('browse-btn');
const fileChip = document.getElementById('file-chip');
const fileNameEl = document.getElementById('file-name');
const fileStatusEl = document.getElementById('file-status');
const fileRemoveBtn = document.getElementById('file-remove');

let pdfWorkerReady = null;

function preparePdfWorker() {
  if (pdfWorkerReady) return pdfWorkerReady;
  pdfWorkerReady = (async () => {
    if (!window.pdfjsLib) throw new Error('PDF reader failed to load. Check your connection, or paste your text manually.');
    try {
      const res = await fetch(PDFJS_WORKER_URL);
      if (!res.ok) throw new Error('worker fetch failed');
      const blob = new Blob([await res.text()], { type: 'text/javascript' });
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = URL.createObjectURL(blob);
    } catch (e) {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_URL;
    }
  })();
  return pdfWorkerReady;
}

function readFileAs(file, method) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Could not read the file.'));
    reader[method](file);
  });
}

async function extractPdfText(file) {
  await preparePdfWorker();
  const data = new Uint8Array(await readFileAs(file, 'readAsArrayBuffer'));
  const pdf = await window.pdfjsLib.getDocument({ data }).promise;
  const pages = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    let text = '';
    let lastY = null;

    content.items.forEach((item) => {
      if (typeof item.str !== 'string') return;
      const y = item.transform[5];
      if (lastY !== null && Math.abs(y - lastY) > 2 && !text.endsWith('\n')) text += '\n';
      text += item.str;
      if (item.hasEOL && !text.endsWith('\n')) text += '\n';
      else if (item.str && !item.hasEOL) text += ' ';
      lastY = y;
    });
    pages.push(text);
  }

  return pages.join('\n\n');
}

function normalizeText(text) {
  return text
    .replace(/\r\n?/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function setChip(name, status) {
  fileChip.hidden = !name;
  fileNameEl.textContent = name || '';
  fileStatusEl.textContent = status || '';
}

async function handleFile(file) {
  if (!file) return;
  clearError();

  const name = file.name.toLowerCase();
  const isPdf = file.type === 'application/pdf' || name.endsWith('.pdf');
  const isTxt = file.type === 'text/plain' || name.endsWith('.txt');

  if (!isPdf && !isTxt) {
    showError('Unsupported file type. Please upload a PDF or TXT file.');
    return;
  }
  if (file.size > MAX_FILE_BYTES) {
    showError('That file is larger than 5 MB. Please upload a smaller file.');
    return;
  }

  dropZone.classList.add('busy');
  setChip(file.name, 'Reading…');

  try {
    const raw = isPdf ? await extractPdfText(file) : await readFileAs(file, 'readAsText');
    const text = normalizeText(raw);

    if (!text) {
      throw new Error(isPdf
        ? 'No readable text found. This PDF may be a scanned image; please paste the text manually or use a text-based PDF.'
        : 'The file is empty.');
    }

    backgroundInput.value = text;
    backgroundInput.dispatchEvent(new Event('input', { bubbles: true }));
    setChip(file.name, `Loaded ${text.length.toLocaleString()} characters`);
  } catch (error) {
    setChip('', '');
    showError(error.message || 'Could not read that file.');
  } finally {
    dropZone.classList.remove('busy');
    fileInput.value = '';
  }
}

presetSelect.addEventListener('change', () => {
  const preset = PRESETS[presetSelect.value];
  if (!preset) return;
  targetRoleInput.value = preset.role;
  backgroundInput.value = preset.background;
  clearError();
});

browseBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  fileInput.click();
});
dropZone.addEventListener('click', () => fileInput.click());
dropZone.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    fileInput.click();
  }
});
fileInput.addEventListener('change', () => handleFile(fileInput.files[0]));

['dragenter', 'dragover'].forEach((type) =>
  dropZone.addEventListener(type, (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
  })
);
['dragleave', 'dragend'].forEach((type) =>
  dropZone.addEventListener(type, () => dropZone.classList.remove('dragover'))
);
dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('dragover');
  handleFile(e.dataTransfer.files[0]);
});

['dragover', 'drop'].forEach((type) =>
  window.addEventListener(type, (e) => {
    if (!dropZone.contains(e.target)) e.preventDefault();
  })
);

fileRemoveBtn.addEventListener('click', () => {
  backgroundInput.value = '';
  setChip('', '');
  clearError();
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  clearError();

  const targetRole = targetRoleInput.value.trim();
  const background = backgroundInput.value.trim();

  if (!targetRole || !background) {
    showError('Please enter a target role and your background text.');
    return;
  }

  setLoading(true);

  try {
    const parsed = await simulateAnalysis(targetRole, background);
    const html = parsed.rewritten_resume_html;
    const match = Number.parseInt(parsed.match_probability, 10);

    if (typeof html !== 'string' || !html.trim()) {
      throw new Error('Resume HTML was missing from the response.');
    }

    resumePreview.innerHTML = html;
    // reset the what-if simulation for this new resume
    simulatedAddedSkills.clear();
    baseMatchScore = Number.isFinite(match) ? match : 0;
    const catalogKey = detectCatalogKey(targetRole);
    totalCatalogLength = (SKILL_CATALOGS[catalogKey] || SKILL_CATALOGS.general).length;
    missingSkillOrder = Array.isArray(parsed.missing_skills) ? [...parsed.missing_skills] : [];

    renderSkills(presentSkillsEl, parsed.present_skills, false);
    renderSkills(missingSkillsEl, missingSkillOrder, true);
    updateScoreRingAndSimulation();
    dashboard.hidden = false;
    dashboard.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (error) {
    showError(error.message || 'Could not generate the resume. Please try again.');
  } finally {
    setLoading(false);
  }
});

downloadPdfBtn.addEventListener('click', () => {
  if (!resumePreview.innerHTML.trim()) {
    showError('Generate a resume before downloading a PDF.');
    return;
  }
  if (typeof html2pdf !== 'function') {
    showError('PDF exporter failed to load. Check your connection and refresh.');
    return;
  }

  const filename = `${slugify(targetRoleInput.value.trim())}-resume.pdf`;

  resumePreview.classList.add('pdf-export');
  const cleanup = () => resumePreview.classList.remove('pdf-export');

  html2pdf()
    .set({
      margin: 10,
      filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
    })
    .from(resumePreview)
    .save()
    .then(cleanup)
    .catch(() => {
      cleanup();
      showError('Could not export the PDF. Please try again.');
    });
});
