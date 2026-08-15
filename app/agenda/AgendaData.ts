export type AgendaItem = {
  time: string;
  felicia?: string;
  banquet?: string;
  functions?: string;
  duration: string;
  highlight?: boolean;
};

export const agendaData: AgendaItem[] = [
  {
    time: '8:30 am - 9:00 am',
    felicia: 'Registrations and arrival',
    banquet: '',
    functions: '',
    duration: '30 mins',
    highlight: true,
  },
  {
    time: '9:00 am - 9:15 am',
    felicia: 'Introduction/Opening Speech',
    banquet: '',
    functions: '',
    duration: '15 mins',
    highlight: true,
  },
  {
    time: '9:15 am - 9:40 am',
    felicia: `Keynote Speech 1 - The Evolution of Hello World: Reimagining Development for the AI Era <br/><br/>
              <i><b>Sodiq Akinjobi</b>, Developer Ecosystem Community Manager & President of the NBU<i/>
`,
    banquet: '',
    functions: '',
    duration: '25 mins',
    highlight: true,
  },
  {
    time: '9:40 am - 9:50 am',
    felicia: 'Games',
    banquet: '',
    functions: '',
    duration: '10 mins',
    highlight: true,
  },
  {
    time: '9:55 am - 10:20 am',
    felicia: `
    Keynote Speech 2 - Securing the Digital Citizen: Government's Strategy for Safe, Scalable AI and Cloud Adoption.<br/><br/>

    <i><b>Adebayo Akande</b>, Senior Special Assistant on ICT & E-Governance to the Executive Governor at Oyo State Government</i>`,
    banquet: '',
    functions: '',
    duration: '25 mins',
    highlight: true,
  },
  {
    time: '10:20 am - 10:30 am',
    felicia: 'Transfer Between Halls',
    banquet: '',
    functions: '',
    duration: '10 mins',
    highlight: true,
  },
  {
    time: '10:35 am - 11:00 am',
    felicia: `
    Speaker Session 1 - Designing Lightweight Data Pipelines on GCP. <br/><br/>

    <i><b>Triumph Ogeh</b>,<br/> Data Analyst & Engineer</i>

`,
    banquet: `Speaker Session 2 - Beyond Code: The Open Source Hardware Movement. <br/><br/>

             <i><b>Dara Obademi</b>,<br/> Open-Source Hardware Association (OSHWA)- Community Coordinator</i>


    `,
    functions: `Speaker Session 3 - The Cold Start Problem: Optimizing Cloud Functions for Frontend Responsiveness <br/><br/>

                <i><b>Taiwo Famakinde</b>,<br/> Software Engineer</i>
    `,
    duration: '25 mins',
  },
  {
    time: '11:05 am - 11:30 am',
    felicia: `Speaker Session 4 - Taming Flaky Tests: From Headaches to Confidence <br/><br/>

              <i><b>Uchenna Nnamadim</b>,<br/> Senior QA Engineer, MedMe Health</i>


    `,
    banquet: `Speaker Session 5 - Passkeys: A Paradigm Shift in Security <br/><br/>

              <i><b>Emmanuel Omidiora</b>, <br/>Source Micro-Finance Bank ,Senior Mobile Developer</i>
    `,
    functions: `Speaker Session 6 - Annotation, Open Source, and Cybersecurity: Building Secure and Trustworthy AI <br/><br/>

                <i><b>Magaret Ekerendu</b>,<br/> Data Annotator/ Co-Founder, CreAIte</i>
    `,
    duration: '25 mins',
  },
  {
    time: '11:35 am - 12:00 pm',
    felicia: `Speaker Session 7 - Gemini in Firebase Studio; Your AI coding assistant <br/><br/>

              <i><b>Joshua Olajide</b>,<br/> Software Engineer</i>
    `,
    banquet: `Speaker Session 8 - Building Autonomous AI SEO Systems: Automation & Programmatic Pages <br/><br/>

              <i><b>Adams Paul</b>,<br/> Engineering Manager, Selar</i>
    `,
    functions: `Speaker Session 9 - Bringing Gemini to the Browser: Real-World Use Cases in Web Apps <br/><br/>

                <i><b>Ayantunji Timilehin</b>,<br/> Senior software engineer</i>
    `,
    duration: '25 mins',
  },
  {
    time: '12:00 pm - 12:10 pm',
    felicia: 'Games and Giveaway',
    banquet: '',
    functions: '',
    duration: '10 mins',
    highlight: true,
  },
  {
    time: '12:10 pm - 12:20 pm',
    felicia: 'Sponsor Slot - NotZero Hub',
    banquet: '',
    functions: '',
    duration: '10 mins',
    highlight: true,
  },
  {
    time: '12:25 pm - 12:50 pm',
    felicia: `Speaker Session 10 - Cracking the Mobile Code Signing Puzzle <br/><br/>

              <i><b>Damilola Alimi</b>,<br/> Developer Support Engineer at Codemagic</i>
    `,
    banquet: `Speaker Session 11 - Build a Speech Game with the Web Speech API <br/><br/>

              <i><b>Dominic Orim</b>,<br/> Software Engineer at Zedi Inc</i>
    `,
    functions: `Speaker Session 12 - Building AI-Native Cloud Applications with Vector Databases and Embeddings on GCP <br/><br/>

                <i><b>Chukwuemeka Chukwurah</b>,<br/> Senior Software Engineer, Rocksteady Technologies</i>
    `,
    duration: '25 mins',
  },
  {
    time: '12:55 pm - 01:20 pm',
    felicia: `Speaker Session 13 - The AI Operating System: An Introduction to the Vertex AI Platform <br/><br/>
             <i><b> John O. Emmanuel</b>,<br/> Software and AI Engineer</i>
    `,
    banquet: `Workshop 1 - Use an ADK Agent on Cloud Run with an MCP Server <br/><br/>
              <i><b>Mileke Kolawole</b>,<br/> Cloud Engineer</i>
    `,
    functions: `Workshop 2 - Design system that scale: From token to components <br/><br/>
                <i><b>Gideon Ogunkola</b>,<br/> Lead UX Designer & Strategist, Globus Bank</i>
    `,
    duration: '25 mins',
  },
  {
    time: '01:25 pm - 01:50 pm',
    felicia: `Speaker Session 14 - Shadow AI & Cybersecurity: Behind the Scenes, Beyond our control. <br/><br/>

              <i><b>Adefunke Bolatito</b>,<br/> Information Security Consultant, Nethost Limited</i>
    `,
    banquet: '',
    functions: '',
    duration: '25 mins',
    highlight: true,
  },
  {
    time: '01:50 pm - 02:00 pm',
    felicia: 'Games and Giveaway',
    banquet: '',
    functions: '',
    duration: '10 mins',
    highlight: true,
  },
  {
    time: '02:00 pm - 02:05 pm',
    felicia: 'Sponsor Slot - AgentPesa',
    banquet: '',
    functions: '',
    duration: '5 mins',
    highlight: true,
  },
  {
    time: '02:10 pm - 02:20 pm',
    felicia: `Lightening Talk 1 - The Confidence Code: How to Stop Doubting Your Skills and Start Building Bold Projects <br/><br/>

              <i><b>Samuel Femi</b>,<br/> Founder of Gupta</i>
    `,
    banquet: `Lightening Talk 2 - Frontend Engineering in the Age of Intelligent Interfaces <br/><br/>

             <i><b> Mary Ojo</b>,<br/> Software Engineer (Frontend)</i>
    `,
    functions: `Lightening Talk 3 - “Oga Talk and Do” : Fine-Tuning AI to Solve Real Business Problems <br/><br/>

                <i><b>Fehintoluwa Dahunsi</b>,<br/> Senior Software Engineer, Andela, Professional Cloud Architect, GCP</i>
    `,
    duration: '10 mins',
  },
  {
    time: '02:25 pm - 02:35 pm',
    felicia: `Lightening Talk 4 - From Lagos to the World: Building Scalable AI Systems that Deliver Real Impact <br/><br/>
              <i><b>Abdul-Malik Adebayo</b>,<br/> AI & Backend Engineer, BRDGE(UK)</i>
    `,
    banquet: `Lightening Talk 5 - Delivering video on demand streams with FFMpeg <br/><br/>
              <i><b>Tunmise Akinade</b>,<br/> Senior Full-Stack Engineer, Upmetrics</i>
    `,
    functions: `Lightening Talk 6 - Decoding the new tax laws in Nigeria. <br/><br/>
                <i><b>Orire Agbaje</b>,<br/> Tax Analyst</i>
    `,
    duration: '10 mins',
  },
  {
    time: '02:35 pm - 02:45 pm',
    felicia: `Lightening Talk 7 - The hardware race: How the Nigerian tech ecosystem can start building with hardware in mind. <br/><br/>
              <i><b>Folaranmi Jesutofunmi</b>,<br/> Founder, Low Budget Engineers</i>
    `,
    banquet: `Lightening Talk 8 - Holistic Health <br/><br/>
              <i><b>Ayomide Akindeyin</b>,<br/> Register Nurse, Register Midwife</i>
    `,
    functions: `Lightening Talk 9 - From Data to Intelligence: How Smarter Annotation Scales AI <br/><br/>
                <i><b>Blessing Akanle</b>,<br/> Data Annotator/AI Ethicist</i>
    `,
    duration: '10 mins',
  },
  {
    time: '02:45 pm – 3:15 pm',
    felicia: 'Networking, Visit to the Booths, Pictures, and Item 7',
    banquet: '',
    functions: '',
    duration: '30 mins',
    highlight: true,
  },
  {
    time: '03:20 pm - 03:30 pm',
    felicia: 'Games and Giveaway',
    banquet: '',
    functions: '',
    duration: '10 mins',
    highlight: true,
  },
  {
    time: '03:35 pm – 04:20 pm',
    felicia: `Panel Session - Building for Resilience: Surviving Market Uncertainty and Economic Downturns. <br/><br/>
              <b>Titilope Laniran</b> (Moderator) <br/>
              <b>Sodiq Ogunyeiwa</b>, Software Product Engineer and Founder of Notzero Innovation Hub <br/>
              <b>Ibrahim Oredola</b>, ⁠ Co-Founder of SkillNG and Membersstack <br/>
              <b>Ivie Omas</b>, Managing Director, Etionary Properties <br/>
    `,
    banquet: '',
    functions: '',
    duration: '45 mins',
    highlight: true,
  },
  {
    time: '04:20 pm – 04:30 pm',
    felicia: "Organizer's Speech/Presenting the Organizing Team",
    banquet: '',
    functions: '',
    duration: '10 mins',
    highlight: true,
  },
  {
    time: '04:35 pm – 04:45 pm',
    felicia: 'Games and Gift Presentation',
    banquet: '',
    functions: '',
    duration: '10 mins',
    highlight: true,
  },
  {
    time: '04:50 pm - 5:00 pm',
    felicia: 'Vote of Thanks',
    banquet: '',
    functions: '',
    duration: '10 mins',
    highlight: true,
  },
];
