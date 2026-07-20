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
}

export const workItems: WorkItem[] = [
  {
    title: 'Modern Rich Text Editor Experience',
    kind: 'Front-end',
    context:
      'A modernization of the rich text editing surface for a large model-driven app platform, built on CKEditor 5.',
    contribution:
      'The work rested on web fundamentals — semantic HTML, CSS layout, and vanilla JavaScript — beneath a Model–View–Controller renderer that keeps the editing model and the live DOM in sync. Targeted DOM manipulation and lazy-loaded editor plugins keep the toolbar fast, with AI-assisted authoring enabled directly in the editing flow.',
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
  {
    title: 'AI-Powered Service Experiences',
    kind: 'AI UX',
    context:
      'AI-assisted experiences intended to help customer-service users work more effectively.',
    contribution:
      'A public account of the product and engineering work is in development, with care taken around customer and product confidentiality.',
    focusAreas: [
      'Product engineering',
      'AI UX',
      'Enterprise UI',
      'Reliability',
    ],
  },
  {
    title: 'Conversation Control / Agent Experience',
    kind: 'Agent UX',
    context:
      'Interfaces for managing conversations and agent workflows in a demanding service environment.',
    contribution:
      'Details about the interface complexity and engineering contribution are being reviewed for public presentation.',
    focusAreas: ['Complex state', 'Workflow design', 'React', 'TypeScript'],
  },
  {
    title: 'Developer, Support, and Reliability Work',
    kind: 'Reliability',
    context:
      'Tools and improvements that make complex systems easier to diagnose, support, and operate.',
    contribution:
      'A concrete, non-confidential example will be added when it can be represented accurately.',
    focusAreas: [
      'Diagnostics',
      'Maintainability',
      'Observability',
      'Reliability',
    ],
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
  { platform: 'github', label: 'GitHub', href: '#' },
  { platform: 'linkedin', label: 'LinkedIn', href: '#' },
  { platform: 'instagram', label: 'Instagram', href: '#' },
  { platform: 'substack', label: 'Substack', href: '#' },
  { platform: 'strava', label: 'Strava', href: '#' },
  { platform: 'email', label: 'Email', href: 'mailto:hello@example.com' },
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
