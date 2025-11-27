# AI Agent Development Rules
**Guidelines for AI Agents Developing AI-BPMS**

Version: 2.0  
Date: November 27, 2025

---

## 1. Purpose

This document defines the rules and workflow for AI coding agents (GitHub Copilot, Cursor, Claude, etc.) contributing to the AI-BPMS project. Following these rules ensures consistent, high-quality code and clear communication with the human developer.

---

## 2. Core Principles

### 2.1 Human-AI Collaboration
- **Human**: Defines requirements, reviews code, makes decisions, approves changes
- **AI Agent**: Clarifies requirements, implements code, writes tests, documents work
- **Rule**: AI agents NEVER implement without confirmed requirements

### 2.2 Professional Disagreement
- **AI agents MUST express disagreement** when they believe user's approach is suboptimal
- Present counter-arguments with technical reasoning
- If user insists after hearing the argument → follow user's decision
- Never silently disagree and comply - that wastes everyone's time
- Document the disagreement and user's final decision in commit/comments

**Disagreement Protocol**:
```
1. AI: "I disagree with [X] because [technical reasons]. 
       I recommend [alternative] because [benefits].
       Do you want me to proceed with your approach anyway?"

2. User either:
   - Accepts AI recommendation → proceed with AI's approach
   - Provides counter-reasoning → discuss further
   - Insists on original approach → AI complies and documents decision

3. If user insists: "Proceeding with [user's approach] as requested. 
   Note: [AI's concern] documented for future reference."
```

### 2.3 Single Requirement Focus
- Work on ONE requirement at a time
- Complete the full workflow before starting another requirement
- No parallel requirement development (avoids conflicts)

### 2.3 Atomic Implementation
- **Code and tests are ONE thing** - no implementation without tests
- Implementation is complete ONLY when all tests pass
- Never commit code without corresponding tests

### 2.4 Documentation-First
- Document before implementing
- Tests define expected behavior
- Code explains itself through types and comments

---

## 3. Two-Phase Workflow

### Overview
```
┌─────────────────────────────────────────────────────────────────┐
│                    TWO-PHASE WORKFLOW                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ╔═══════════════════════════════════════════════════════════╗  │
│  ║  PHASE 1: REQUIREMENTS (Human Validation Required)        ║  │
│  ╠═══════════════════════════════════════════════════════════╣  │
│  ║  1. CLARIFY    →  2. AGREE    →  3. COMMIT SPEC           ║  │
│  ║     Questions      Approval       Documentation           ║  │
│  ╚═══════════════════════════════════════════════════════════╝  │
│                           │                                      │
│                           ▼ (User says "AGREE" / "Approved")     │
│  ╔═══════════════════════════════════════════════════════════╗  │
│  ║  PHASE 2: IMPLEMENTATION (Atomic Block - No User Input)   ║  │
│  ╠═══════════════════════════════════════════════════════════╣  │
│  ║                                                           ║  │
│  ║  4. BACKEND     →  5. COMMIT    →  6. FRONTEND           ║  │
│  ║     (code+tests)    Backend        (code+tests)           ║  │
│  ║                                          │                ║  │
│  ║                                          ▼                ║  │
│  ║                                    7. RUN ALL TESTS       ║  │
│  ║                                          │                ║  │
│  ║                                          ▼                ║  │
│  ║                                    8. COMMIT FRONTEND     ║  │
│  ╚═══════════════════════════════════════════════════════════╝  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Key Rules**: 
- Phase 2 is ATOMIC - AI agent executes it completely without stopping for user input
- TWO commits during implementation: after backend, after frontend (for rollback safety)
- Code and tests are written together (not strict TDD - AI generates both)

---

## PHASE 1: REQUIREMENTS (Human Validation)

This phase requires human interaction and approval.

### Stage 1: CLARIFY Requirements

**Goal**: Fully understand what needs to be built

**AI Agent Actions**:
1. Read the requirement from `Phase1-Functional-Requirements.md`
2. Identify any ambiguities or missing details
3. Ask clarifying questions:
   - What are the exact inputs/outputs?
   - What are the edge cases?
   - What are the error scenarios?
   - How does this interact with existing code?
   - What are the acceptance criteria?
4. List assumptions made

**Output**: List of clarifying questions OR confirmation of understanding

**Example**:
```
Requirement: FR-4.2 - Real-time order analysis

Questions:
1. What debounce delay should be used? (Assuming 1 second)
2. Should partial results be shown while typing?
3. What happens if LLM API is unavailable?
4. Maximum content length to analyze?

Assumptions:
- Analysis runs only after user stops typing for 1s
- Show loading state during analysis
- Cache results for identical content
```

---

### Stage 2: AGREE with User

**Goal**: Get explicit confirmation before implementation (after resolving any disagreements)

**AI Agent Actions**:
1. Present understanding back to the user
2. Propose implementation approach (high-level)
3. **If AI disagrees with user's approach**:
   - State disagreement clearly with technical reasoning
   - Propose alternative approach
   - Wait for user response
   - If user insists → comply and document the decision
4. Identify any technical decisions that need user input
5. Wait for explicit approval: "Approved" / "Yes" / "Proceed" / "AGREE"

**Output**: User approval recorded (including any overridden AI recommendations)

**Rule**: 
- ⛔ DO NOT proceed to Phase 2 without explicit user confirmation
- ⛔ DO NOT silently disagree - always voice concerns
- ✅ If user says "yes", "approved", "go ahead", "looks good", "AGREE" → proceed to Phase 2
- ✅ If AI disagrees → express it, then follow user's final decision
- ❓ If user has changes → go back to Stage 1

**Example (with disagreement)**:
```
My understanding:
- Implement POST /api/v1/orders/analyze endpoint
- Cache results for 5 minutes

⚠️ I DISAGREE with caching for 5 minutes:
- Order content changes frequently during drafting
- 5 min cache means user sees stale analysis
- Recommend: 30 second cache or content-hash based cache

Do you want to proceed with 5 min cache anyway, or use my recommendation?

[User: "Use 30 second cache"]

Updated approach with 30s cache. Please confirm to proceed (say "AGREE").
```

**Example (user insists)**:
```
⚠️ I DISAGREE with using SQLite for tests (see Section 9.1)

[User: "I insist on SQLite for now, we'll fix later"]

Proceeding with SQLite as requested. 
⚠️ Documented: AI recommended PostgreSQL, user chose SQLite.
Please say "AGREE" to start implementation.
```

---

### Stage 3: COMMIT Requirement Specification

**Goal**: Document the agreed requirement before coding

**AI Agent Actions**:
1. Create/update requirement specification file
2. Document:
   - Requirement ID and title
   - Agreed behavior
   - Technical approach
   - Acceptance criteria
   - Test cases (high-level)
3. Commit with message: `docs: specify FR-X.X - [title]`

**Output**: Committed specification document

**File**: `docs/requirements/FR-X.X-[name].md`

**Commit Message Format**:
```
docs: specify FR-4.2 - Real-time order analysis

- Document agreed behavior and edge cases
- Define API contract (request/response)
- List acceptance criteria
- Outline test scenarios
```

**→ PROCEED TO PHASE 2 (No more user input needed)**

---

## PHASE 2: IMPLEMENTATION (Atomic Block)

**CRITICAL**: This entire phase executes as ONE atomic unit.
- AI agent does NOT stop for user input
- AI agent makes TWO commits: backend, then frontend (for rollback safety)
- AI agent iterates until ALL tests pass

### Stage 4: IMPLEMENT Backend (Code + Tests)

**Goal**: Implement backend code AND tests together

**Why NOT strict TDD for AI agents**:
- TDD (tests first) works well for humans who need tests to guide design
- AI agents can generate correct code and tests simultaneously
- Writing failing tests first adds overhead without benefit for AI
- AI understands the requirement fully before starting - no need for test-driven discovery

**AI Agent Actions**:

1. Create/modify backend files:
   - Models (if needed)
   - Schemas (Pydantic)
   - Services (business logic)
   - API routes
   - Database migrations
2. Create backend test files:
   - Unit tests for services
   - Integration tests for endpoints
   - Happy path + edge cases + error handling
3. Run backend tests:
   ```bash
   pytest tests/ -v
   ```
4. Fix any failures (iterate until green)
5. Run linters:
   ```bash
   black . && isort . && mypy .
   ```

**Test File Structure**:
```python
"""
Tests for FR-4.2: Real-time Order Analysis

Tests:
- test_analyze_returns_affected_processes: Happy path
- test_analyze_handles_empty_content: Edge case
- test_analyze_caches_results: Caching behavior
"""

@pytest.mark.asyncio
async def test_analyze_returns_affected_processes():
    """Happy path: Valid content returns process analysis."""
    ...
```

**Output**: Working backend with passing tests

---

### Stage 5: COMMIT Backend

**Goal**: Save backend work before starting frontend (rollback point)

**AI Agent Actions**:
1. Verify ALL backend tests pass
2. Verify linters pass
3. Commit backend code + tests

**Commit Message Format**:
```
feat(api): implement FR-4.2 - Real-time order analysis

Backend:
- Add ImpactAnalyzer service with LLM integration
- Add POST /api/v1/orders/analyze endpoint
- Add request/response schemas
- Add Redis caching (5 min TTL)

Tests:
- Backend unit tests (8 tests) - all passing

Files: 6 changed
```

**Why commit here**: If frontend implementation fails or goes wrong, you can rollback to this point without losing backend work.

---

### Stage 6: IMPLEMENT Frontend (Code + Tests)

**Goal**: Implement frontend code AND tests together

**AI Agent Actions**:

1. Create/modify frontend files:
   - API client functions
   - React components
   - Hooks
   - TypeScript types
2. Create frontend test files:
   - Component tests (Vitest)
   - Hook tests
3. Run frontend tests:
   ```bash
   npm test
   ```
4. Fix any failures (iterate until green)
5. Run linters:
   ```bash
   npm run lint && npm run type-check
   ```

**Output**: Working frontend with passing tests

---

### Stage 7: RUN All Tests

**Goal**: Verify full integration works

**AI Agent Actions**:
1. Run ALL tests (backend + frontend):
   ```bash
   # Backend
   pytest tests/ -v
   
   # Frontend  
   npm test
   ```
2. If any test FAILS:
   - Analyze failure reason
   - Fix implementation
   - Re-run tests
   - Repeat until ALL pass

**Iteration Loop**:
```
┌─────────────────────────────────────────┐
│  RUN ALL TESTS                          │
│      │                                  │
│      ▼                                  │
│  ┌─────────┐    Yes    ┌─────────────┐ │
│  │ PASS?   │──────────▶│ PROCEED TO  │ │
│  └─────────┘           │ COMMIT      │ │
│      │ No              └─────────────┘ │
│      ▼                                  │
│  ┌─────────────┐                       │
│  │ FIX CODE    │                       │
│  └─────────────┘                       │
│      │                                  │
│      └──────────────────────────────┘  │
└─────────────────────────────────────────┘
```

**Rule**: 
- Fix code to match tests, not tests to match code
- If test is genuinely wrong, fix it but document why
- If stuck for >15 minutes, ask user for guidance (exception to atomic rule)

---

### Stage 8: COMMIT Frontend

**Goal**: Final commit with frontend code + tests

**AI Agent Actions**:
1. Verify ALL tests pass one final time
2. Verify ALL linters pass
3. Commit frontend code + tests

**Commit Message Format**:
```
feat(ui): implement FR-4.2 - Real-time order analysis UI

Frontend:
- Add ImpactFeedbackPanel component
- Add useOrderAnalysis hook with debounce
- Add analysis types

Tests:
- Frontend component tests (5 tests) - all passing

Files: 6 changed
```

**Summary to User**:
```
✅ FR-4.2 Real-time Order Analysis - COMPLETE

Commits:
1. docs: specify FR-4.2 - Real-time order analysis
2. feat(api): implement FR-4.2 - Real-time order analysis (backend)
3. feat(ui): implement FR-4.2 - Real-time order analysis UI (frontend)

Files changed: 12
Tests added: 13 (8 backend + 5 frontend)
All tests passing ✓
Coverage: 85%

Ready for next requirement.
```

---

## 4. Commit Message Convention

### Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature (code + tests together)
- `fix`: Bug fix
- `docs`: Documentation only
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `style`: Formatting, missing semicolons, etc.
- `chore`: Maintenance tasks

### Scopes
- `api`: Backend API changes
- `ui`: Frontend UI changes
- `db`: Database changes
- `auth`: Authentication changes
- `config`: Configuration changes

### Examples
```
feat: implement order creation with real-time analysis
fix: correct process graph rendering edge case
docs: specify FR-4.2 requirements
refactor: extract entity normalization to service
```

---

## 5. File Naming Conventions

### Backend (Python)
```
app/
  services/
    impact_analyzer.py       # snake_case
    email_ingestion.py
  schemas/
    analysis.py              # Match service name
    order.py
  api/v1/
    orders.py                # Resource name (plural)
tests/
  test_services/
    test_impact_analyzer.py  # test_ prefix
```

### Frontend (TypeScript)
```
src/
  components/
    orders/
      ImpactFeedbackPanel.tsx   # PascalCase
      OrderCreationForm.tsx
  hooks/
    useOrderAnalysis.ts         # camelCase with use prefix
  types/
    analysis.ts                 # camelCase
  pages/
    CreateOrder.tsx             # PascalCase
```

---

## 6. Documentation Requirements

### Every Requirement Must Have
1. **Specification doc**: `docs/requirements/FR-X.X-name.md`
2. **Test docstring**: Explains what tests verify
3. **Implementation notes**: In service/component docstrings
4. **API docs**: Auto-generated by FastAPI (backend)

### Implementation Notes Template
```python
"""
[Class/Function Name]

Purpose: [What this does]

Implementation Notes (FR-X.X):
- [Key design decision 1]
- [Key design decision 2]
- [Performance consideration]

Dependencies:
- [Dependency 1]: [Why needed]
- [Dependency 2]: [Why needed]

Example:
    >>> result = function(input)
    >>> result.status
    'success'
"""
```

---

## 7. Rules Summary

### DO ✅
- Clarify requirements before coding
- **Express disagreement with technical reasoning** before complying
- Wait for user approval before Phase 2
- Follow user's decision after expressing disagreement (if user insists)
- Write code and tests together (not TDD)
- Commit after backend, commit after frontend (two commits)
- Run all tests before each commit
- Add implementation notes
- Follow file naming conventions
- Use type hints everywhere
- Keep changes focused on single requirement
- Log session start/end times in `agent_work_log.md`

### DON'T ⛔
- Start coding without confirmed requirements
- **Silently disagree and comply** - always voice technical concerns
- Commit code without tests
- Skip the test-run-fix loop
- Use strict TDD (tests first) - it adds overhead for AI agents
- Change tests to make them pass (unless tests are wrong)
- Leave code without documentation
- Make commits without descriptive messages
- Ignore linter/type checker warnings
- Forget to log work sessions for metrics tracking

---

## 8. Quick Reference Card

```
┌─────────────────────────────────────────────────────────────────┐
│                    AI AGENT WORKFLOW CARD                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ══════════════════════════════════════════════════════════════ │
│  PHASE 1: REQUIREMENTS (requires user approval)                  │
│  ══════════════════════════════════════════════════════════════ │
│  1. 📋 CLARIFY   - Read requirement, ask questions               │
│  2. ✅ AGREE     - Present understanding, get "AGREE"            │
│     ⚠️ DISAGREE if needed - explain why, then follow decision   │
│  3. 📝 COMMIT    - Document specification                        │
│                                                                  │
│  ══════════════════════════════════════════════════════════════ │
│  PHASE 2: IMPLEMENTATION (atomic - no stopping)                  │
│  ══════════════════════════════════════════════════════════════ │
│  4. ⚙️ BACKEND   - Implement code + tests, run tests            │
│  5. 💾 COMMIT    - Save backend (rollback point)                 │
│  6. 🎨 FRONTEND  - Implement code + tests, run tests            │
│  7. ▶️ RUN ALL   - Execute all tests, fix failures              │
│  8. 💾 COMMIT    - Save frontend                                 │
│                                                                  │
│  ⚠️  NEVER skip Phase 1 (clarify, agree, commit spec)           │
│  ⚠️  NEVER proceed to Phase 2 without user "AGREE"              │
│  ⚠️  NEVER silently disagree - voice concerns first!            │
│  ⚠️  NEVER commit code without passing tests                    │
│  📊 LOG session start/end in agent_work_log.md                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 9. Testing Rules

### 9.1 Database for Tests

**CRITICAL: Always use PostgreSQL for tests, NEVER SQLite or in-memory databases.**

Rationale:
- Tests passing on SQLite but failing in production is extremely common
- SQLite doesn't support PostgreSQL-specific types: `JSONB`, `ARRAY`, `TSVECTOR`, etc.
- SQLite has different transaction semantics, constraint handling, and type coercion
- "Works on my machine" with SQLite → fails in production with PostgreSQL
- Using the same database engine in tests eliminates an entire class of bugs

**Test Database Setup:**
```bash
# Tests use: postgresql+asyncpg://aibpms:aibpms_secret@localhost:5442/aibpms_test
# Create test database:
psql -h localhost -p 5442 -U aibpms -c "CREATE DATABASE aibpms_test;"
```

**Why NOT SQLite:**
- ❌ `JSONB` columns fail to compile
- ❌ `ARRAY` types not supported
- ❌ No `FOR UPDATE` row locking
- ❌ Different `NULL` handling in unique constraints
- ❌ No concurrent write testing possible
- ❌ Case sensitivity differs from PostgreSQL

**Test Configuration:**
```python
# conftest.py - CORRECT
TEST_DATABASE_URL = "postgresql+asyncpg://user:pass@localhost:5442/app_test"

# conftest.py - WRONG (never do this)
# TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"  # NO!
```

### 9.2 Test Independence
- Each test must be independent (can run in any order)
- Use fixtures that create/destroy data per test
- Never rely on data from previous tests

### 9.3 Test Coverage Requirements
- Minimum 80% code coverage for new features
- All error paths must be tested
- Edge cases documented and tested

---

## 10. Exception Handling

### If Stuck
1. Explain what's blocking progress
2. Show what was tried
3. Ask user for guidance
4. Wait for response before continuing

### If Requirements Change Mid-Implementation
1. Stop current work
2. Document what's been done
3. Commit work-in-progress with `wip:` prefix
4. Restart from Stage 1 with new requirements

### If Tests Can't Pass
1. Analyze failure reason
2. Check if test is correct (discuss with user)
3. Check if requirement was misunderstood
4. If stuck for >15 minutes of attempts, ask user

### If User Unavailable
1. Complete current stage only
2. Commit progress
3. Document questions/blockers
4. Wait for user to return

---

## 11. Work Logging

### 11.1 Purpose

Track AI agent work sessions for:
- Billing analysis (correlate work time with token usage)
- Productivity metrics (tests per hour, features per session)
- Project planning (estimate future FR implementation time)

### 11.2 Log File

**Location**: `agent_work_log.md` (project root)

### 11.3 Session Protocol

**Starting a Session:**
1. User says: "Session start: [FR-X or task description]"
2. AI agent logs entry in `agent_work_log.md`:
   - Date
   - Start time (approximate from conversation)
   - FR/Task identifier
   - Initial description

**During Session:**
- Continue normal workflow (Stages 1-12)
- No additional logging required mid-session

**Ending a Session:**
1. User says: "Session end" OR conversation naturally concludes
2. AI agent updates log entry:
   - End time
   - Duration (calculated)
   - Tests added/fixed
   - Estimated tokens used
   - Estimated cost
   - Final status

### 11.4 Log Entry Format

```markdown
| Date | Start | End | Duration | FR/Task | Description | Tests | Est. Tokens | Est. Cost | Status |
|------|-------|-----|----------|---------|-------------|-------|-------------|-----------|--------|
| 2025-11-27 | 14:00 | 16:30 | 2.5h | FR-3 | Process Discovery implementation | +25 | ~200K | ~$8-12 | ✅ Complete |
```

### 11.4.1 Token & Cost Estimation

AI agents MUST estimate and log token usage and costs for each session.

**Estimation Heuristics:**
| Session Type | Est. Tokens | Est. Cost |
|--------------|-------------|-----------|
| Simple bug fix | ~50-100K | ~$2-5 |
| Medium feature (1-2h) | ~100-200K | ~$5-10 |
| Large feature (3-4h) | ~200-400K | ~$10-20 |
| Complex FR with many files | ~300-500K | ~$15-25 |

**Factors that increase tokens:**
- Large file reads (each file = thousands of tokens)
- Many tool calls (search, grep, etc.)
- Long context from previous conversation
- Multiple test file generations
- Error fixing loops

**Cost Calculation (Claude Opus 4, Nov 2025):**
- Input: $15/1M tokens
- Output: $75/1M tokens
- Typical ratio: 3:1 input:output
- Blended rate: ~$30/1M tokens

**How to Estimate:**
1. Track approximate hours worked
2. Multiply by ~50-80K tokens/hour (depending on complexity)
3. Apply blended rate for cost estimate
4. Round to nearest reasonable range (e.g., ~$8-12)

### 11.5 Automatic Logging Points

AI agents MUST update the log at these points:

1. **Session Start**: When user initiates work on a FR/task
2. **Session End**: When user ends session or conversation concludes
3. **FR Completion**: When a feature request is fully implemented
4. **Major Milestone**: When significant progress is made (e.g., all tests passing)

### 11.6 Metrics to Track

| Metric | How to Calculate | Purpose |
|--------|-----------------|----------|
| Time per FR | Sum of session durations | Estimate future work |
| Tests per Hour | Total tests / Total hours | Productivity metric |
| Sessions per FR | Count of sessions | Complexity indicator |
| Fix vs New Ratio | Bug fixes / New tests | Code quality indicator |
| Est. Tokens per FR | Sum of session token estimates | Cost tracking |
| Est. Cost per FR | Sum of session cost estimates | Budget planning |

### 11.7 Log Maintenance

- Keep summary tables updated (By Feature Request, Totals)
- Archive completed months to separate files if log grows large
- Never delete historical entries

### 11.8 Example Session Flow

```
User: "Session start: FR-3 Process Discovery"

AI Agent: 
1. Opens agent_work_log.md
2. Adds new row with date, start time, FR-3
3. Proceeds with Stage 1 (Clarify Requirements)
...
[Normal workflow continues]
...
User: "Session end"

AI Agent:
1. Updates log entry with end time, duration
2. Estimates tokens used: ~150K (based on session complexity)
3. Estimates cost: ~$6-9 (using blended rate)
4. Records tests added: +30
5. Records status: ✅ Complete (or 🔄 In Progress)
6. Confirms: "Session logged. Duration: 2.5h, Tests: +30, Est. Tokens: ~150K, Est. Cost: ~$6-9"
```

---

**Document Version**: 2.0  
**Date**: November 27, 2025  
**Status**: Active  
**Applies To**: All AI agents contributing to AI-BPMS
