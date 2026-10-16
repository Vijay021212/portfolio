// Every word on the site lives here. Edit freely; the layout adapts.
// Headings: wrap a word in *asterisks* to render it in italic amber, use \n for a line break.

export const content = {
  name: { first: 'Vijay', last: 'Bolle' },
  email: 'mail4vijaybolle@gmail.com',
  links: {
    github: 'https://github.com/Vijay021212',
    linkedin: 'https://www.linkedin.com/in/vijay-bolle-71a7ab211/',
  },

  // Right-hand dot navigation and the robot's scroll choreography both key off these ids.
  sections: [
    { id: 'hero', label: 'Intro' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'achievements', label: 'Receipts' },
    { id: 'contact', label: 'Connect' },
  ],

  hero: {
    greeting: 'Hi, I am', // small line right above the name
    // Serif statement under the name, kept on one line on desktop. *word* = italic gold.
    headline: "Building AI that doesn't just think. It gets *work done*.",
    // One paragraph per entry. The first renders slightly larger.
    pitch: [
      "I'm an AI Engineer building production-grade Agentic AI systems that go beyond conversations to execute real-world workflows.",
      'From processing thousands of healthcare documents to orchestrating intelligent agents across enterprise systems, I turn complex, manual processes into reliable, scalable automation.',
      'My focus is on building AI that is not just powerful, but accurate, explainable, and trustworthy.',
    ],
    tags: ['Agentic AI', 'LangGraph', 'LLMs', 'Intelligent Document Processing', 'Enterprise Automation'],
  },

  about: {
    heading: 'I build agents that *reason*,\nand engineer the guardrails that let them *ship*.',
    // One paragraph per entry; **double asterisks** render bold.
    body: [
      "I'm an **AI Engineer** focused on turning intelligent AI capabilities into reliable, production-ready systems.",
      'I design and build agentic workflows that combine **LLM reasoning, tool orchestration, intelligent document processing, and enterprise integrations** to automate complex healthcare operations, including prior authorization, claims processing, and clinical workflows.',
      'But getting an agent to work is one thing. **Getting it to work reliably at scale is the real engineering challenge.**',
      "That's where I focus on deterministic guardrails, evaluation frameworks, semantic layers, healthcare ontologies, and knowledge-driven validation to reduce hallucinations and make AI decisions more accurate, explainable, and auditable.",
      "I'm also exploring the next generation of enterprise automation through **Microsoft Foundry, UiPath, and open-source agent frameworks**, connecting intelligent agents with real business systems.",
      "**My mission is simple: Build AI that doesn't just demonstrate intelligence, but delivers outcomes organizations can trust.**",
    ],
  },

  skills: {
    heading: 'The *stack*.',
    // Only what you'd defend in an interview; the long tail lives on the resume.
    groups: [
      {
        title: 'Agentic AI & Orchestration',
        items: [
          'LangGraph',
          'LangChain',
          'ReAct supervisor agents',
          'Tool design & guardrails',
          'Human-in-the-loop',
          'Confidence-gated fallbacks',
          'MCP servers (FastMCP)',
        ],
      },
      {
        title: 'Models & Platforms',
        items: [
          'Anthropic Claude (SDK, vision, tool use)',
          'Azure OpenAI',
          'Azure AI Foundry',
          'Open-source LLMs (Qwen, Llama · vLLM, llama.cpp)',
          'MedGemma',
          'Prompt engineering & benchmarking',
        ],
      },
      {
        title: 'Document AI & Retrieval',
        items: [
          'Azure AI Document Intelligence',
          'OCR pipelines (PaddleOCR, docTR)',
          'PyMuPDF',
          'YOLO layout detection',
          'scispaCy clinical NER',
          'RAG (Chroma · pgvector · FAISS)',
          'Knowledge graphs & ontologies',
        ],
      },
      {
        title: 'Evaluation, Security & Observability',
        items: [
          'Evals vs reviewer corrections',
          'Golden-set gates & regression suites',
          'Prompt-injection tests',
          'Entra ID · JWT · RBAC',
          'PHI controls',
          'Azure Monitor · App Insights',
        ],
      },
      {
        title: 'Engineering & Cloud',
        items: [
          'Python · FastAPI · Pydantic',
          'PostgreSQL · SQLAlchemy',
          'React · TypeScript',
          'Azure (Gov cloud, App Service, Functions)',
          'Docker',
          'Azure DevOps · GitHub Actions',
          'Enterprise Linux',
        ],
      },
      {
        title: 'Healthcare Domain',
        items: [
          'CMS prior authorization',
          'Medicare claims (Part B)',
          'HETS · PECOS · NPPES · UPIC',
          'esMD · ADR',
          'ICD-10 · CPT · HCPCS',
          'FHIR R4 · HIPAA',
        ],
      },
    ],
  },

  experience: {
    heading: "Where I've *built*.",
    roles: [
      {
        period: 'Jun 2025 — Present',
        title: 'AI Engineer',
        company: 'Genzeon',
        location: 'Exton, PA',
        summary:
          "WISeR, Genzeon's Medicare prior-authorization platform on Azure Government: document intelligence, validations and agentic decisioning under CMS compliance.",
        bullets: [
          'Built the LLM document pipeline for Medicare prior-authorization coversheets (Azure AI Document Intelligence + Claude Sonnet, Claude Vision fallback, confidence-gated reprocessing, field-level provenance): 99% field-extraction accuracy.',
          'Measured it against 28,038 reviewer corrections on 4,609 production coversheets: 89.4% reviewer acceptance for the Claude fallback, and 42% of model-call cost identified as avoidable.',
          'Extended the LangGraph prior-auth screening agent with parallel HETS, PECOS/NPPES, UPIC, duplicate and CPT/ICD-10 validations and deterministic decision guardrails, then shadow-deployed V1 against V2 on 4,000 requests before promoting the winner to production.',
          'Designed Medicare claims workflows as LangGraph state machines: UPIC screening, Part B N/A classification, human-in-the-loop review and esMD ADR response mapping.',
          'Owned the platform around the agents: Entra ID roles with PHI hidden from read-only users across 15 API routers, Dev/UAT/Prod environments on on-premises Enterprise Linux, and open-source LLM benchmarks (Qwen, Llama) against frontier models.',
        ],
      },
      {
        period: 'May 2020 — Jul 2022',
        title: 'Web Application Developer',
        company: 'ED & IMMIGO',
        location: 'Hyderabad, India',
        summary: null,
        bullets: [
          'Delivered about 10 production web applications end to end for a study-abroad consultancy: student portals, services portals and marketing sites.',
          'Built React and Angular front ends over Python back ends (Django, Flask, FastAPI) with REST APIs and PostgreSQL.',
          'Deployed and maintained everything on enterprise Linux behind Nginx, owning production debugging and post-launch change requests directly with clients.',
        ],
      },
    ],
  },

  education: [
    {
      period: 'Aug 2023 — Dec 2024',
      degree: 'M.S. in Computer Technology',
      school: 'Eastern Illinois University · Charleston, IL',
      note: 'GPA 3.7. Applied computing and AI systems.',
    },
    // TODO: add bachelor's degree here (period, degree, school, note).
  ],

  projects: {
    heading: "Things I've *shipped*.",
    sub: 'Selected personal work. Work projects live in the experience section above.',
    items: [
      {
        title: 'DocsGroundTruth',
        description:
          'A production-style RAG system for healthcare policy documents that runs entirely on a laptop: Ollama (Qwen3 4B + nomic-embed-text), hybrid BM25 + vector retrieval, cited answers and an evaluation harness.',
        tags: ['RAG', 'Local LLMs', 'Ollama', 'Evals', 'Python'],
        href: 'https://github.com/Vijay021212', // TODO: point at the repo once it is pushed
        status: 'In progress',
      },
      {
        title: 'Local LLM Lab',
        description:
          'Running open-source models on CPU and measuring what matters: thinking vs instruct variants, quantization trade-offs, tokens per second, and when a 4B model is enough.',
        tags: ['Qwen3', 'Ollama', 'Benchmarking'],
        href: 'https://github.com/Vijay021212',
        status: null,
      },
    ],
    // One quiet line under the cards instead of a card for the site itself.
    footnote: { text: 'Also: this site is open source.', linkText: 'repo →', href: 'https://github.com/Vijay021212/portfolio' },
  },

  achievements: {
    heading: '*Receipts*.',
    // Big-number tiles: the number is the point, the label says what it counts (sentence case, short).
    stats: [
      { value: '99%', label: 'Field-extraction accuracy on prior-auth coversheets' },
      { value: '28,038', label: 'Reviewer corrections used to evaluate the AI' },
      { value: '42%', label: 'Of model-call cost found avoidable' },
      { value: '4,000', label: 'Requests in the V1 vs V2 shadow deployment' },
    ],
    recognitionTitle: 'Certifications & recognition',
    recognition: [
      'Claude Certified Architect — Foundations',
      'Microsoft Certified: Azure Fundamentals',
      'Microsoft Foundry partnership hackathon — shipped agents to AI Foundry',
    ],
  },

  contact: {
    heading: "Let's *build* something.",
    resume: { label: 'Download my resume', href: '/Vijay-Bolle-Resume.pdf' }, // file lives in public/
  },

  footer: {
    built: 'Built with React · Three.js · Motion',
  },
}
