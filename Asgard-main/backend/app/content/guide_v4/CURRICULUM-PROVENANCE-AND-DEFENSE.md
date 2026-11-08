# Asgard — Curriculum Research, Provenance & Defense Dossier

**Document status:** Research and methodology documentation for Asgard Guide Content Pack v4.  
**Prepared:** 2026-11-02  
**Status:** Draft; pending expert and editorial review.  
**Purpose:** Explain where the roadmap ideas, educational topics and external resource links came from, and what can and cannot responsibly be claimed.

## Executive answer: Where did Asgard get its curriculum?

Asgard's career roadmaps are **original, editorially assembled beginner learning guides**. They are not a reproduction of any single university course, bootcamp or vendor syllabus. Career competencies are informed by published disciplinary and professional skills frameworks; topic explanation accuracy is supported by official documentation and educational guides; and learners are directed to third-party materials through links rather than copied lessons. The order, topic boundaries, mini-practices and completion checks are Asgard-specific editorial choices. No professional association has endorsed, accredited or approved these roadmaps.

## Three distinct layers of evidence

1. **What is important to learn?** Use broad competency references: ACM/IEEE-CS/AAAI CS2023 for computing knowledge areas, SFIA 9 for digital occupational skills, NIST NICE for cybersecurity work, and ABET academic criteria as contextual references. They help identify coverage; none is an Asgard-approved curriculum.
2. **How do beginners learn it?** Use established learning providers such as The Odin Project, freeCodeCamp, MDN, Google ML Crash Course, DataTalks.Club, Cisco, W3C WAI and domain-specific tutorials. Their courses provide learning opportunities but need not dictate Asgard's order.
3. **What does Asgard itself contribute?** An original beginner-oriented order of milestones and topics, concise guidance, short learning goals, linked lessons, small practice activities and learner self-checks. These are editorial decisions, not quotations or independent research results.

## Curriculum construction method

1. Describe each career in terms of typical tasks and a realistic beginner starter project.
2. Select essential skills, not every possible specialty; group them into milestones that produce an observable capability.
3. Order topics so necessary foundations precede application. Prerequisites are advisory and do not lock access.
4. For each topic, write a brief orientation, concepts to focus on, a simple goal, tools, a practical task and a self-check. Keep detailed instruction in linked external materials.
5. Locate specific free lessons where possible. Record provider, URL, subtopic coverage, login restrictions, hardware/cloud costs and copyright notices. Do not claim verification without evidence.
6. Run structural validation (IDs, cross-references, hierarchy) and editorial review (clarity, accuracy, adequacy of practice). Flag gaps. Obtain human subject-matter review before publication.

## Career-to-source rationale (research directions, not proof of topic-level alignment)

| Career | Competency basis | Candidate instructional sources |
|---|---|---|
| Frontend Developer | CS2023 software development, HCI; accessibility | The Odin Project, MDN, freeCodeCamp, W3C WAI |
| Machine Learning Engineer | CS2023 AI, math/statistics, data management | Google ML Crash Course, scikit-learn, PyTorch, Kaggle |
| UX Designer | HCI; SFIA design and research skills | Nielsen Norman Group articles, W3C WAI, public design research guides |
| UI Designer | HCI and accessibility | W3C WAI, design system documentation, Figma training |
| Data Analyst | CS2023 data management and statistics | freeCodeCamp, SQL learning, pandas, Kaggle |
| Data Engineer | CS2023 data management and systems | DataTalks.Club Zoomcamp, SQL and Docker official docs |
| Cybersecurity Analyst | NIST NICE task/knowledge/skill framework | Cisco Networking Academy, NIST and defensive labs |
| Penetration Tester | NIST NICE; OWASP testing methodology | OWASP WSTG, authorised web security labs |
| Embedded Systems Developer | CS2023 architecture/specialised platforms | Official microcontroller and firmware docs, simulations |
| Hardware Engineer | Engineering fundamentals, ABET context | Digital logic and circuits educational resources, hardware CAD docs |
| Network Engineer | CS2023 networking; SFIA | Cisco Networking Academy, Wireshark and protocol docs |
| DevOps Engineer | SFIA DevOps and operations skills; CS systems | Docker, Git, CI/CD, infrastructure tooling documentation |

**Qualification:** The table identifies reasonable references for review, not a completed audited trace from every topic to a standard. Some listed candidate providers have not been independently checked in this documentation pass.

## How to defend the selection of resources

- **Authority:** Prefer official documentation, maintained educational projects, recognised professional bodies and specialist learning providers.
- **Relevance:** A resource should cover the actual learning objective and subtopics, not merely mention the same broad career.
- **Access:** Each topic must ultimately have at least one *verified* free resource. Account requirements, paid features, equipment and cloud billing must be labelled.
- **Practice:** Prefer examples, labs and projects where a learner can apply a concept safely and legally.
- **Traceability:** Record direct URL, provider, topic IDs, exact access conditions, licence notice, date checked, and coverage gaps.

The existing `research/resource-verification.csv` from pack v4 is a **candidate link inventory, not proof that every topic has a checked resource**. It explicitly marks link-by-link coverage as unverified. Likewise, adding external providers to a bibliography does not establish that each Asgard topic was sourced from or validated by them.

## What is original vs externally sourced?

| Element | Attribution |
|---|---|
| Career inventory and 4-level hierarchy | Asgard's content specification |
| Milestone grouping, topic order, beginner route | Asgard draft editorial synthesis |
| Topic overviews and learning goals | Original Asgard-drafted guidance; needs expert accuracy review |
| Practice and completion criteria | Original Asgard-drafted activities; needs expert quality review |
| Linked tutorials and technical references | Third-party sources, to be attributed by provider and direct URL |
| Framework concepts | Respective standards bodies, used for general coverage guidance |
| Learner completion state | Asgard application responsibility, not curriculum material |

## Copyright, licensing and academic integrity

This package **links** to third-party tutorials and does not purport to redistribute their text, videos, illustrations, assessments or code. The Odin Project's FAQ states that its *curriculum* has noncommercial licensing restrictions (the website's software licence is separate); check their current terms before republishing or commercially adapting material. Licences vary by source and cannot be inferred from the fact that material is free to read. Use clear attribution and respect any applicable terms of use. This dossier is not a legal opinion.

If discussing Asgard in an academic defense, avoid suggesting a standards organisation validated Asgard, or that all 288 lessons underwent source-by-source verification; neither claim is supported.

## Status and limitations of the current pack

The current v4 ZIP has 12 career roadmaps, 72 milestones and 288 topics (6 milestones and 24 topics per career). The topic-count target in the original specification was approximately 25–40; this remains a gap. Repeated generic exercises, uneven subtopic explanations, resource relevance and lesson-level verification are also pending work. There has been **no expert approval, learner outcome study, employment outcome validation or accreditation**.

## Suggested evidence-based presentation script

> Asgard is a curated, beginner-oriented career roadmap platform. We developed an original sequence of milestones and topics by considering published computing knowledge areas and professional skills descriptions, then identified free resources from technical documentation and established learning platforms. Asgard itself guides learners with short goals, practice tasks and self-checks; the linked providers deliver fuller instruction. The curriculum remains a draft, and we distinguish verified source pages from resources that still need topic-level checking. We do not claim accreditation or endorsement by the source organisations.

## Frequently asked defense questions

**Did you copy The Odin Project's roadmap?** No. It is an example of free, curated, project-oriented education; Asgard's own sequence and content are drafted separately. Verify originality with an editorial review before release.

**Why should people trust your learning objectives?** They draw from recognised subject areas and job-skill frameworks, but trust also requires topic-level evidence and expert review, which remain pending.

**Why not write full lessons?** Asgard's role is to guide and assess learning direction. Detailed instruction remains with linked educators and official documentation.

**Are all resources really free and verified?** Not yet. A candidate resource ledger exists; individual access and coverage must be checked before a free label is treated as verified.

**Will completing Asgard qualify someone for a job?** No such promise is made. It offers an introductory path and starter project, not employment eligibility or mastery certification.

**What still needs to happen before publishing?** Topic-level resource verification, licence and cost review, detailed accuracy review by subject experts, and user testing of the practice tasks.

## Main consulted references

See `source-register.csv` for URLs, source roles, applicability and verification scope. Especially relevant official references are:

- ACM/IEEE-CS/AAAI, CS2023: https://csed.acm.org/knowledge-areas/
- SFIA Foundation, SFIA 9: https://sfia-online.org/en/the-sfia-framework
- NIST NICE Framework: https://www.nist.gov/itl/applied-cybersecurity/nice/nice-framework-resource-center/getting-started
- ABET, Computing Criteria: https://www.abet.org/accreditation/accreditation-criteria/criteria-for-accrediting-computing-programs-2025-2026/
- The Odin Project, About: https://www.theodinproject.com/about
- The Odin Project, FAQ and licensing: https://www.theodinproject.com/faq
- W3C WAI Tutorials: https://www.w3.org/WAI/tutorials/
- Google ML Crash Course: https://developers.google.com/machine-learning/crash-course/
- DataTalks.Club: https://datatalksclub.github.io/docs/courses/data-engineering-zoomcamp/
- OWASP WSTG: https://owasp.org/projects/web-security-testing-guide
- Cisco Networking Academy: https://www.cisco.com/site/us/en/learn/training-certifications/training/netacad/index.html

**Verification date for consulted pages in this dossier:** 2026-11-02. Candidate URLs not individually checked are identified in the source register; topic-level verification is separate.
