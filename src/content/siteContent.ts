export type WorkItem = {
  title: string
  kind: string
  context: string
  contribution: string
  focusAreas: string[]
  image?: {
    src: string
    alt: string
    objectPosition?: string
    fit?: 'cover' | 'contain'
  }
  video?: {
    src: string
    poster: string
    title: string
  }
  links?: {
    label: string
    href: string
  }[]
}

export const workItems: WorkItem[] = [
  {
    title: 'M365 Copilot, Service Agent',
    kind: 'AI UX',
    context:
      'Service Agent, a declarative agent inside Microsoft 365 Copilot for Dynamics 365 Customer Service, bringing its customer-service workflows into the Copilot surface teams already use.',
    contribution:
      "Under the hood it orchestrates MCP tools to understand cases, retrieve knowledge, and take in-app actions, with custom interactive UI surfaces built on OpenAI's Apps SDK. The experience unifies Dynamics 365 and Microsoft 365 data so representatives keep context across Teams, Outlook, and Dynamics.",
    focusAreas: [
      'M365 Copilot',
      'Declarative agents',
      'MCP tools',
      'OpenAI Apps SDK',
    ],
    video: {
      src: '/videos/service-agent-launch.mp4',
      poster: '/videos/service-agent-launch-poster.jpg',
      title:
        'Service Agent launch video: customer service inside Microsoft 365 Copilot.',
    },
    links: [
      {
        label: 'Launch announcement by Rushil Vora',
        href: 'https://www.linkedin.com/posts/rushilvora_service-work-now-starts-in-microsoft-365-activity-7444848417861914625-W8RD',
      },
      {
        label: 'Customer service integration by Alan Ross',
        href: 'https://www.linkedin.com/posts/alandross_customer-service-professionals-now-get-the-share-7477786451431084033-N_8-',
      },
    ],
  },
  {
    title: 'Modern Rich Text Editor Experience',
    kind: 'Front-end',
    context:
      'A modernization of the rich text editing surface in use by millions on Dynamics 365, built on CKEditor 5. It handles composing notes, emails, and scheduling appointments, and can be extended for custom use cases.',
    contribution:
      'The work rested on web fundamentals: semantic HTML, CSS layout, and vanilla JavaScript, beneath a Model-View-Controller renderer that keeps the editing model and the live DOM in sync. Targeted DOM manipulation and lazy-loaded editor plugins keep the toolbar fast, with AI-assisted authoring enabled directly in the editing flow.',
    focusAreas: [
      'CKEditor 5',
      'MVC rendering',
      'DOM & performance',
      'AI-assisted authoring',
    ],
    image: {
      src: '/photos/rich-text-editor-demo.png',
      alt: 'A modern rich text editor with a full formatting toolbar above a document being edited, showing a heading, formatted paragraphs, a bulleted list, and a link.',
      objectPosition: 'top',
    },
  },
]

// Personal projects: side builds and experiments, shaped like WorkItem so they
// can share the carousel and the Personal Projects page.
export const projectItems: WorkItem[] = [
  {
    title: 'A mechanical keyboard with a hot-swappable numpad.',
    kind: 'Electronics project',
    context:
      'A mechanical keyboard whose numpad hot-swaps to the left or right side, built for accessibility and for faster, more efficient input.',
    contribution:
      'A full pass from schematic to working hardware: PCB design, soldering, and the microcontroller and firmware that bring it to life.',
    focusAreas: ['PCB design', 'Soldering', 'Firmware', 'Microcontroller'],
    image: {
      src: '/photos/hotswap-numpad-pcb.jpg',
      alt: 'A custom hot-swappable numpad keyboard PCB connected to a laptop',
    },
  },
]

export type SocialPlatform =
  'github' | 'linkedin' | 'instagram' | 'substack' | 'strava' | 'email'

export type SocialLink = {
  platform: SocialPlatform
  // Accessible label / visible name for the platform.
  label: string
  // TODO: replace these placeholders with real profile URLs before launch.
  href: string
}

export const socialLinks: SocialLink[] = [
  {
    platform: 'github',
    label: 'GitHub',
    href: 'https://github.com/SamuelBishop',
  },
  {
    platform: 'linkedin',
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/samuel-bishop-gutknecht-938212171/',
  },
  {
    platform: 'instagram',
    label: 'Instagram',
    href: 'https://www.instagram.com/sgutknecht15/',
  },
  {
    platform: 'substack',
    label: 'Substack',
    href: 'https://samgutknecht.substack.com',
  },
  {
    platform: 'strava',
    label: 'Strava',
    href: 'https://www.strava.com/athletes/23012268',
  },
  { platform: 'email', label: 'Email', href: 'mailto:samgutknecht@gmail.com' },
]

export const skills = [
  'AI agent development',
  'LLM & prompt engineering',
  'Context engineering',
  'RAG & vector search',
  'Neural networks & machine learning',
  'Agent evaluations',
  'GitHub Copilot',
  'Semantic Kernel',
  'LangChain',
  'TypeScript',
  'React',
  'C#',
  'Python',
  'JavaScript',
  'C++',
  'C',
  'Computer architecture',
  'Microprocessor systems',
  'Analog & digital circuit design',
  'VHDL & programmable logic',
  'Node.js',
  'SQL',
  'Java',
  'Azure',
  'CI/CD',
  'Git',
]
