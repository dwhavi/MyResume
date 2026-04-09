# Skill: AI Interview Question Generation

> [!NOTE]
> This skill is based on the `interview-prep` skill discovered via SkillsMP.

## Overview

Once a resume is tailored for a specific job, the next logical step for a user is interview preparation. This skill uses the JD-Resume pair to predict likely questions.

## Question Categories

1.  **Experience-Based**: "Tell me about your project X mentioned in the resume."
2.  **JD-Specific**: "This role requires Y skill. How have you applied Y in the past?"
3.  **Behavioral**: "Given the company culture, how would you handle Z?"
4.  **Gap-Focused**: "I see you don't have experience in W. How will you overcome this?"

## Implementation Pattern

### 1. The Prompt (STAR Method)

Ask the AI to provide answers in the STAR (Situation, Task, Action, Result) format to guide the user.

```typescript
const INTERVIEW_PREP_PROMPT = `
Based on the resume and JD provided:
1. Generate 5 highly likely interview questions.
2. For each question, provide a 'Winning Answer Strategy' based on the candidate's actual projects.
3. Suggest 3 keywords to emphasize in responses.
`;
```

### 2. Integration with Resume Editor

Add a "Prepare for Interview" button in the Resume Preview mode that triggers this analysis.

## UI/UX Considerations

- **Flashcards**: Present questions as cards that the user can flip to see the strategy.
- **Export to PDF**: Allow users to download an "Interview Prep Guide" alongside their resume.
- **Voice Feedback**: (Future) Use Speech-to-Text to let users practice their answers.

## Value Proposition

By adding this skill, **MyResume** transforms from a simple "Document Generator" to a comprehensive "Career Success Partner".