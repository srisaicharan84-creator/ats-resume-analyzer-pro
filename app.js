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
const classicFields = document.getElementById('classic-fields');
const quickfillWizard = document.getElementById('quickfill-wizard');
const modeClassicBtn = document.getElementById('mode-classic');
const modeQuickfillBtn = document.getElementById('mode-quickfill');
const inputLede = document.getElementById('input-lede');
const wizardBackBtn = document.getElementById('wizard-back');
const wizardNextBtn = document.getElementById('wizard-next');
const roleButtonsEl = document.getElementById('role-buttons');
const skillGroupsEl = document.getElementById('skill-groups');
const extraSkillInput = document.getElementById('qf-extra-skill');
const extraSkillList = document.getElementById('extra-skill-list');
const addExtraSkillBtn = document.getElementById('add-extra-skill');
const levelSelect = document.getElementById('experience-level');
const levelNote = document.getElementById('level-note');

let inputMode = 'classic';
let selectedRoleId = '';
const selectedSkills = new Set();
let extraSkills = [];
let wizardStep = 1;

const ROLE_TRACKS = [
  {
    id: 'frontend',
    label: 'Frontend Developer',
    title: 'Frontend Developer / Engineer',
    skills: {
      'Foundation': [
        'HTML5',
        'CSS3 (Flexbox, Grid)',
        'JavaScript (ES6+)',
        'Responsive Design & Cross-Browser Compatibility',
        'Git & GitHub/GitLab',
      ],
      'Intermediate': [
        'React.js',
        'Vue.js',
        'Angular',
        'Redux',
        'Zustand',
        'Pinia',
        'Vite',
        'Webpack',
        'Babel',
        'Tailwind CSS',
        'CSS Modules',
        'Sass',
      ],
      'Cutting-edge': [
        'Next.js',
        'Nuxt.js',
        'TypeScript',
        'Performance Optimization',
        'Web Vitals',
        'Code Splitting',
        'Micro-Frontends',
        'Progressive Web Apps (PWA)',
        'WebGL',
        'Three.js',
      ],
    },
  },
  {
    id: 'backend',
    label: 'Backend Developer',
    title: 'Backend Developer / Engineer',
    skills: {
      'Foundation': [
        'Python',
        'Java',
        'Node.js',
        'C#',
        'C++',
        'PostgreSQL',
        'MySQL',
        'RESTful APIs',
        'Data Structures & Algorithms',
      ],
      'Intermediate': [
        'Express.js',
        'FastAPI',
        'Django',
        'Spring Boot',
        'ASP.NET Core',
        'MongoDB',
        'Redis',
        'Cassandra',
        'OAuth 2.0',
        'JWT',
        'OpenID',
        'Docker',
        'API Gateways',
      ],
      'Cutting-edge': [
        'Distributed Systems Architecture',
        'Event-Driven Architecture (Kafka, RabbitMQ)',
        'Go',
        'Rust',
        'Microservices Architecture',
        'GraphQL',
        'Protocol Buffers / gRPC',
      ],
    },
  },
  {
    id: 'fullstack',
    label: 'Full-Stack Engineer',
    title: 'Full-Stack Engineer',
    skills: {
      'Foundation': [
        'HTML',
        'CSS',
        'JavaScript/TypeScript',
        'SQL & Database Schema Design',
        'Node.js / Express',
        'Python / FastAPI',
      ],
      'Intermediate': [
        'MERN',
        'MEAN',
        'Next.js + PostgreSQL / Prisma',
        'CI/CD',
        'Docker',
        'AWS',
        'GCP',
        'Azure',
        'REST APIs',
        'GraphQL',
      ],
      'Cutting-edge': [
        'AWS Lambda',
        'Cloudflare Workers',
        'Serverless Architectures',
        'Edge Computing',
        'tRPC',
        'AI-Assisted Development',
        'Agentic API workflows',
      ],
    },
  },
  {
    id: 'ml',
    label: 'AI / ML Engineer',
    title: 'AI / Machine Learning Engineer',
    skills: {
      'Foundation': [
        'Python',
        'NumPy',
        'Pandas',
        'Linear Algebra',
        'Calculus',
        'Probability & Statistics',
        'Scikit-learn',
      ],
      'Intermediate': [
        'PyTorch',
        'TensorFlow',
        'Model Evaluation',
        'Hyperparameter Tuning',
        'Feature Engineering',
        'OpenCV',
        'Natural Language Processing',
      ],
      'Cutting-edge': [
        'LLM Fine-Tuning (LoRA, QLoRA)',
        'Hugging Face Transformers',
        'RAG',
        'Pinecone',
        'Qdrant',
        'ChromaDB',
        'LangChain',
        'AutoGen',
        'LlamaIndex',
        'MCP',
        'MLflow',
        'Kubeflow',
      ],
    },
  },
  {
    id: 'devops',
    label: 'DevOps / Platform',
    title: 'DevOps / Platform Engineer',
    skills: {
      'Foundation': [
        'Linux Administration',
        'Bash',
        'Git',
        'TCP/IP',
        'DNS',
        'HTTP',
        'AWS',
        'Azure',
        'GCP',
      ],
      'Intermediate': [
        'GitHub Actions',
        'GitLab CI',
        'Jenkins',
        'Terraform',
        'Ansible',
        'Docker',
        'Kubernetes',
      ],
      'Cutting-edge': [
        'ArgoCD',
        'Flux',
        'Prometheus',
        'Grafana',
        'OpenTelemetry',
        'Datadog',
        'Istio',
        'Linkerd',
        'Internal Developer Platforms',
        'FinOps',
        'Chaos Engineering',
      ],
    },
  },
  {
    id: 'cloud',
    label: 'Cloud Engineer',
    title: 'Cloud Engineer / Architect',
    skills: {
      'Foundation': [
        'AWS Fundamentals',
        'Azure Fundamentals',
        'GCP Fundamentals',
        'VPC & Subnets',
        'Firewalls',
        'Load Balancers',
        'Cloud Storage',
        'IAM',
      ],
      'Intermediate': [
        'Terraform',
        'CloudFormation',
        'Multi-AZ / Multi-Region Deployments',
        'Cloud Security & Compliance',
      ],
      'Cutting-edge': [
        'Multi-Cloud Architecture',
        'Hybrid-Cloud Architecture',
        'Cloud-Native Architecture',
        'Serverless',
        'Event-Driven Design',
        'High-Availability & Disaster Recovery',
      ],
    },
  },
  {
    id: 'security',
    label: 'Cybersecurity / AppSec',
    title: 'Cybersecurity / Application Security Engineer',
    skills: {
      'Foundation': [
        'Networking Protocols',
        'Linux/Windows Security',
        'CIA Triad',
        'Cryptography basics',
        'Python',
        'Bash',
      ],
      'Intermediate': [
        'OWASP Top 10',
        'SAST',
        'DAST',
        'Burp Suite',
        'Metasploit',
        'Nmap',
      ],
      'Cutting-edge': [
        'DevSecOps',
        'Zero Trust Network Architecture',
        'Cloud Security',
        'LLM Pipeline Security',
        'Prompt Injection Defense',
      ],
    },
  },
  {
    id: 'data',
    label: 'Data Engineer',
    title: 'Data Engineer',
    skills: {
      'Foundation': [
        'Advanced SQL',
        'Python',
        'Scala',
        'Dimensional Modeling',
        'Star Schema',
      ],
      'Intermediate': [
        'Apache Airflow',
        'dbt',
        'Apache Spark',
        'PySpark',
        'Snowflake',
        'AWS Redshift',
        'Google BigQuery',
      ],
      'Cutting-edge': [
        'Apache Kafka',
        'Apache Flink',
        'Delta Lake',
        'Apache Iceberg',
        'Data Mesh',
        'Automated Data Governance',
      ],
    },
  },
  {
    id: 'embedded',
    label: 'Embedded / IoT',
    title: 'Embedded Systems / IoT Software Engineer',
    skills: {
      'Foundation': [
        'C',
        'C++',
        'Digital Logic',
        'ARM Cortex',
        'AVR',
        'UART',
        'SPI',
        'I2C',
      ],
      'Intermediate': [
        'FreeRTOS',
        'Zephyr',
        'Hardware Interfacing',
        'JTAG',
        'Embedded Linux',
      ],
      'Cutting-edge': [
        'Rust',
        'TinyML',
        'Secure Boot',
        'Hardware-level Security',
        'OTA Firmware Updates',
      ],
    },
  },
];

function skillToEntry(name, tier) {
  const aliases = new Set([name.toLowerCase()]);
  name
    .toLowerCase()
    .split(/[/,&+()]+/)
    .map((part) => part.trim())
    .filter((part) => part.length > 1)
    .forEach((part) => aliases.add(part));

  // "React.js" -> "react", "CSS3" -> "css", "HTML5" -> "html"
  [...aliases].forEach((alias) => {
    const noJs = alias.replace(/\.js$/, '');
    if (noJs !== alias && noJs.length > 1) aliases.add(noJs);
    const noDigit = alias.match(/^([a-z]{3,})\d$/);
    if (noDigit) aliases.add(noDigit[1]);
  });

  return { name, tier, aliases: [...aliases] };
}

function flattenRoleSkills(track) {
  return Object.entries(track.skills).flatMap(([tier, skills]) =>
    skills.map((skill) => skillToEntry(skill, tier))
  );
}

const SKILL_CATALOGS = {
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

ROLE_TRACKS.forEach((track) => {
  SKILL_CATALOGS[track.id] = flattenRoleSkills(track);
});

/* ---------- Experience levels (tiers) ----------
   skillTiers: which catalog tiers (Foundation / Intermediate / Cutting-edge) count
   toward the score and the "missing skills" list for this level. A fresher is only
   measured against Foundation skills, never against senior/expert ones.
   tags: ATS profile tags. `always` tags describe the level itself; every other tag
   is added to the resume ONLY if the candidate's own text shows evidence of it.
   verbs: action verbs, grouped by the kind of action they can safely replace. */
const EXPERIENCE_LEVELS = [
  {
    id: 't1', short: 'Tier 1', label: 'Intern / Apprentice', range: '0–6 months',
    phrase: 'Entry-level', skillTiers: ['Foundation'],
    titles: ['Software Engineering Intern', 'Web Development Intern', 'Trainee Developer', 'Apprentice Engineer'],
    verbs: { create: ['Developed', 'Built', 'Implemented'], support: ['Assisted'] },
    tags: [
      { label: 'Entry-Level', always: true },
      { label: 'Student', aliases: ['student', 'undergraduate', 'university', 'college'] },
      { label: 'Fast Learner', aliases: ['fast learner', 'quick learner', 'self-taught'] },
      { label: 'Hands-On Projects', aliases: ['project', 'projects'] },
      { label: 'Version Control Basics', aliases: ['git', 'github', 'version control'] },
      { label: 'Academic Projects', aliases: ['academic', 'coursework', 'capstone'] },
    ],
  },
  {
    id: 't2', short: 'Tier 2', label: 'Fresher / Associate', range: '0–1.5 years',
    phrase: 'Junior', skillTiers: ['Foundation'],
    titles: ['Associate Software Engineer (ASE)', 'Graduate Engineer Trainee (GET)', 'Junior Software Developer', 'Full-Stack Trainee'],
    verbs: { create: ['Constructed'], improve: ['Optimized'] },
    tags: [
      { label: 'Junior Engineer', always: true },
      { label: 'Production Code', aliases: ['production'] },
      { label: 'Feature Implementation', aliases: ['feature', 'features'] },
      { label: 'Unit Testing', aliases: ['unit test', 'unit tests', 'unit testing', 'pytest', 'jest', 'junit', 'unittest'] },
      { label: 'Agile/Scrum', aliases: ['agile', 'scrum'] },
      { label: 'REST APIs', aliases: ['rest', 'restful', 'rest apis'] },
    ],
  },
  {
    id: 't3', short: 'Tier 3', label: 'Mid-Level Engineer', range: '1–3 years',
    phrase: 'Mid-level', skillTiers: ['Foundation', 'Intermediate'],
    titles: ['Software Development Engineer (SDE / SE)', 'Full Stack Developer', 'Frontend Engineer', 'Backend Developer', 'Systems Analyst'],
    verbs: { create: ['Engineered'], improve: ['Optimized', 'Enhanced'] },
    tags: [
      { label: 'Mid-Level', always: true },
      { label: 'Module Ownership', aliases: ['owned', 'ownership'] },
      { label: 'Microservices', aliases: ['microservices', 'microservice'] },
      { label: 'Database Optimization', aliases: ['database optimization', 'query optimization', 'indexing'] },
      { label: 'CI/CD Pipelines', aliases: ['ci/cd', 'github actions', 'jenkins', 'gitlab ci'] },
      { label: 'TypeScript', aliases: ['typescript'] },
      { label: 'Cloud Integration', aliases: ['aws', 'azure', 'gcp', 'cloud'] },
    ],
  },
  {
    id: 't4', short: 'Tier 4', label: 'Senior / Lead Engineer', range: '4–5 years',
    phrase: 'Senior', skillTiers: ['Foundation', 'Intermediate', 'Cutting-edge'],
    titles: ['Senior Software Engineer (SSE)', 'Technical Lead', 'Senior DevOps Engineer', 'Senior AI Engineer', 'Solutions Specialist'],
    verbs: { create: ['Engineered'], lead: ['Directed'] },
    tags: [
      { label: 'Senior Engineer', always: true },
      { label: 'System Design', aliases: ['system design', 'architecture'] },
      { label: 'High Availability', aliases: ['high availability', 'failover'] },
      { label: 'Distributed Systems', aliases: ['distributed systems', 'distributed'] },
      { label: 'Technical Leadership', aliases: ['mentor', 'mentored', 'tech lead', 'technical lead', 'led a team'] },
      { label: 'Cross-Functional Collaboration', aliases: ['cross-functional'] },
    ],
  },
  {
    id: 't5', short: 'Tier 5', label: 'Expert / Architect / Principal', range: '6+ years',
    phrase: 'Principal-level', skillTiers: ['Foundation', 'Intermediate', 'Cutting-edge'],
    titles: ['Staff Engineer', 'Principal Software Engineer', 'Enterprise Architect', 'Lead AI Architect', 'Head of Technology'],
    verbs: { create: ['Engineered'], operate: ['Standardized'] },
    tags: [
      { label: 'Subject Matter Expert', aliases: ['subject matter expert'] },
      { label: 'Domain-Driven Design', aliases: ['domain-driven', 'ddd'] },
      { label: 'Multi-Cloud Infrastructure', aliases: ['multi-cloud'] },
      { label: 'Zero-Trust Security', aliases: ['zero trust', 'zero-trust'] },
      { label: 'FinOps', aliases: ['finops'] },
      { label: 'Enterprise Scale', aliases: ['enterprise'] },
    ],
  },
];

// Verbs that can be swapped for a level verb without changing the meaning or overstating the work.
// (Only clean synonyms: "Helped X" / "Led X" are left alone because a swap would read wrong.)
const VERB_GROUPS = {
  create: ['built', 'developed', 'created', 'implemented', 'designed', 'wrote', 'made', 'constructed', 'engineered'],
  improve: ['improved', 'optimized', 'optimised', 'enhanced', 'streamlined'],
  support: ['supported'],
  lead: ['managed', 'headed'],
  operate: ['standardised', 'standardized'],
};

function getSelectedLevel() {
  return EXPERIENCE_LEVELS.find((level) => level.id === levelSelect.value) || null;
}

function levelById(id) {
  return EXPERIENCE_LEVELS.find((level) => level.id === id);
}

// Returns { level, source } where source says how the level was decided.
function detectLevel(targetRole, background) {
  const picked = getSelectedLevel();
  if (picked) return { level: picked, source: 'selected' };

  const role = targetRole.toLowerCase();
  if (/(intern\b|internship|apprentice|trainee developer)/.test(role)) return { level: levelById('t1'), source: 'role' };
  if (/(fresher|fresh graduate|graduate|entry[- ]level|junior|associate|trainee|\bget\b)/.test(role)) return { level: levelById('t2'), source: 'role' };
  if (/(staff|principal|architect\b|head of|distinguished)/.test(role)) return { level: levelById('t5'), source: 'role' };
  if (/(senior|\bsr\b|\blead\b|\bsse\b)/.test(role)) return { level: levelById('t4'), source: 'role' };

  const text = background.toLowerCase();
  if (/\b(fresher|fresh graduate|recent graduate|entry[- ]level)\b/.test(text)) return { level: levelById('t2'), source: 'role' };
  const m = text.match(/(\d+(?:\.\d+)?)\s*\+?\s*(?:years?|yrs?)(?:\s+of)?\s+(?:professional\s+)?experience/)
    || text.match(/(\d+(?:\.\d+)?)\s*\+?\s*(?:years?|yrs?)\b/);
  if (m) {
    const years = parseFloat(m[1]);
    const id = years <= 1.5 ? 't2' : years < 4 ? 't3' : years < 6 ? 't4' : 't5';
    return { level: levelById(id), source: 'years' };
  }
  return { level: levelById('t3'), source: 'default' };
}

// Only the skills that belong to this level are scored / reported as missing.
function getCatalog(catalogKey, level) {
  const full = SKILL_CATALOGS[catalogKey] || SKILL_CATALOGS.general;
  if (!level || !full.some((skill) => skill.tier)) return full;
  return full.filter((skill) => level.skillTiers.includes(skill.tier));
}

function pickTags(level, haystack, missing, catalogKey) {
  // Never emit a tag that names (or is an alias of) a skill the candidate lacks.
  const blocked = new Set();
  const missingLower = new Set(missing.map((name) => name.toLowerCase()));
  missingLower.forEach((name) => blocked.add(name));
  (SKILL_CATALOGS[catalogKey] || []).forEach((skill) => {
    if (missingLower.has(skill.name.toLowerCase())) skill.aliases.forEach((alias) => blocked.add(alias));
  });
  return level.tags
    .filter((tag) => tag.always || tag.aliases.some((alias) => hasAlias(haystack, alias)))
    .map((tag) => tag.label)
    .filter((label) => !blocked.has(label.toLowerCase()));
}

// Swap a leading weak verb for a level verb of the same meaning (rotating through them).
function applyLevelVerbs(bullets, level) {
  const used = {};
  return bullets.map((bullet) => {
    const match = bullet.match(/^([A-Za-z]+)\b(.*)$/s);
    if (!match) return bullet;
    const group = Object.keys(VERB_GROUPS).find((g) => VERB_GROUPS[g].includes(match[1].toLowerCase()));
    const options = group && level.verbs[group];
    if (!options) return bullet;
    if (options.some((v) => v.toLowerCase() === match[1].toLowerCase())) return bullet;
    const i = used[group] || 0;
    used[group] = i + 1;
    return `${options[i % options.length]}${match[2]}`;
  });
}

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

function renderLevelNote(result) {
  if (!levelNote) return;
  const { level, level_source: source, catalog_key: key } = result;
  const track = ROLE_TRACKS.find((t) => t.id === key);
  const domain = track ? track.label : 'general professional';
  const how = {
    selected: '',
    role: ' (detected from your role / resume text)',
    years: ' (detected from the years in your background)',
    default: ' (no level found, so assumed; choose one above for an exact score)',
  }[source];

  levelNote.innerHTML = '';
  const scope = document.createElement('p');
  scope.textContent = `Scored as ${level.short} · ${level.label} (${level.range})${how}. Only ${level.skillTiers.join(' + ')} skills in ${domain} are counted.`;
  const titles = document.createElement('p');
  titles.textContent = `Resume titles for this level: ${level.titles.join(' · ')}`;
  levelNote.append(scope, titles);
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

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Whole-word match, so "java" no longer matches inside "javascript" and "c" not inside "c++".
function hasAlias(haystack, alias) {
  const needle = alias.toLowerCase().trim();
  if (!needle) return false;
  return new RegExp(`(^|[^a-z0-9+#])${escapeRegExp(needle)}(?![a-z0-9+#])`, 'i').test(haystack);
}

// Role text gives no domain? Infer it from the skills actually present in the background.
function inferDomainFromBackground(background) {
  const haystack = background.toLowerCase();
  let best = null;
  let bestScore = 0;
  ROLE_TRACKS.forEach((track) => {
    const catalog = SKILL_CATALOGS[track.id];
    const hits = catalog.filter((skill) => skill.aliases.some((alias) => hasAlias(haystack, alias))).length;
    const score = hits + hits / catalog.length;
    if (hits >= 3 && score > bestScore) {
      best = track.id;
      bestScore = score;
    }
  });
  return best || 'general';
}

function detectCatalogKey(targetRole, background = '') {
  if (inputMode === 'quickfill' && selectedRoleId && SKILL_CATALOGS[selectedRoleId]) {
    return selectedRoleId;
  }
  const text = targetRole.toLowerCase();
  if (/(front[- ]?end|react|ui engineer)/.test(text)) return 'frontend';
  if (/(full[- ]?stack|mern|mean)/.test(text)) return 'fullstack';
  if (/(machine learning|\bml\b|\bai\b|llm)/.test(text)) return 'ml';
  if (/(dev ?ops|platform engineer|kubernetes|\bsre\b|site reliability)/.test(text)) return 'devops';
  if (/(cloud architect|cloud engineer)/.test(text)) return 'cloud';
  if (/(security|appsec|cyber)/.test(text)) return 'security';
  if (/(data engineer|spark|airflow)/.test(text)) return 'data';
  if (/(embedded|iot|firmware)/.test(text)) return 'embedded';
  if (/(python|django|fastapi|back[- ]?end)/.test(text)) return 'backend';
  return inferDomainFromBackground(background);
}

function analyzeBackground(targetRole, background, level) {
  const catalogKey = detectCatalogKey(targetRole, background);
  const catalog = getCatalog(catalogKey, level);
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

  return { present, missing, match, catalogKey, catalogSize: catalog.length };
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

function contactLine(profile) {
  if (!profile) return '';
  return [profile.email, profile.phone, profile.location].filter(Boolean).join(' · ');
}

function linksLine(profile) {
  if (!profile) return '';
  return [profile.linkedin, profile.github].filter(Boolean).join(' · ');
}

function buildResumeHtml(targetRole, background, analysis, profile, level) {
  const name = escapeHtml(profile?.name || extractName(background));
  const role = escapeHtml(targetRole);

  // Resume only ever lists skills the candidate has. Missing skills never appear here.
  const missingSet = new Set(analysis.missing.map((skill) => skill.toLowerCase()));
  const skillNames = (profile?.skills?.length ? profile.skills : analysis.present)
    .filter((skill) => !missingSet.has(skill.toLowerCase()));

  // Level tags: the level label always, the rest only when the background supports them.
  const tags = pickTags(level, background.toLowerCase(), analysis.missing, analysis.catalogKey)
    .filter((tag) => !skillNames.some((skill) => skill.toLowerCase() === tag.toLowerCase()));

  const strengths = skillNames.slice(0, 5).join(', ') || 'core delivery skills';
  const summary = `${level.phrase} professional targeting ${targetRole}. Demonstrated strengths in ${strengths}, with a focus on clear communication and measurable impact.`;
  const bullets = applyLevelVerbs(extractBullets(background), level)
    .map((item) => `<li>${escapeHtml(item)}</li>`).join('');
  const competencies = [...skillNames, ...tags];
  const skills = competencies.length
    ? competencies.map((skill) => `<li>${escapeHtml(skill)}</li>`).join('')
    : '<li>Core professional competencies evidenced in background</li>';
  const contact = escapeHtml(contactLine(profile));
  const links = escapeHtml(linksLine(profile));
  const education = profile?.education ? `<h2>Education</h2><p>${escapeHtml(profile.education)}</p>` : '';
  const extras = profile?.certs
    ? `<h2>Certifications &amp; Projects</h2><p>${escapeHtml(profile.certs).replace(/\n/g, '<br>')}</p>`
    : '';

  return `
    <h1>${name}</h1>
    <p class="resume-meta">${role}</p>
    ${contact ? `<p class="resume-meta">${contact}</p>` : ''}
    ${links ? `<p class="resume-meta">${links}</p>` : ''}
    <h2>Professional Summary</h2>
    <p>${escapeHtml(summary)}</p>
    <h2>Core Competencies</h2>
    <ul>${skills}</ul>
    <h2>Selected Experience</h2>
    <ul>${bullets}</ul>
    ${education}
    ${extras}
  `;
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function simulateAnalysis(targetRole, background, profile) {
  await sleep(450);
  const { level, source } = detectLevel(targetRole, background);
  const analysis = analyzeBackground(targetRole, background, level);

  if (profile?.skills?.length) {
    const catalog = getCatalog(analysis.catalogKey, level);
    const picked = new Set((profile.pickedSkills || []).map((s) => s.toLowerCase()));
    const typed = (profile.extraSkills || []).map((s) => s.toLowerCase());

    // A level skill counts as "had" if it was tapped, or a typed extra clearly names it.
    const hadSkill = (skill) =>
      picked.has(skill.name.toLowerCase())
      || typed.some((extra) => skill.aliases.some((alias) => hasAlias(extra, alias)));

    const inLevelPresent = catalog.filter(hadSkill);
    analysis.present = inLevelPresent.map((s) => s.name);
    analysis.missing = catalog.filter((skill) => !hadSkill(skill)).map((s) => s.name);

    // Skills outside this level are still shown as "have", but never change the score.
    profile.skills.forEach((skill) => {
      if (!analysis.present.some((n) => n.toLowerCase() === skill.toLowerCase())) analysis.present.push(skill);
    });

    const coverage = catalog.length ? inLevelPresent.length / catalog.length : 0.5;
    analysis.match = Math.round(Math.min(96, Math.max(38, coverage * 88 + 6)));
  }

  return {
    rewritten_resume_html: buildResumeHtml(targetRole, background, analysis, profile, level),
    match_probability: analysis.match,
    present_skills: analysis.present,
    missing_skills: analysis.missing,
    catalog_size: analysis.catalogSize,
    catalog_key: analysis.catalogKey,
    level,
    level_source: source,
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

function getQuickFillProfile() {
  const track = ROLE_TRACKS.find((role) => role.id === selectedRoleId);
  const company = document.getElementById('qf-company').value.trim();
  const roleTitle = track ? track.title : '';
  const targetRole = company ? `${roleTitle} at ${company}` : roleTitle;
  const skills = [
    ...[...selectedSkills],
    ...extraSkills,
  ];
  const highlights = document.getElementById('qf-highlights').value.trim();
  const years = document.getElementById('qf-years').value.trim();
  const jobTitle = document.getElementById('qf-job-title').value.trim();
  const employer = document.getElementById('qf-employer').value.trim();
  const dates = document.getElementById('qf-dates').value.trim();
  const certs = document.getElementById('qf-certs').value.trim();
  const name = document.getElementById('qf-name').value.trim();
  const education = document.getElementById('qf-education').value.trim();

  const experienceBits = [
    [jobTitle, employer].filter(Boolean).join(' · '),
    dates,
    years ? `${years} years of experience` : '',
  ].filter(Boolean);

  const highlightLines = highlights
    ? highlights.split('\n').map((line) => line.trim()).filter(Boolean)
    : [];

  if (!highlightLines.length && (jobTitle || employer || years)) {
    const roleBit = jobTitle || 'engineer';
    const companyBit = employer ? ` at ${employer}` : '';
    const yearBit = years ? ` across ${years} years of experience` : '';
    highlightLines.push(`Delivered production work as ${roleBit}${companyBit}${yearBit}.`);
  }

  const background = [
    name,
    contactLine({
      email: document.getElementById('qf-email').value.trim(),
      phone: document.getElementById('qf-phone').value.trim(),
      location: document.getElementById('qf-location').value.trim(),
    }),
    linksLine({
      linkedin: document.getElementById('qf-linkedin').value.trim(),
      github: document.getElementById('qf-github').value.trim(),
    }),
    '',
    skills.length ? `Skills: ${skills.join(', ')}` : '',
    '',
    'Experience',
    experienceBits.join(' | '),
    ...highlightLines.map((line) => `- ${line.replace(/^[-•*]\s*/, '')}`),
    '',
    education ? `Education: ${education}` : '',
    certs ? `Certifications / projects:\n${certs}` : '',
  ].filter((line) => line !== undefined).join('\n');

  return {
    name,
    email: document.getElementById('qf-email').value.trim(),
    phone: document.getElementById('qf-phone').value.trim(),
    location: document.getElementById('qf-location').value.trim(),
    linkedin: document.getElementById('qf-linkedin').value.trim(),
    github: document.getElementById('qf-github').value.trim(),
    education,
    certs,
    skills,
    pickedSkills: [...selectedSkills],
    extraSkills: [...extraSkills],
    targetRole,
    background,
  };
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  clearError();

  let targetRole = targetRoleInput.value.trim();
  let background = backgroundInput.value.trim();
  let profile = null;

  if (inputMode === 'quickfill') {
    profile = getQuickFillProfile();
    targetRole = profile.targetRole;
    background = profile.background;
    targetRoleInput.value = targetRole;
    backgroundInput.value = background;

    if (!profile.name) {
      showError('Please enter your name.');
      setWizardStep(1);
      return;
    }
    if (!selectedRoleId) {
      showError('Please select a software designation.');
      setWizardStep(3);
      return;
    }
    if (!getSelectedLevel()) {
      showError('Please choose your experience level so the skills match your stage.');
      setWizardStep(3);
      return;
    }
    if (!profile.skills.length) {
      showError('Please select or add at least one skill.');
      setWizardStep(4);
      return;
    }
  } else if (!targetRole || !background) {
    showError('Please enter a target role and your background text.');
    return;
  }

  setLoading(true);

  try {
    const parsed = await simulateAnalysis(targetRole, background, profile);
    const html = parsed.rewritten_resume_html;
    const match = Number.parseInt(parsed.match_probability, 10);

    if (typeof html !== 'string' || !html.trim()) {
      throw new Error('Resume HTML was missing from the response.');
    }

    resumePreview.innerHTML = html;
    // reset the what-if simulation for this new resume
    simulatedAddedSkills.clear();
    baseMatchScore = Number.isFinite(match) ? match : 0;
    totalCatalogLength = parsed.catalog_size;
    missingSkillOrder = Array.isArray(parsed.missing_skills) ? [...parsed.missing_skills] : [];

    renderSkills(presentSkillsEl, parsed.present_skills, false);
    renderSkills(missingSkillsEl, missingSkillOrder, true);
    updateScoreRingAndSimulation();
    renderLevelNote(parsed);
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
function setInputMode(mode) {
  inputMode = mode;
  const isQuick = mode === 'quickfill';
  classicFields.hidden = isQuick;
  quickfillWizard.hidden = !isQuick;
  modeClassicBtn.classList.toggle('is-active', !isQuick);
  modeQuickfillBtn.classList.toggle('is-active', isQuick);
  modeClassicBtn.setAttribute('aria-selected', String(!isQuick));
  modeQuickfillBtn.setAttribute('aria-selected', String(isQuick));
  inputLede.textContent = isQuick
    ? 'Tap through name, details, role, and skills. Generate still shows the resume preview and match probability.'
    : 'Load a sample, upload a file, or paste your background. Or use Quick Fill to tap a role and skills.';
  clearError();
}

function setWizardStep(step) {
  wizardStep = step;
  quickfillWizard.querySelectorAll('.wizard-step').forEach((panel) => {
    panel.hidden = Number(panel.dataset.step) !== step;
  });
  quickfillWizard.querySelectorAll('.wizard-progress li').forEach((item) => {
    const itemStep = Number(item.dataset.step);
    item.classList.toggle('is-active', itemStep === step);
    item.classList.toggle('is-done', itemStep < step);
  });
  wizardBackBtn.disabled = step === 1;
  wizardNextBtn.hidden = step === 5;
}

function renderRoleButtons() {
  roleButtonsEl.innerHTML = '';
  ROLE_TRACKS.forEach((track) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'choice-btn';
    btn.textContent = track.label;
    btn.setAttribute('aria-pressed', String(track.id === selectedRoleId));
    if (track.id === selectedRoleId) btn.classList.add('is-selected');
    btn.addEventListener('click', () => {
      selectedRoleId = track.id;
      selectedSkills.clear();
      renderRoleButtons();
      renderSkillGroups();
    });
    roleButtonsEl.appendChild(btn);
  });
}

function renderSkillGroups() {
  const track = ROLE_TRACKS.find((role) => role.id === selectedRoleId);
  skillGroupsEl.innerHTML = '';
  if (!track) {
    skillGroupsEl.innerHTML = '<p class="wizard-help">Select a role first, then your skill buttons will appear here.</p>';
    return;
  }

  const level = getSelectedLevel();
  const allowedTiers = level ? level.skillTiers : Object.keys(track.skills);
  const tierHelp = document.createElement('p');
  tierHelp.className = 'wizard-help';
  tierHelp.textContent = level
    ? `Showing ${allowedTiers.join(' + ')} skills for ${level.label}. Anything else you know goes in "Additional skill" below.`
    : '';
  if (level) skillGroupsEl.appendChild(tierHelp);

  Object.entries(track.skills).filter(([tier]) => allowedTiers.includes(tier)).forEach(([tier, skills]) => {
    const wrap = document.createElement('div');
    wrap.className = 'skill-tier';
    wrap.innerHTML = `<h4>${escapeHtml(tier)}</h4>`;
    const grid = document.createElement('div');
    grid.className = 'skill-pick-grid';
    skills.forEach((skill) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'skill-pick';
      btn.textContent = skill;
      if (selectedSkills.has(skill)) btn.classList.add('is-selected');
      btn.addEventListener('click', () => {
        if (selectedSkills.has(skill)) selectedSkills.delete(skill);
        else selectedSkills.add(skill);
        renderSkillGroups();
      });
      grid.appendChild(btn);
    });
    wrap.appendChild(grid);
    skillGroupsEl.appendChild(wrap);
  });
}

function renderExtraSkills() {
  extraSkillList.innerHTML = '';
  extraSkills.forEach((skill, index) => {
    const item = document.createElement('li');
    item.textContent = skill;
    item.title = 'Click to remove';
    item.addEventListener('click', () => {
      extraSkills.splice(index, 1);
      renderExtraSkills();
    });
    extraSkillList.appendChild(item);
  });
}

function addExtraSkill() {
  const value = extraSkillInput.value.trim();
  if (!value) return;
  const alreadyListed = selectedSkills.has(value) || extraSkills.some((skill) => skill.toLowerCase() === value.toLowerCase());
  if (!alreadyListed) extraSkills.push(value);
  extraSkillInput.value = '';
  renderExtraSkills();
}

function validateWizardStep(step) {
  if (step === 1 && !document.getElementById('qf-name').value.trim()) {
    showError('Enter your name to continue.');
    return false;
  }
  if (step === 3 && !selectedRoleId) {
    showError('Select a software designation.');
    return false;
  }
  if (step === 3 && !getSelectedLevel()) {
    showError('Choose your experience level above so your skills match your stage.');
    return false;
  }
  if (step === 4 && selectedSkills.size === 0 && extraSkills.length === 0) {
    showError('Select at least one skill, or add an additional skill.');
    return false;
  }
  clearError();
  return true;
}

form.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter' || event.target.tagName === 'TEXTAREA') return;
  if (inputMode === 'quickfill' && wizardStep < 5) {
    event.preventDefault();
    wizardNextBtn.click();
  }
});

modeClassicBtn.addEventListener('click', () => setInputMode('classic'));
modeQuickfillBtn.addEventListener('click', () => setInputMode('quickfill'));
wizardBackBtn.addEventListener('click', () => {
  clearError();
  setWizardStep(Math.max(1, wizardStep - 1));
});
wizardNextBtn.addEventListener('click', () => {
  if (!validateWizardStep(wizardStep)) return;
  const next = Math.min(5, wizardStep + 1);
  if (next === 4) renderSkillGroups();
  setWizardStep(next);
});
addExtraSkillBtn.addEventListener('click', addExtraSkill);
extraSkillInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    addExtraSkill();
  }
});

levelSelect.addEventListener('change', () => {
  const level = getSelectedLevel();
  const track = ROLE_TRACKS.find((role) => role.id === selectedRoleId);
  if (level && track) {
    // Skills above the new level are kept, but move to "Additional skill" so nothing is lost.
    const allowed = new Set(
      Object.entries(track.skills).filter(([tier]) => level.skillTiers.includes(tier)).flatMap(([, list]) => list)
    );
    [...selectedSkills].forEach((skill) => {
      if (!allowed.has(skill)) {
        selectedSkills.delete(skill);
        if (!extraSkills.some((x) => x.toLowerCase() === skill.toLowerCase())) extraSkills.push(skill);
      }
    });
    renderExtraSkills();
  }
  renderSkillGroups();
  clearError();
});

renderRoleButtons();
renderSkillGroups();
renderExtraSkills();
setWizardStep(1);

window.addEventListener('load', () => {
  setTimeout(() => {
    const splash = document.getElementById('splash-screen');
    if (splash) {
      splash.remove();
    }
  }, 1200); 
});
// Theme Toggle Logic
window.addEventListener('DOMContentLoaded', () => {
  const themeBtn = document.getElementById('theme-toggle-btn');
  if (!themeBtn) return;

  const applyTheme = (isDark) => {
    document.body.classList.toggle('dark-mode', isDark);
    themeBtn.textContent = isDark ? '☀️' : '🌙';
    themeBtn.setAttribute('aria-pressed', String(isDark));
  };

  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(saved ? saved === 'dark' : prefersDark);

  themeBtn.addEventListener('click', () => {
    const isDark = !document.body.classList.contains('dark-mode');
    applyTheme(isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
});
