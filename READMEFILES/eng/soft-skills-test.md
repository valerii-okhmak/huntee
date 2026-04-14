# Soft Skills Test Logic & Evaluation Flow

## 1. General Description

The **Soft Skills Test** is an interactive assessment tool (based on Situational Judgment Tests - SJTs) designed to evaluate the candidate's level of soft skills development: communication, emotional intelligence (EQ), teamwork, adaptability, and time management.

Unlike the career test, where the goal is to find a single correct direction, the Soft Skills test creates a **multidimensional profile** of the user, evaluating various competencies simultaneously.

## 2. Core Test Logic

1. The user starts the assessment.
2. The system generates a workplace scenario (case study) with several behavioral response options.
3. The user selects the option that best reflects their natural behavior.
4. Each answer contains hidden weight coefficients that add or subtract points from specific competencies.
5. The process continues until all core skills are evaluated.
6. Upon completion, the system generates a "Competency Radar" (radar chart) and a text-based summary.

## 3. Situational Judgment Logic (SJT Model)

Each question is a mini-story, and the answer choices represent behavioral patterns.

**Scenario Logic Example:**

* **Scenario 1 (Conflict / Communication):** *A day before the release, you notice a critical bug in the code of a colleague who has already gone home. What do you do?*
  * **Option A (Proactivity + Teamwork):** Fix the bug yourself if you have the competence, and leave a friendly comment for your colleague for tomorrow. *(Teamwork +2, Problem-solving +2)*
  * **Option B (Communication / Escalation):** Message the PM and the colleague about the issue, suggest potential solutions, and wait for instructions. *(Communication +2, Teamwork +1)*
  * **Option C (Aggression / Blaming):** Fix the bug and write an angry message in the general chat about the colleague's incompetence. *(Problem-solving +1, Teamwork -2, EQ -2)*
  * **Option D (Avoidance):** Do nothing, as it is not your area of responsibility. *(Proactivity -2, Teamwork -2)*

## 4. Scoring Logic (Weighted Competency Matrix)

Instead of a linear decision tree, a **Competency Matrix** is used here. 
A single answer can impact multiple skills simultaneously.

**Core competencies measured:**
- Communication
- Teamwork
- Problem-solving
- Emotional Intelligence (EQ)
- Adaptability

## 5. Logic Implementation Options

### Option 1 — Static SJT (Basic Implementation)
A fixed set of 15-20 questions that all candidates take.
- **Pros:** Easy to develop, identical conditions for all candidates (easy to compare).
- **Cons:** Candidates might "memorize" the correct answers upon retaking the test.

### Option 2 — Adaptive Difficulty
If the system detects a candidate scoring low in "Communication," it automatically serves another, more complex or ambiguous question from the same category to verify.
- **Pros:** Highly accurate psychological profiling.
- **Cons:** Complex backend logic development.

### ⭐️ Recommended Solution — Randomized Scenario Pools + Weighted Matrix
A combined approach:
- The database contains "pools" of questions for each competency (e.g., 10 questions on conflicts, 10 on time management).
- The system randomly selects 3 questions from each pool for a specific candidate.
- Answers are evaluated using a Weighted Point Matrix.

## 6. Data Stored by the System

To build the profile and prevent cheating, the system logs:
- `user_id`
- `scenario_id`
- `selected_action`
- `time_taken` *(crucial: if a user answers complex moral dilemmas too quickly, it may indicate dishonesty or random clicking)*
- `competency_deltas` (JSON with score changes, e.g., `{"teamwork": 2, "eq": -1}`)
- `timestamp`

## 7. Acceptance Criteria (AC)

- [ ] Situational scenario (SJT) rendering mechanism is implemented.
- [ ] Weight coefficients (positive and negative) are linked to each answer option.
- [ ] Scores accurately accumulate across skill categories during the test.
- [ ] The system logs the time (`time_taken`) spent on each question.
- [ ] Upon completion, a percentage score is generated for each of the 5 core competencies.

## 8. Expected Result

After completing the test, both the company and the candidate receive a visualized Soft Skills profile:

> **Your Soft Skills Profile:**
> - Communication: 85%
> - Teamwork: 90%
> - Problem-solving: 60%
> - Adaptability: 70%
> - Emotional Intelligence (EQ): 40%
> 
> **Brief Summary:** You are an excellent team player with strong communication skills, but you may find it difficult to work under high stress and emotional pressure (requires EQ development).