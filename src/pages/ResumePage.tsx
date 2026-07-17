import { Download } from 'lucide-react'
import { SectionIntro } from '../components/SectionIntro'
import { skills } from '../content/siteContent'

type CompanyMarkProps = {
  company: 'microsoft' | 'garmin'
}

function CompanyMark({ company }: CompanyMarkProps) {
  if (company === 'microsoft') {
    return (
      <span className="company-mark company-mark--microsoft" aria-hidden="true">
        <svg viewBox="0 0 23 23">
          <path fill="#f35325" d="M1 1h10v10H1z" />
          <path fill="#81bc06" d="M12 1h10v10H12z" />
          <path fill="#05a6f0" d="M1 12h10v10H1z" />
          <path fill="#ffba08" d="M12 12h10v10H12z" />
        </svg>
      </span>
    )
  }

  return (
    <span className="company-mark company-mark--garmin" aria-hidden="true">
      <svg viewBox="19.65 8.55 2.8 2.7">
        <path d="M22.134 11.051h-2.165c-.079 0-.148-.039-.187-.108s-.039-.146 0-.215l1.084-1.874a.21.21 0 0 1 .187-.108.21.21 0 0 1 .187.108l1.084 1.874a.203.203 0 0 1 0 .215.22.22 0 0 1-.19.108z" />
      </svg>
    </span>
  )
}

export function ResumePage() {
  return (
    <div className="section-shell page-stack resume-page">
      <header className="resume-print-header">
        <h1>Samuel Gutknecht</h1>
        <p>Senior Software Engineer</p>
      </header>
      <SectionIntro eyebrow="Resume" title="Experience at a glance.">
        <p>
          Senior software engineer at Microsoft building customer experience
          platforms and agentic service experiences. Front-end and product
          engineering are core strengths, backed by full-stack, cloud, and
          reliability work.
        </p>
      </SectionIntro>

      <section className="resume-section" aria-labelledby="experience-heading">
        <div className="resume-section-heading">
          <p className="eyebrow">Experience</p>
          <a
            className="resume-download"
            href="/samuel-gutknecht-resume.pdf"
            download
            aria-label="Download resume PDF"
          >
            <Download aria-hidden="true" size={14} />
            Resume PDF
          </a>
        </div>
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
          <div className="education-details">
            <div className="education-degree">
              <h3>Bachelor of Science</h3>
              <p className="education-major">
                Electrical and Computer Engineering
              </p>
              <p className="education-meta">
                <span>2017–2021</span>
                <span>Graduated cum laude</span>
              </p>
            </div>
            <dl className="education-facts">
              <div>
                <dt>Minors</dt>
                <dd>Computer Science, Mathematics, and Spanish</dd>
              </div>
              <div>
                <dt>Technical foundation</dt>
                <dd>
                  Theory in computer systems, electronics, embedded computing,
                  and machine learning
                </dd>
              </div>
              <div>
                <dt>Recognition</dt>
                <dd>
                  Dean&apos;s List High Honors · Bright Flight Scholarship · MU
                  Excellence Award
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
    </div>
  )
}
