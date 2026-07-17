import { SectionIntro } from '../components/SectionIntro'
import { skills } from '../content/siteContent'

type CompanyMarkProps = {
  company: 'microsoft' | 'garmin'
}

function CompanyMark({ company }: CompanyMarkProps) {
  if (company === 'microsoft') {
    return (
      <span className="company-mark" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="M2 2h9v9H2zM13 2h9v9h-9zM2 13h9v9H2zM13 13h9v9h-9z" />
        </svg>
      </span>
    )
  }

  return (
    <span className="company-mark" aria-hidden="true">
      <svg viewBox="0 0 24 24">
        <path d="M12 3 2.5 20.5h19L12 3Zm0 6.2 4.1 7.5H7.9L12 9.2Z" />
      </svg>
    </span>
  )
}

export function ResumePage() {
  return (
    <div className="section-shell page-stack resume-page">
      <SectionIntro eyebrow="Resume" title="Experience at a glance.">
        <p>
          Senior software engineer at Microsoft building customer experience
          platforms and agentic service experiences. Front-end and product
          engineering are core strengths, backed by full-stack, cloud, and
          reliability work.
        </p>
      </SectionIntro>

      <section className="resume-section" aria-labelledby="experience-heading">
        <p className="eyebrow">Experience</p>
        <div className="resume-row">
          <h2 id="experience-heading" className="company-heading">
            <CompanyMark company="microsoft" />
            Microsoft
          </h2>
          <div>
            <h3>Senior Software Engineer</h3>
            <p>
              Product engineering for customer experience platforms spanning
              complex enterprise interfaces, rich-text editing, AI-assisted
              service experiences, and agent workflows. The work combines React
              and TypeScript front-end architecture with backend, cloud,
              diagnostics, and reliability engineering.
            </p>
          </div>
        </div>
        <div className="resume-row">
          <h2 className="company-heading">
            <CompanyMark company="garmin" />
            Garmin
          </h2>
          <div>
            <h3>Software Engineering Intern</h3>
            <p>
              Developed avionics interface software for the Garmin G3000
              integrated flight deck using C, C++, and Python. Built and
              validated interactive graphical widgets defined by the ARINC 661
              specification, including C and C++ interface work with TinyGL.
            </p>
          </div>
        </div>
      </section>

      <section className="resume-section" aria-labelledby="skills-heading">
        <p className="eyebrow">Skills & focus</p>
        <div className="resume-row">
          <h2 id="skills-heading">Tools change. Judgment travels.</h2>
          <ul className="skills-list">
            {skills.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="resume-section" aria-labelledby="education-heading">
        <p className="eyebrow">Education</p>
        <div className="resume-row">
          <h2 id="education-heading">University of Missouri</h2>
          <div>
            <h3>B.S. Electrical and Computer Engineering</h3>
            <p>2017–2021 · Graduated cum laude</p>
            <p>Minors in Computer Science, Mathematics, and Spanish</p>
            <p>
              Selected coursework in neural models and machine learning,
              real-time embedded computing, computer architecture, database
              applications, and software design in C/C++.
            </p>
            <p>
              Additional recognition includes Dean&apos;s List High Honors, the
              Bright Flight Scholarship, and the MU Excellence Award.
            </p>
          </div>
        </div>
      </section>

      <aside className="resume-note">
        <p className="eyebrow">PDF resume</p>
        <p>
          A downloadable resume will be added once the current file is ready.
        </p>
      </aside>
    </div>
  )
}
