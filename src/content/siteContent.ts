export type WorkItem = {
  title: string
  kind: string
  context: string
  contribution: string
  focusAreas: string[]
  status: 'draft'
}

export const workItems: WorkItem[] = [
  {
    title: 'Modern Rich Text Editor Experience',
    kind: 'Front-end',
    context:
      'A modern editing experience within a complex product environment.',
    contribution:
      'A case study about front-end architecture, interaction details, and accessibility is being prepared for public sharing.',
    focusAreas: [
      'Front-end engineering',
      'React',
      'TypeScript',
      'Accessibility',
    ],
    status: 'draft',
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
    status: 'draft',
  },
  {
    title: 'Conversation Control / Agent Experience',
    kind: 'Agent UX',
    context:
      'Interfaces for managing conversations and agent workflows in a demanding service environment.',
    contribution:
      'Details about the interface complexity and engineering contribution are being reviewed for public presentation.',
    focusAreas: ['Complex state', 'Workflow design', 'React', 'TypeScript'],
    status: 'draft',
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
    status: 'draft',
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
