# Sitemap

## Primary navigation

Keep the main navigation consistent and limited to: Home, About, Work, Projects, and Resume.

| Page     | Route       | Purpose                                                                                                        | Main sections                                                                                                            |
| -------- | ----------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Home     | `/`         | Introduce Samuel, establish his focus, and guide visitors toward the most important work and personal context. | Hero introduction; current focus; selected work preview; personal note; featured project preview; contact call to action |
| About    | `/about`    | Share a concise career narrative and the person beyond the work.                                               | Short biography; engineering values; career overview; interests and life outside work; current learning or exploration   |
| Work     | `/work`     | Present a curated set of professional work and responsibilities without becoming a complete resume.            | Work introduction; selected work cards; individual work narratives; confidentiality note where appropriate               |
| Projects | `/projects` | Show selected side projects, experiments, and hands-on interests.                                              | Projects introduction; project cards; optional in-progress section                                                       |
| Resume   | `/resume`   | Provide a scannable professional history and a downloadable resume.                                            | Summary; experience; skills/focus areas; education; resume download; contact link                                        |

## Page content boundaries

- Home previews content; it does not repeat every detail from other pages.
- About emphasizes story, values, and personality rather than job-by-job history.
- Work contains only selected professional stories that can be discussed publicly.
- Projects is reserved for personal work, experiments, and builds.
- Resume is the most complete and structured career reference.

## Shared components

- **Header:** Name or personal mark, primary navigation, and accessible mobile navigation.
- **Footer:** Brief sign-off, contact and social links, copyright, and optional location/time-zone note.
- **Work card:** Title, short context, contribution summary, focus-area labels, and link to more detail if available.
- **Project card:** Project name, concise description, status, relevant labels, and optional repository/demo link.
- **Section introduction:** Heading and one short paragraph that frames the content.
- **Contact call to action:** A low-pressure invitation with a preferred contact link.
- **Resume download link:** Clearly labeled link to the current PDF resume.

## Optional detail pages

Add detail pages only when a work item or project has enough public material to support a useful narrative.

- `/work/[slug]` — selected work detail
- `/projects/[slug]` — side-project detail

<!-- TODO: Decide whether the initial release needs detail pages or whether cards are sufficient. -->
<!-- TODO: Confirm preferred public contact and social links. -->
