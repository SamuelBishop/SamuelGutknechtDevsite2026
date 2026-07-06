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

export const skills = [
  'React',
  'TypeScript',
  'JavaScript',
  'C#',
  'Java',
  'Python',
  'Node.js',
  'SQL',
  'Azure',
  'CI/CD',
  'Git',
  'LLM & prompt engineering',
  'RAG & vector search',
  'Semantic Kernel',
  'LangChain',
  'Agent evaluations',
]

