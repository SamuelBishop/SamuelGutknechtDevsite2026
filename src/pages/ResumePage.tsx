import { SectionIntro } from '../components/SectionIntro'
import { skills } from '../content/siteContent'

export function ResumePage() {
  return (
    <div className="section-shell page-stack resume-page">
      <SectionIntro eyebrow="Resume" title="Experience at a glance.">
        <p>
          Senior software engineer with front-end and product engineering as a
          core strength, now working as an action-oriented, AI-native generalist
          across the modern development stack.
        </p>
      </SectionIntro>

      <section className="resume-section" aria-labelledby="experience-heading">
        <p className="eyebrow">Experience</p>
        <div className="resume-row">
          <h2 id="experience-heading">Microsoft</h2>
          <div>
            <h3>Senior Software Engineer</h3>
            <p>
              Product engineering for complex enterprise interfaces, including
              rich-text editing, AI-assisted service experiences, agent
              workflows, and supporting reliability work.
            </p>
            <p className="pending-detail">
              Role dates and team details pending confirmation.
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
            <p>2017–2021 · Graduated with honors</p>
            <p>Minors in Mathematics and Computer Science</p>
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
