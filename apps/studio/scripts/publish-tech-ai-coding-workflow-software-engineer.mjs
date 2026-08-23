import {createReadStream} from 'node:fs'
import {readFile} from 'node:fs/promises'
import {homedir} from 'node:os'
import {dirname, join} from 'node:path'
import {fileURLToPath} from 'node:url'
import {createClient} from '@sanity/client'

const session = JSON.parse(
  await readFile(join(homedir(), '.config', 'sanity', 'config.json'), 'utf8'),
)
const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? 'dis8yhkz',
  dataset: process.env.SANITY_STUDIO_DATASET ?? 'production',
  apiVersion: '2026-08-16',
  useCdn: false,
  token: session.authToken,
})

let key = 0
const block = (style, text) => ({
  _key: `b${++key}`,
  _type: 'block',
  style,
  markDefs: [],
  children: [{_key: `s${key}`, _type: 'span', marks: [], text}],
})
const p = (text) => block('normal', text)
const h2 = (text) => block('h2', text)
const h3 = (text) => block('h3', text)
const code = (filename, language, tone, value) => ({
  _key: `c${++key}`,
  _type: 'codeBlock',
  filename,
  language,
  tone,
  code: value,
})
const callout = (tone, title, body) => ({
  _key: `a${++key}`,
  _type: 'techCallout',
  tone,
  title,
  body,
})

const articleId = 'tech-article-ai-coding-workflow-software-engineer'
const existingCoverRef = await client.fetch(
  `*[_id == $articleId][0].coverImage.asset._ref`,
  {articleId},
)
const coverPath = join(
  dirname(fileURLToPath(import.meta.url)),
  '../../tech-blog/public/articles/ai-coding-workflow-software-engineer/cover.png',
)
const coverAsset = existingCoverRef
  ? {_id: existingCoverRef}
  : await client.assets.upload('image', createReadStream(coverPath), {
      filename: 'ai-coding-workflow-software-engineer.png',
      contentType: 'image/png',
    })

const article = {
  _id: articleId,
  _type: 'techArticle',
  title: 'How to Build an AI Coding Workflow as a Software Engineer',
  slug: {_type: 'slug', current: 'ai-coding-workflow-software-engineer'},
  description:
    'A practical setup for supervising coding agents, delegating focused research, reviewing AI-generated code, and using Claude and Codex as independent implementation and review lanes.',
  kicker: 'AI engineering field guide 001',
  readTime: '18 min',
  difficulty: 'Intermediate',
  publishedAt: '2026-08-16T12:00:00.000Z',
  updatedAt: '2026-08-16T12:00:00.000Z',
  coverImage: {
    _type: 'image',
    asset: {_type: 'reference', _ref: coverAsset._id},
    alt: 'A software engineer supervising specialized codebase, planning, maintainability, scalability, and security agents before a multi-model pull request review',
  },
  taxonomies: [
    {_key: 'ai-agents', _type: 'reference', _ref: 'tech-taxonomy-ai-agents'},
    {_key: 'guides', _type: 'reference', _ref: 'tech-taxonomy-guides'},
  ],
  seoTitle: 'How to Build an AI Coding Workflow as a Software Engineer',
  seoDescription:
    'Build a reliable AI coding workflow with supervisor agents, focused subagents, Claude-to-Codex PR reviews, deterministic checks, and human approval.',
  sourceUrls: [
    {
      _key: 'src1',
      title: 'Custom Code Review rules for Codex',
      url: 'https://learn.chatgpt.com/blog/custom-code-review-rules-for-codex',
    },
    {
      _key: 'src2',
      title: 'Review GitHub pull requests with Codex',
      url: 'https://learn.chatgpt.com/use-cases/github-code-reviews',
    },
    {
      _key: 'src3',
      title: 'Claude Code custom subagents',
      url: 'https://code.claude.com/docs/en/sub-agents',
    },
    {
      _key: 'src4',
      title: 'OWASP Secure Code Review Cheat Sheet',
      url: 'https://cheatsheetseries.owasp.org/cheatsheets/Secure_Code_Review_Cheat_Sheet.html',
    },
    {
      _key: 'src5',
      title: 'GitHub protected branches',
      url: 'https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches',
    },
  ],
  body: [
    p(
      'The fastest software engineer in the AI era is not the person who accepts the most generated code. It is the person who can turn a vague requirement into a sound design, give an agent the right boundaries, recognize when the implementation is wrong, and produce evidence that the finished change actually works.',
    ),
    p(
      'AI coding agents can search a repository, draft a plan, implement a feature, write tests, and review a pull request. That changes the shape of engineering work, but it does not remove the need for engineering knowledge. It raises the cost of not having it: an agent can now produce a large amount of plausible code faster than an inexperienced reviewer can understand the consequences.',
    ),
    callout(
      'tip',
      'Your job shifts from typing to judgment',
      'Treat the agent as a fast contributor whose work must satisfy a contract. You remain responsible for the architecture, the accepted tradeoffs, the evidence, and the production outcome.',
    ),
    h2('Start with software engineering fundamentals'),
    p(
      'Before building an elaborate agent setup, make sure you can critique code written by somebody else—including your coding agent. Prompting skill cannot compensate for an inability to recognize broken authorization, a leaky abstraction, an unsafe migration, an unbounded query, or a test that proves nothing.',
    ),
    p(
      'You do not need to memorize every framework API. You do need working knowledge of data structures, control flow, types, databases, networking, concurrency, caching, authentication, authorization, testing, version control, deployment, observability, and failure recovery. These concepts let you ask whether the code is correct beyond whether it compiles.',
    ),
    code(
      'The minimum critique loop',
      'text',
      'neutral',
      `1. What behavior is this change supposed to produce?
2. Which inputs, states, and failure modes exist?
3. Where does untrusted data enter?
4. Which invariants must remain true?
5. What existing contract could this break?
6. How do the tests demonstrate the required behavior?
7. What will tell us that it failed in production?
8. Can the change be rolled back or safely replayed?`,
    ),
    p(
      'If you cannot answer those questions from the diff and the surrounding system, do not merge merely because several agents approve it. Ask for a smaller change, more context, stronger tests, or a design explanation you can verify.',
    ),
    h2('Make the repository the source of truth'),
    p(
      'A reliable AI workflow begins before the first prompt. Agents perform much better when the repository contains the knowledge that experienced teammates otherwise carry in their heads: commands, architecture boundaries, naming conventions, security rules, compatibility promises, and the definition of done.',
    ),
    p(
      'Store stable instructions close to the code. Codex can use scoped AGENTS.md files during implementation and code review, while Claude Code uses project instructions and custom subagent definitions. The exact product is less important than the principle: repository rules should be reviewable, versioned, and shared by the team.',
    ),
    code(
      'AGENTS.md',
      'text',
      'good',
      `# Repository contract

- Run pnpm lint, pnpm typecheck, and the affected test suite.
- Never log access tokens, form payloads, or customer identifiers.
- Preserve public response fields unless the task explicitly includes a migration.
- Validate authorization on the server, not only in the UI.
- Database migrations must include rollback or forward-recovery notes.
- Do not introduce a new dependency without explaining why existing tools are insufficient.
- Report the commands run and any checks that could not be completed.`,
    ),
    p(
      'Keep rules concise and testable. “Write clean code” leaves interpretation to the model. “Do not call database clients from UI components” gives the agent and reviewer a concrete boundary. When a recurring review comment appears, decide whether it belongs in repository instructions, a lint rule, a test, or a CI check.',
    ),
    h2('Use one supervisor, not one giant prompt'),
    p(
      'For non-trivial work, use a supervisor agent to coordinate the task. Its job is not to write every line. It decomposes the request, delegates independent investigations, reconciles their findings, proposes the implementation plan, and verifies that the final change meets the original contract.',
    ),
    code(
      'Supervisor workflow',
      'text',
      'neutral',
      `Requirement
  -> supervisor defines scope and acceptance criteria
  -> codebase agent maps the current implementation
  -> planning agent proposes the smallest safe change
  -> maintainability agent checks boundaries and duplication
  -> scalability agent checks load and failure behavior
  -> security agent builds a focused threat review
  -> supervisor resolves conflicts and approves a plan
  -> implementation agent changes the code
  -> verification agents inspect the diff and evidence
  -> human owner makes the final decision`,
    ),
    p(
      'This structure preserves the main context. A codebase mapper can inspect hundreds of files and return only the relevant call graph. A security reviewer can focus on trust boundaries without filling the implementation conversation with every pattern it searched. Specialized agents also make prompts and tool permissions easier to audit.',
    ),
    h3('Give the supervisor a contract'),
    code(
      'Supervisor prompt',
      'text',
      'good',
      `You supervise this engineering task.

Before implementation:
1. Restate the required behavior and non-goals.
2. Identify missing decisions without inventing product requirements.
3. Delegate independent read-only investigations where useful.
4. Synthesize one plan with affected files, risks, tests, and rollback notes.

During implementation:
5. Keep the diff inside the approved scope.
6. Require evidence for claims about the existing codebase.
7. Do not let reviewers modify the same files they are reviewing.

Before completion:
8. Run deterministic checks.
9. Review the final diff, not an earlier version.
10. Report blockers, recommendations, residual risks, and unverified assumptions.`,
    ),
    p(
      'A supervisor should not delegate work simply to create the appearance of rigor. Parallelize investigations that are independent and bounded. Keep tightly coupled implementation steps together, otherwise several agents may make incompatible assumptions or edit overlapping parts of the repository.',
    ),
    h2('Build a small roster of specialized agents'),
    h3('1. Codebase mapper'),
    p(
      'This agent is read-only. It locates entry points, traces data flow, identifies tests, finds repository rules, and reports the smallest set of files relevant to the task. Its output should contain file paths and evidence, not a speculative redesign.',
    ),
    h3('2. Planning agent'),
    p(
      'The planner converts the requirement and codebase map into ordered changes. It should identify contracts, migrations, deployment sequence, testing strategy, observability, and rollback. It must distinguish facts found in the repository from recommendations it is proposing.',
    ),
    h3('3. Maintainability reviewer'),
    p(
      'This reviewer looks for duplicated logic, misplaced responsibilities, unnecessary abstractions, confusing names, hidden coupling, and changes that make the next modification harder. Its goal is not maximum abstraction; it is the simplest design that preserves clear boundaries.',
    ),
    h3('4. Scalability and reliability reviewer'),
    p(
      'This lane examines query growth, memory use, concurrency, timeouts, retry behavior, idempotency, queue semantics, cache invalidation, rate limits, and partial failures. It should model what changes when traffic is ten or one hundred times larger and what happens when a dependency is slow rather than completely unavailable.',
    ),
    h3('5. Security reviewer'),
    p(
      'The security agent traces untrusted inputs, authentication, authorization, secrets, logs, dependency changes, outbound requests, and data exposure. Give it the feature’s threat boundaries and keep it read-only. Automated scanning helps, but business-logic flaws still require a reviewer who understands what users are allowed to do.',
    ),
    h3('6. Test and verification agent'),
    p(
      'This agent asks whether the tests would fail if the implementation were subtly wrong. It looks for missing negative cases, assertions that only confirm mocks, untested error recovery, and tests coupled to implementation details. It also runs the project’s real checks and records the exact results.',
    ),
    callout(
      'warning',
      'Analysis agents should usually be read-only',
      'A reviewer that silently edits the code can erase the evidence it was supposed to evaluate. Separate investigation, implementation, and verification roles, and grant each one only the tools needed for its task.',
    ),
    h2('Define a standard findings format'),
    p(
      'Multiple agents are useful only if their results can be compared. Require every reviewer to use the same severity levels and evidence format. This prevents a long list of stylistic preferences from burying the one issue that can leak data or corrupt a migration.',
    ),
    code(
      'Review finding contract',
      'text',
      'good',
      `Severity: BLOCKER | HIGH | MEDIUM | LOW
Title: One precise sentence
Evidence: File and narrow line range
Failure mode: A concrete input or runtime sequence
Impact: What breaks, leaks, corrupts, or becomes unmaintainable
Recommendation: The smallest credible correction
Verification: A test or command that would prove the correction
Confidence: HIGH | MEDIUM | LOW`,
    ),
    p(
      'A blocker needs a reproducible or strongly reasoned failure mode. “This could be cleaner” is not a blocker. Neither is a bare claim that a pattern is insecure. Require the reviewer to connect the changed code to an actual trust boundary, invariant, or supported scenario.',
    ),
    h2('Use Claude and Codex as independent review lanes'),
    p(
      'For important pull requests, I recommend a producer-reviewer split across model families. A practical default is Claude for implementation followed by Codex for an independent review of the final diff. The reverse also works: Codex can implement and Claude can review. The value comes from fresh context and different failure tendencies, not from treating either model as automatically correct.',
    ),
    p(
      'Do not give the reviewing model the implementation conversation. Give it the requirement, acceptance criteria, repository rules, final diff, relevant tests, and enough surrounding code to verify behavior. Otherwise it may inherit the author’s assumptions and merely rationalize the chosen design.',
    ),
    code(
      'Claude -> Codex review handoff',
      'text',
      'neutral',
      `Claude implementation packet
  - original requirement and non-goals
  - implementation summary
  - final commit or diff
  - tests added and commands run
  - known limitations

Codex independent review
  - inspect repository rules and affected call paths
  - verify behavior against the original requirement
  - run or inspect deterministic checks
  - return evidence-backed findings only

Human decision
  - reproduce blockers
  - resolve disagreements
  - approve, request changes, or reduce scope`,
    ),
    h3('Do not use majority vote'),
    p(
      'If three agents approve a pull request and one identifies a credible authorization bypass, the vote is not three to one. The security finding wins until it is disproved. Conversely, two agents repeating the same unsupported warning do not turn it into evidence.',
    ),
    p(
      'Merge reports by root cause, not by reviewer count. Deduplicate overlapping findings, reproduce high-severity claims, and record why a disputed finding was accepted or rejected. Multi-model review reduces correlated blind spots; it does not eliminate hallucinations or shared misunderstandings of the requirement.',
    ),
    h2('Create a senior-level PR review pipeline'),
    p(
      'If reviewing pull requests is part of your role, automate preparation rather than delegating the final judgment. Agents can map affected surfaces, run specialized reviews, and summarize evidence before you read the diff. Your attention then goes to the most consequential decisions.',
    ),
    code(
      'Pull request review pipeline',
      'text',
      'neutral',
      `Stage 1: Intake
  -> requirement, non-goals, risk level, changed contracts

Stage 2: Deterministic checks
  -> formatting, lint, types, unit/integration tests, build, scans

Stage 3: Independent agent reviews
  -> correctness and regressions
  -> maintainability and architecture
  -> security and privacy
  -> scalability and reliability
  -> tests and observability

Stage 4: Cross-model challenge
  -> Claude findings challenged by Codex, or vice versa

Stage 5: Human review
  -> inspect diff and evidence
  -> reproduce blockers
  -> decide whether residual risk is acceptable

Stage 6: Protected merge
  -> required checks and approvals must pass`,
    ),
    p(
      'The review must run against the latest commit. If the author pushes changes after the agents finish, invalidate the old verdict and review the new diff. Branch protection and required status checks should enforce this mechanically rather than relying on somebody to remember.',
    ),
    h2('Keep deterministic tools above model opinions'),
    p(
      'Use agents for interpretation and exploration. Use deterministic tools for properties they can prove more reliably: compilation, formatting, unit tests, integration tests, schema validation, dependency scanning, static analysis, and reproducible performance checks.',
    ),
    code(
      'Evidence hierarchy',
      'text',
      'neutral',
      `Stronger evidence
  1. Reproduced failure or passing regression test
  2. Compiler, type checker, static analyzer, or policy result
  3. Traceable code path with a concrete input and outcome
  4. Architecture argument tied to a documented invariant
  5. Model opinion without reproduction
Weaker evidence`,
    ),
    p(
      'An agent saying “tests pass” is not evidence unless the command and result are available. An agent saying a dependency is safe is not a substitute for checking the resolved version and advisory database. Make unverified claims visible in the final report.',
    ),
    h2('Use risk tiers instead of reviewing everything equally'),
    p(
      'A copy change and an authorization change should not consume the same workflow. Classify the task before delegation. Low-risk changes may need one implementation agent and deterministic checks. Medium-risk changes add an independent review. High-risk changes require specialist lanes, a second model, human reproduction of blockers, and a deployment or rollback plan.',
    ),
    code(
      'Risk tiers',
      'text',
      'neutral',
      `LOW
  docs, copy, isolated styling
  -> one agent + standard CI + diff review

MEDIUM
  business logic, API behavior, database queries
  -> supervisor + focused reviewers + independent model review

HIGH
  auth, payments, permissions, migrations, secrets, destructive operations
  -> threat review + multiple independent lanes + human reproduction
     + protected deployment + rollback or forward-recovery plan`,
    ),
    h2('The daily workflow'),
    h3('Step 1: Write the task contract'),
    p(
      'Describe the user-visible outcome, acceptance criteria, non-goals, constraints, risk tier, and the evidence required for completion. A good task contract is more valuable than a long implementation prompt because it gives every agent the same target.',
    ),
    h3('Step 2: Map before modifying'),
    p(
      'Ask a read-only agent to locate the current behavior, relevant tests, data flow, repository rules, and adjacent contracts. Review its map before allowing implementation. This prevents a locally reasonable change in the wrong layer.',
    ),
    h3('Step 3: Review the plan yourself'),
    p(
      'Check whether the plan solves the requirement with the smallest safe change. Look for invented requirements, unexplained dependencies, broad refactors hidden inside a feature, and missing migration or failure behavior.',
    ),
    h3('Step 4: Let one agent own implementation'),
    p(
      'Give one agent responsibility for the coherent diff. Subagents may research or verify, but avoid several agents editing overlapping files unless worktrees and integration boundaries are explicit. Small, reviewable commits are easier to inspect and revert.',
    ),
    h3('Step 5: Run independent review lanes'),
    p(
      'Review the final diff using focused agents and, for meaningful changes, a different model family. Require the standard findings format. A reviewer should not praise the change or rewrite the implementation; it should identify actionable issues supported by evidence.',
    ),
    h3('Step 6: Verify and decide'),
    p(
      'Run the required checks, reproduce blockers, inspect sensitive paths manually, and confirm the deployment plan. The final question is not whether the agents agree. It is whether you have enough evidence to accept the remaining risk.',
    ),
    h2('Failure modes to watch for'),
    p(
      'Agent-heavy workflows can create their own problems: duplicated work, excessive token cost, conflicting edits, huge low-signal reports, reviewers that inherit the author’s assumptions, and a false sense of security because several models produced the same answer.',
    ),
    p(
      'The solution is disciplined scope. Delegate bounded questions. Prefer read-only review roles. Set stopping conditions. Require evidence. Restrict tool permissions. Keep secrets out of prompts and logs. Do not allow agents to merge or deploy high-risk changes without the human and repository controls appropriate to that system.',
    ),
    callout(
      'warning',
      'More agents are not automatically safer',
      'A weak requirement multiplied across five agents produces five polished interpretations of the wrong task. Improve the contract and the verification strategy before increasing the number of reviewers.',
    ),
    h2('A setup you can adopt incrementally'),
    p(
      'You do not need to build the entire system on day one. Start by documenting repository commands and invariants. Add one read-only codebase mapper. Then add an independent PR reviewer. Introduce security and scalability specialists only where the risk justifies them. Finally, automate the repeated workflow after you understand its failure modes.',
    ),
    code(
      'First four weeks',
      'text',
      'neutral',
      `Week 1
  -> document build, test, architecture, and security rules

Week 2
  -> introduce task contracts and read-only codebase mapping

Week 3
  -> implement Claude -> Codex independent PR review
  -> standardize severity and evidence

Week 4
  -> add risk tiers, specialist reviewers, and protected checks
  -> measure false positives, escaped defects, review time, and cost`,
    ),
    h2('What to measure'),
    p(
      'Do not measure success by lines generated or number of agent comments. Track review turnaround, escaped defects, reverted changes, false-positive findings, time spent reproducing issues, test coverage of reported regressions, and how often repository rules prevent repeated mistakes.',
    ),
    p(
      'The best outcome is not maximum automation. It is a workflow that lets engineers ship more while keeping the reasoning, evidence, and accountability visible.',
    ),
    h2('The principle to keep'),
    p(
      'In the new AI era, software engineering knowledge becomes the control plane. Agents can multiply implementation and review capacity, but they cannot decide which tradeoff your product, users, and production system should accept. Build a setup that uses their speed while preserving independent verification and human ownership.',
    ),
    callout(
      'tip',
      'Use AI to widen review, not weaken responsibility',
      'Let Claude implement and Codex challenge—or reverse the roles—but require the engineer responsible for the change to understand the code, inspect the evidence, and own the final decision.',
    ),
  ],
}

const result = await client.createOrReplace(article)
console.log(
  JSON.stringify(
    {
      published: {_id: result._id, _type: result._type, slug: article.slug.current},
      coverAsset: coverAsset._id,
    },
    null,
    2,
  ),
)
