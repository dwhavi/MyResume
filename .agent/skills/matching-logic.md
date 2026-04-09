# Skill: AI Match Score & Gap Analysis

> [!NOTE]
> This skill is based on the `job-matching` and `resume-matcher` skills discovered via SkillsMP.

## Overview

The Match Score is a quantitative metric (0-100) representing how well a candidate's profile aligns with a specific job description. Gap Analysis identifies missing skills or mismatched experiences.

## Scoring Logic Architecture

1.  **Multi-Dimensional Scoring**: Don't just look for keywords.
    - **Technical Fit (50%)**: Match between `techStack` and requirements.
    - **Experience Fit (30%)**: Years of experience and domain relevance.
    - **Soft Skills / Cultural Fit (20%)**: Intro/Bio alignment with company values.

2.  **Gap Analysis Algorithm**:
    - **Mandatory Gaps**: Missing "Must-have" requirements.
    - **Preferred Gaps**: Missing "Nice-to-have" skills.
    - **Over-qualifications**: Skills that exceed the JD requirements.

## Prompt Engineering for Scoring

```typescript
const MATCH_ANALYSIS_PROMPT = `
Analyze the alignment between the Candidate Profile and the Job Description.
Provide a detailed matching report in JSON format:

1. matchScore: 0-100 integer.
2. strengths: Top 3 reasons why this candidate is a good fit.
3. gaps: Missing skills or experiences that the candidate should address.
4. recommendations: Actionable advice to improve the resume for this specific role.
`;
```

## Visualizing Results (UI/UX)

- **Radial Progress**: Show the total score prominently.
- **Categorized Cards**: Strengths vs Gaps (Green vs Red).
- **Interactive Highlighting**: Highlight matching tech keywords in the Resume Preview.

## Quality Control (GR-5)

If the AI fails to generate a score, default to a basic keyword matching count or a "Processing Error" with a manual checklist for the user.