# Skill: AI Resume Data Extraction (Parsing)

> [!NOTE]
> This skill is based on the `resume-extractor` discovered via SkillsMP.

## Overview

Resume Parsing is the process of converting an unstructured resume (PDF, Word, Image) into a structured JSON format that can be used to autopopulate the user's profile.

## Key Components

1.  **Text Extraction**: Converting PDF/Images to raw text.
2.  **Schema Definition**: Using Zod to define the target structure (Profile, Education, Experience).
3.  **LLM Processing**: Using Gemini/OpenAI to map raw text to the schema.

## Implementation Pattern

### 1. PDF Text Extraction (Client-side or Server-side)

For simple text-based PDFs, use `pdf-parse` (server) or `pdfjs-dist` (client).

### 2. LLM Prompting for Extraction

```typescript
const EXTRACTION_PROMPT = `
Extract detailed professional information from the text below into the provided JSON schema.
- Languages: Support both Korean and English.
- Dates: Normalize to YYYY.MM format.
- Missing Info: Leave as null or empty array.

Raw Text:
{{rawText}}
`;
```

### 3. Verification & Correction (GR-4)

Always let the user review extracted data. AI can hallucinate dates or job titles.

```typescript
// Example Zod Schema for Extraction
export const ResumeExtractionSchema = z.object({
  personal: z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string()
  }),
  experience: z.array(z.object({
    company: z.string(),
    position: z.string(),
    period: z.string(),
    description: z.array(z.string())
  })),
  skills: z.array(z.string())
});
```

## Workflow in MyResume

1.  **Upload**: User uploads `.pdf` or `.docx`.
2.  **Extract**: Server extracts text and sends to Gemini.
3.  **Parse**: Gemini returns JSON matching `ProfileSchema`.
4.  **Populate**: The `ProfileForm` is filled with the returned data for user confirmation.
