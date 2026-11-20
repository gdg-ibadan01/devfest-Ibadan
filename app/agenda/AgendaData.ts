// ─── Plenary / Main-Hall row ───────────────────────────────────────────────
export type AgendaItem = {
  time: string;
  schedule: string;
  speaker?: string;
  room: string;
  duration: string;
  type: 'plenary' | 'session' | 'workshop' | 'lightning' | 'vibe' | 'break';
  highlight?: boolean;
  notes?: string;
};

// ─── Hall session unit (shared by all breakout types) ────────────────────────
export type HallSession = {
  schedule: string;
  speaker?: string;
  track?: string;
  type: 'session' | 'workshop' | 'lightning' | 'vibe';
};

// ─── Hall 1 & 2 — same 25m/10m rhythm ────────────────────────────────────────
export type SpeakerHallRow = {
  time: string;
  duration: string;
  hallOne?: HallSession;
  hallTwo?: HallSession;
};

// ─── Hall 3 & 4 — independent rhythm, one event per row ─────────────────────
export type SingleHallRow = {
  time: string;
  duration: string;
  session: HallSession;
};

// ─────────────────────────────────────────────────────────────────────────────
// DAY 1 — DEVFEST IBADAN 2026 (Saturday, 29 Nov 2026)
// ─────────────────────────────────────────────────────────────────────────────

export const day1PlenaryData: AgendaItem[] = [
  {
    time: '8:30 AM - 9:30 AM',
    schedule: 'Registration and Arrival',
    room: 'ALL HALLS',
    duration: '60m',
    type: 'break',
    highlight: true,
  },
  {
    time: '9:35 AM - 9:45 AM',
    schedule: "Introduction — Organizer's Speech",
    room: 'MAIN HALL',
    duration: '10m',
    type: 'plenary',
    highlight: true,
  },
  {
    time: '9:45 AM - 10:05 AM',
    schedule:
      'Keynote — Building the Future: How AI and Digital Innovation Can Transform Governance and Society',
    speaker: 'Speaker: S.A. Communications to the Oyo State Governor',
    room: 'MAIN HALL',
    duration: '20m',
    type: 'plenary',
    highlight: true,
  },
  {
    time: '10:05 AM - 10:10 AM',
    schedule: 'Games / Giveaway',
    notes: 'Sponsored by Trade Stack',
    room: 'MAIN HALL',
    duration: '5m',
    type: 'break',
    highlight: false,
  },
  {
    time: '10:10 AM - 10:55 AM',
    schedule: 'Panel Session (Founders)',
    speaker: 'Host: Damilola David',
    room: 'MAIN HALL',
    duration: '45m',
    type: 'plenary',
    highlight: true,
  },
  {
    time: '11:00 AM - 11:10 AM',
    schedule: 'Sponsor Slot — Chowdeck',
    room: 'MAIN HALL',
    duration: '10m',
    type: 'break',
    highlight: false,
  },
  {
    time: '11:15 AM - 11:35 AM',
    schedule:
      'Keynote II — Built to Last: A Future Proof Tech Career in the Age of AI',
    speaker: 'Speaker: Co-Founder & CEO of Bral AI, Menaget, STECS and AITI',
    room: 'MAIN HALL',
    duration: '20m',
    type: 'plenary',
    highlight: true,
  },
  {
    time: '11:40 AM - 11:50 AM',
    schedule: 'Sponsor Slot — NotZero',
    room: 'MAIN HALL',
    duration: '10m',
    type: 'break',
    highlight: false,
  },
  {
    time: '11:55 AM - 12:20 PM',
    schedule: 'Session',
    speaker: 'Speaker: Geek Tutor',
    room: 'MAIN HALL',
    duration: '25m',
    type: 'session',
    highlight: false,
  },
  {
    time: '12:25 PM - 12:35 PM',
    schedule: 'Sponsor Slot — ALAT',
    room: 'MAIN HALL',
    duration: '10m',
    type: 'break',
    highlight: false,
  },
  {
    time: '12:40 PM - 12:45 PM',
    schedule: 'Games / Giveaway',
    notes: 'Sponsored by Practicode',
    room: 'MAIN HALL',
    duration: '5m',
    type: 'break',
    highlight: false,
  },
  {
    time: '12:50 PM - 1:00 PM',
    schedule: 'Announcement of Vibe Lounge, Schedule & Transfer Between Halls',
    room: 'ALL HALLS',
    duration: '10m',
    type: 'break',
    highlight: true,
  },
  {
    time: '1:00 PM - 1:30 PM',
    schedule: 'Group Pictures & Booth Visits',
    notes: 'Includes checking out sponsor booths',
    room: 'MAIN HALL',
    duration: '30m',
    type: 'break',
    highlight: true,
  },
];

// ─── Hall 1 & 2 — Speaker Sessions + Lightning Talks ─────────────────────────
export const day1SpeakerHallsData: SpeakerHallRow[] = [
  {
    time: '1:30 PM - 1:55 PM',
    duration: '25m',
    hallOne: {
      schedule:
        'Building the Next Generation of Web3 Applications with AI Agents',
      speaker: 'Abdulmujeeb Sulayman',
      track: 'Web Development · Blockchain',
      type: 'session',
    },
    hallTwo: {
      schedule: 'Building Distributed Systems with gRPC',
      speaker: 'Adeshina Lasisi',
      track: 'Mobile · Web · Cloud Engineering',
      type: 'session',
    },
  },
  {
    time: '2:00 PM - 2:10 PM',
    duration: '10m',
    hallOne: {
      schedule:
        'Data Has Consequences: Engineering for Privacy, Ethics, and Trust',
      speaker: 'Chelsea Adetan',
      track: 'Data',
      type: 'lightning',
    },
    hallTwo: {
      schedule: 'Quantum Technology: Hype or Real?',
      speaker: 'Ahmad Abdulmajeed',
      type: 'lightning',
    },
  },
  {
    time: '2:15 PM - 2:40 PM',
    duration: '25m',
    hallOne: {
      schedule:
        'Multimodal Flutter: Apps That See, Hear, and Reason Across Platforms',
      speaker: 'David Oluwabusayo',
      track: 'Mobile · Web · Desktop',
      type: 'session',
    },
    hallTwo: {
      schedule:
        'Architecting the Future: Building Highly Scalable Digital Platforms for Africa',
      speaker: 'Opeyemi Ojeyinka',
      track: 'Mobile · Web · Cloud · Cybersecurity · Product · QA',
      type: 'session',
    },
  },
  {
    time: '2:45 PM - 2:55 PM',
    duration: '10m',
    hallOne: {
      schedule:
        'How Developers Can Thrive in the Agentic AI Era: Skills, Workflows & Mindset',
      speaker: 'Ifeoluwa Obayemi',
      track: 'Artificial Intelligence / AI',
      type: 'lightning',
    },
    hallTwo: {
      schedule:
        'AI Didn\u2019t Take My Job \u2014 It Changed It: A Frontend Engineer\u2019s Evolution',
      speaker: 'James Uyi',
      track: 'Mobile · Web · Product',
      type: 'lightning',
    },
  },
  {
    time: '3:00 PM - 3:25 PM',
    duration: '25m',
    hallOne: {
      schedule:
        "Beyond the Form: Why Data Privacy is the Missing Layer in Nigeria's Tech Stack",
      speaker: 'Ireoluwatomiwa Omotayo',
      track: 'Cybersecurity',
      type: 'session',
    },
    hallTwo: {
      schedule: 'Building Customer-Centric Products: The Engineering Mindset',
      speaker: 'Muritadoh Sodeeq',
      track: 'Mobile · Web · Product',
      type: 'session',
    },
  },
  {
    time: '3:30 PM - 3:40 PM',
    duration: '10m',
    hallOne: {
      schedule:
        'From Wireframes to Scaffolding: What Design Becomes When AI Builds',
      speaker: 'Mary Esivue',
      track: 'Product',
      type: 'lightning',
    },
    hallTwo: {
      schedule:
        'Debugging Burnout: Mental Wellness as a Developer\u2019s Core Stack',
      speaker: 'Oluwatobi Oyesola',
      track: 'Mental Wellness',
      type: 'lightning',
    },
  },
  {
    time: '3:45 PM - 4:10 PM',
    duration: '25m',
    hallOne: {
      schedule:
        'Your Gemini Key Is in the APK: Securing AI Features in Flutter',
      speaker: 'Idris Idris',
      track: 'Mobile · Cybersecurity',
      type: 'session',
    },
    hallTwo: {
      schedule:
        'The Hidden Engineering of LLM Inference: A Deep Dive into Nano-vLLM',
      speaker: 'Praise Adegoju',
      track: 'AI/ML',
      type: 'session',
    },
  },
  {
    time: '4:15 PM - 4:25 PM',
    duration: '10m',
    hallOne: {
      schedule: 'Beyond the Code: Branding \u2013 The Invisible Resume',
      speaker: 'Oreoluwa Osadugba',
      track: 'Branding',
      type: 'lightning',
    },
    hallTwo: {
      schedule: 'Animating with Intent: Motion Design for Developers',
      speaker: 'Victor Williams',
      track: 'Web Development',
      type: 'session',
    },
  },
  {
    time: '4:30 PM - 4:55 PM',
    duration: '25m',
    hallOne: {
      schedule: 'AI as a Product Designer\u2019s Superpower',
      speaker: 'Temiloluwa Kayode',
      track: 'Product',
      type: 'session',
    },
  },
];

// ─── Hall 3 — Workshops (45m each) ───────────────────────────────────────────
export const day1WorkshopsData: SingleHallRow[] = [
  {
    time: '1:30 PM - 1:55 PM',
    duration: '25m',
    session: {
      schedule: 'Inside ALATPay: Exploring Our Payment Ecosystem',
      speaker: 'Joy Offiong',
      type: 'workshop',
    },
  },
  {
    time: '2:00 PM - 2:45 PM',
    duration: '45m',
    session: {
      schedule:
        'Building Production Multi-Agent AI Systems with PyTorch: State Graphs, Tensor-Based Routing & Tool-Calling Optimization',
      speaker: 'Israel Odeajo',
      track: 'AI / Machine Learning',
      type: 'workshop',
    },
  },
  {
    time: '2:50 PM - 3:35 PM',
    duration: '45m',
    session: {
      schedule:
        'Supercharge Code Quality: AI-Assisted Code Review with Antigravity CLI and SDK',
      speaker: 'Ahmed Olanrewaju',
      track: 'Web Development · Cloud Engineering · Cybersecurity',
      type: 'workshop',
    },
  },
  {
    time: '3:40 PM - 4:25 PM',
    duration: '45m',
    session: {
      schedule:
        'Build and Deploy a RAG AI Agent in Streamlit using Google ADK and Cloud Run',
      speaker: 'Shadrack Inusah',
      track: 'Cloud Engineering · Product',
      type: 'workshop',
    },
  },
];

// ─── Hall 4 — Vibe Lounge (60m each) ─────────────────────────────────────────
export const day1VibeData: SingleHallRow[] = [
  {
    time: '1:30 PM - 2:30 PM',
    duration: '60m',
    session: {
      schedule: 'Vibe Lounge',
      speaker: 'Jesutoni Aderibigbe',
      type: 'vibe',
    },
  },
  {
    time: '2:35 PM - 3:35 PM',
    duration: '60m',
    session: {
      schedule: 'Vibe Lounge',
      speaker: 'Abidemi Tiamiyu',
      type: 'vibe',
    },
  },
  {
    time: '3:40 PM - 4:40 PM',
    duration: '60m',
    session: {
      schedule: 'Vibe Lounge',
      speaker: 'Olajide Joshua',
      type: 'vibe',
    },
  },
  {
    time: '4:45 PM - 4:55 PM',
    duration: '10m',
    session: {
      schedule: 'Networking',
      type: 'vibe',
    },
  },
];

export const day1ClosingData: AgendaItem[] = [
  {
    time: '5:00 PM - 5:15 PM',
    schedule: 'Project Showcase',
    room: 'MAIN HALL',
    duration: '15m',
    type: 'plenary',
    highlight: true,
  },
  {
    time: '5:15 PM - 5:30 PM',
    schedule: 'Games, Gifts and Vote of Thanks',
    room: 'MAIN HALL',
    duration: '15m',
    type: 'break',
    highlight: true,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Legacy type — Day 2 (AgendaTable) backward compatibility
// ─────────────────────────────────────────────────────────────────────────────
export type AgendaItemLegacy = {
  time: string;
  felicia?: string;
  banquet?: string;
  functions?: string;
  duration: string;
  highlight?: boolean;
};

/** Day 2 data — to be populated when confirmed */
export const agendaData: AgendaItemLegacy[] = [];
