# Asgard - Full System Demonstration Guide

Prepared by Codex, 2026-11-19. Status: presentation guide drafted; actual demonstration rehearsal pending. Review owner: project owner. Scope: demonstration instructions only; no application or configuration changes. Coverage: REQ-01-13 and the current user-facing skill-matching extension.

## Demo story and order

“We will show two starting points: a beginner deciding which technology career to explore, and a person using existing skills or experience to consider a shift. Both need to understand their options and identify what to learn next.”

Follow this order: **Landing → Account entry → Discovery → Career exploration → Career comparison → Profile and skills → Resume review → Career skill matches → Roadmap → Progress Dashboard → AI Counselor → Settings and security → Logout.**

Allow roughly 20-30 minutes for a full walkthrough, depending on email and AI response times. This is a planning estimate, not a measured rehearsal time. If your slot is shorter, keep account setup brief and move extended security actions to questions or a recording.

## Before presenting

- Write down the actual demo URL and open it before the presentation. Use the already-configured local app at `http://127.0.0.1:5173/` only if you have rehearsed that environment.
- Prepare a fresh account for the beginner flow and a returning demo account with saved skills, progress, and activity history.
- Prepare a fictional, selectable-text resume PDF with clear Skills, Work experience, Education, and Projects sections. Avoid real personal information. Scanned image-only PDFs are unsupported.
- Prepare a small valid profile photo if you plan to demonstrate photos.
- Rehearse one Discovery answer set, one career pair, and one roadmap. Do not promise an exact suggestion until you have tried those answers against the demo catalog.
- Check which resume, matching, Counselor, photo, and account-security functions actually work in the presentation environment.
- Check both Career skill matches tabs. If one is unavailable, disclose that limitation and use the working view; do not silently treat them as interchangeable.
- Have screenshots or a clearly labeled recording of the same flow ready. A fallback recording should show the actual system.
- Keep private passwords, authenticator QR codes, setup keys, and recovery codes off the projector.

## 1. Landing page - What is the system?

**Open:** Landing page, signed out.

**Do:**

1. Point to the system name and introduction.
2. Show the registration and sign-in options.

**Say:** “Asgard is an AI career decision support system for adults exploring technology careers. It helps users understand their options and connect a chosen direction to learning steps.”

**Expected:** The professor understands the purpose before seeing individual screens.

## 2. Registration, verification, and sign-in

**Open:** Create account, then email verification and sign-in as applicable.

**Do:**

1. Use a designated demo email to register.
2. Show one simple validation example, such as a short password, then correct it.
3. Retrieve the verification code privately and select **Verify** explicitly.
4. Complete the account entry flow. If email delivery is slow, switch to the prepared verified account and explain the switch.

**Say:** “An account lets the user save Discovery answers, profile information, and learning progress.”

**Expected:** Account access succeeds and private application pages become available. Do not show Google sign-in as a current feature; it is omitted from the present interface.

## 3. Welcome - Two ways to begin

**Open:** New-user Welcome page (`/welcome`).

**Do:**

1. Show **Guided Discovery** and **Browse careers**.
2. Explain that browsing lets users explore without answering Discovery or uploading a resume.
3. Choose Guided Discovery for the beginner scenario.

**Say:** “A user can ask for a starting point or explore independently. Prior technology experience is not required.”

## 4. Guided Discovery - Help a beginner find options

**Open:** Discovery (`/discovery`).

**Do:**

1. Answer the questions using your rehearsed interests and activities.
2. Point out uncertainty choices so beginners can proceed without pretending to know their direction.
3. Use **Back** once to show that an answer can be changed.
4. At a saved checkpoint, leave and use the offered Resume action to show saved answers returning.
5. Complete Discovery.

**Say:** “Discovery collects the user's stated interests and goals. Its first suggestions use matching rules to identify careers worth exploring.”

**Expected:** The saved draft can be resumed, and completion opens career suggestions. Do not call this an aptitude test or say the system has measured the user's ability.

## 5. Career suggestions - Explain why an option appears

**Open:** Results (`/recommendations`).

**Do:**

1. Show the suggested careers and read one short explanation.
2. Connect that explanation to an answer you gave.
3. Distinguish a direct suggestion and a related option if both appear.
4. Show access to browsing and the Retake action. Complete a retake later or show a recording if repeating the questionnaire would take too long.

**Say:** “These are options to investigate. The user can explore other careers, and the system does not automatically choose a roadmap.”

**Expected:** Suggestions are explained without career-fit percentages. A full retake starts with blank answers and preserves learning progress.

## 6. Career browsing - Explore beyond the suggestions

**Open:** Careers (`/careers`).

**Do:**

1. Search for a rehearsed career.
2. Apply a category filter and then clear it.
3. Open a career and expand **Read about this career**.
4. Show its work, skills, and example activities or projects where present.
5. Return to Careers to compare alternatives.

**Say:** “Users can explore the full published catalog, including careers outside their Discovery suggestions.”

**Expected:** Search and filters change the displayed options. Opening a career alone leaves the current learning focus unchanged.

## 7. Career comparison - Understand two alternatives

**Open:** **Compare careers** from Careers (`/careers/compare`).

**Do:**

1. Select two rehearsed roles, such as Data Analyst and Data Engineer.
2. Show one difference in their work and one shared skill.
3. Expand learning details or work examples.
4. Show an available AI explanation and the Sources disclosure briefly, without explaining source systems.
5. Open the personal notes section, save an alternative with a short note, and revisit it.

**Example note:** “Interested in this role; explore the introductory learning topics before deciding.”

**Say:** “The comparison helps the user understand the work and record why an alternative interests them.”

**Expected:** The career pair, explanations, and saved note remain associated with the correct role. The private note is not sent to AI. The main catalog no longer has a Saved careers filter; demonstrate saving through the comparison page.

## 8. Profile and manual skills - Introduce existing experience

**Open:** Settings → Profile (`/settings/profile`).

**Do:**

1. Transition to the experienced-user scenario, using the returning demo account if helpful.
2. Edit a fictional name and save. Show the updated identity where displayed.
3. If available, upload or replace the prepared profile photo.
4. Open Skills, search for a rehearsed skill, choose a self-reported experience level, and save it.
5. Edit that report once to show that the user can correct it.

**Say:** “Users can describe skills they already have. These are self-reports that help organize exploration.”

**Expected:** Saved details persist. A reported level is the user's description, not a certified assessment. Prepare the exact skill search beforehand because the catalog includes different skill descriptions.

## 9. Resume analysis - Use background without retyping it

**Open:** Profile → the resume/document section.

**Do:**

1. Choose the prepared fictional PDF.
2. Select **Analyze PDF** explicitly. Confirm synthetic data if prompted.
3. After success, show the saved Skills, Work experience, Education, and Projects categories that were actually found.
4. Expand one supporting source passage.
5. Show **From resume** under Skills and explain that it is separate from manually rated skills.

**Say:** “The optional analysis extracts background from a resume so users can review it and explore related career skills. A resume mention does not establish proficiency.”

**Expected:** Validated analysis saves the extracted background. It does not automatically create experience ratings. Explain an unavailable analysis control truthfully and use a labeled recording if needed.

**Additional feature, if time permits:** Open **Review career-linked skills without storing a resume**, choose a career and a PDF, inspect the suggested skills, then explicitly choose a level and save a skill. This is a separate review path; its suggestions require confirmation.

## 10. Career skill matches - Connect existing skills to options

**Open:** **View career matches** or `/career-skill-matches`.

**Do:**

1. Show **Benchmark sample** and **Learning-path skills**.
2. On a rehearsed working tab, expand a career and show the matched-skill count.
3. Point to examples marked **Matched**, **Unknown**, and **Missing**, where your prepared data provides them.
4. Show whether a match comes from a saved report or a resume mention.
5. If the sample view works, briefly open a reference posting and explain that it is an example, not necessarily an active vacancy.

**Say:** “This helps users see which listed skills are reflected in their records and which they may want to investigate or study.”

**Expected:** Each tab explains the skills it compares. Missing means absent or no experience reported in the records; it does not prove inability. Counts are not career-fit or job-readiness scores. The sample view has a recorded setup/acceptance follow-up, so confirm it before the presentation.

## 11. Roadmaps - Turn a direction into a learning plan

**Open:** A selected career's roadmap.

**Do:**

1. Select **Set as current roadmap** deliberately.
2. Expand a milestone and open a topic.
3. Show the topic overview, learning outcome, tools, and available resources.
4. Open one rehearsed resource, then return to the application.
5. If the selected roadmap offers a tool-path choice, explain and select it.
6. If demonstrating the Data Analyst roadmap's downloads, show the practice CSV and reference-download links where available.

**Say:** “After choosing a direction, the user gets an organized path with topics and resources for the next learning step.”

**Expected:** The selected roadmap becomes the learning focus. Resources and downloads are authored content; do not say that AI generates the roadmap or that every resource is free.

## 12. Topic progress - Show an actual saved change

**Open:** The selected topic panel.

**Do:**

1. Show the available states: **Not started**, **Learning**, **Done**, and **Skipped**.
2. Mark a topic Learning, then Done, and wait for the saved result.
3. Show one reversible status change and restore the intended demo state.
4. Use **Hide completed** to demonstrate the roadmap filter.
5. If a conflicting active topic is encountered, show the resolution prompt rather than forcing a switch.

**Say:** “Users record their learning activity and can correct it. The system helps keep their active learning focus consistent.”

**Expected:** Progress updates after successful saving. Marking Done records reported activity; it does not certify mastery.

## 13. Dashboard - Return and continue

**Open:** Dashboard (`/dashboard`).

**Do:**

1. Show the current roadmap, milestone progress, and active or suggested next topic.
2. Use **Resume learning** and show that it opens the relevant topic.
3. Return and point out completed activity, the calendar, and current/longest streaks.
4. Change the displayed calendar month if useful.
5. Refresh once to demonstrate saved state.

**Say:** “The Dashboard helps a returning learner see where they left off and continue their plan.”

**Expected:** Saved state is retained and the Dashboard reflects the topic changes. Use a prepared history account for multi-day streaks; do not manufacture a streak during the presentation.

## 14. AI Counselor - Ask what to do next

**Open:** The Counselor launcher while viewing a roadmap or comparison.

**Do:**

1. Ask one question related to the current screen.
2. Ask a short follow-up to demonstrate conversation continuity.
3. Open Sources or follow a suggested in-app destination where available.
4. Close and reopen the panel to show conversation continuity during navigation.
5. Show **New conversation**. If rehearsed, demonstrate **Include web sources** with a second question.

**Suggested questions:**

- On a comparison: “How does the daily work of these two careers differ?”
- On a roadmap: “I am new to this path. What should I learn next?”
- With an active topic: “Can you explain this topic in simpler terms?”
- Follow-up: “What could I try first?”

**Say:** “The Counselor helps explain career and learning information using relevant application context. Users review the advice and choose their own next action.”

**Expected:** An answer or truthful failure state is shown. Following a suggestion does not automatically mark a topic complete. Conversation continuity is session memory; do not promise a permanent chat archive.

## 15. Preferences and supporting pages

**Open:** Profile/preferences, then the footer links.

**Do:**

1. Show the preferred career field and timezone settings; save a rehearsed change if needed.
2. Point out that preferences help organize the experience rather than prove career suitability.
3. Briefly open **Terms**, **Credits**, **Licenses**, and **Service status**.
4. On Service status, show the last-check information and retry/check action.

**Say:** “Users can manage preferences and see the application's information and current service checks.”

**Expected:** Preferences persist after saving. Service status describes current checks, not guaranteed uptime. Keep this section brief.

## 16. Account security and account lifecycle

**Open:** Settings → Account and security (`/settings/profile#account-security`).

Show each control that is present. Carry out password changes, authenticator replacement, or deletion only on a separate designated disposable account, after the main demonstration, or use a rehearsed recording. These operations can interrupt the account needed for the presentation.

| Feature | Demonstration | Expected result / boundary |
| --- | --- | --- |
| Password change | Open the form; on the disposable account, complete the current-password and new-password flow. | Valid changes receive confirmation; keep the new password private. |
| Forgotten password | Open password recovery, request a message for the demo account, and follow its supported reset flow privately. | Recovery gives truthful feedback and permits a valid password reset. Do not promise to bypass an enrolled authenticator. |
| Authenticator verification | If enabled and rehearsed, sign in with a prepared enrolled account and complete the code challenge privately. | Access follows successful verification. |
| Authenticator setup | Show the setup flow on the disposable account without projecting its QR code or setup key. | Enrollment requires explicit verification. |
| Backup codes and replacement | Explain that a current password and unused backup code start restricted authenticator replacement; use a recording or a rehearsed disposable-account flow. | Normal application access resumes only after the replacement and required recovery steps complete. Do not display codes or call them a general login bypass. |
| Account deletion | Open the confirmation interface. Cancel for the main demo; perform the full flow only on the separate disposable account if enabled and rehearsed. | Accepted deletion ends app access; background data removal is not an instant on-screen completion. Availability depends on the enabled service. |
| Logout | Sign out, then try returning to Dashboard. | Private pages require sign-in again. |

## Closing statement

“Asgard connects three decisions: which technology career to explore, how existing interests and skills relate to the options, and what to learn next. The user stays in control, while the system provides explanations, comparisons, and a learning path.”

## Coverage and honest omissions

- Covered above: account entry; guided/direct browsing; Discovery save/resume and retake; career search/filtering; comparison, saved alternatives and private notes; profile, photos, skills and preferences; both resume paths; both skill-matching views; roadmaps, resources and applicable downloads/tool paths; reversible progress; Dashboard, calendar and streaks; Counselor, sources and conversation controls; information/status pages; password/recovery, optional authenticator lifecycle, deletion, and logout.
- Deliberately excluded from current feature claims: omitted Google sign-in, disabled roadmap experience comparison, and dormant practice/reflection panels.
- Planned instructions are not completed verification. Mark each demonstrated section **Passed**, **Failed**, **Unavailable**, or **Not demonstrated** after rehearsal; record the URL/build, date, issue, and person responsible for follow-up.
- Comprehensive failure, accessibility, privacy and multi-tab checks belong in the [member-testing workbook](../member-testing.md). Demonstrating features does not establish that those checks have passed.
- Some workbook descriptions predate the Profile Analyze PDF interface. For resume behavior, follow the newer [PDF guide](../features/pdf-reading.md); for the two matching tabs, follow the newer [skill implementation record](../features/competency-comparison.md).

## Preparation references

- [Presentation bullets](system-presentation-bullets.md)
- [Current pages and interactions](../pages-and-interactions.md)
- [User journeys](../user-journeys.md)
- [Discovery](../specs/discovery.md)
- [Career comparison](../features/career-comparison-and-shortlist.md)
- [PDF paths and extracted background](../features/pdf-reading.md)
- [Career skill matches](../features/competency-comparison.md)
- [Counselor](../features/contextual-counselor-profile.md)
- [Learning streaks](../features/learning-streaks.md)
- [Account access](../features/account-access-fixes.md)
- [Authenticator recovery](../features/application-recovery-codes.md)
- [Account deletion](../features/account-deletion.md)
- [Remaining work and release limits](../future-development.md)

Verification for this document: local source-reference, route, presentation-link and whitespace checks. No application test or live feature acceptance is claimed. No feature implementation guide is required because this change adds presentation instructions only.
