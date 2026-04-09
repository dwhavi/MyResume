# Skill: firecrawl-scraper

> [!NOTE]
> Official description and usage guide for the Firecrawl-based web scraping skill.

## Metadata
- **Name**: firecrawl-scraper
- **Description**: Deep web scraping, screenshots, PDF parsing, and website crawling using Firecrawl API. Use when you need deep content extraction from web pages, page interaction is required (clicking, scrolling, etc.), or you want screenshots or PDF parsing.
- **Source**: Community
- **Date Added**: 2026-02-27

## Overview
Deep web scraping, screenshots, PDF parsing, and website crawling using Firecrawl API.

## When to Use
- When you need deep content extraction from web pages.
- When page interaction is required (clicking, scrolling, etc.).
- When you want screenshots or PDF parsing.
- When batch scraping multiple URLs.

## Installation
```bash
npx skills add -g BenedictKing/firecrawl-scraper
```

## Step-by-Step Guide
1. Install the skill using the command above.
2. Configure your Firecrawl API key in your environment variables.
3. Use naturally in Claude Code or other agentic AI conversations.

## Examples
See the [GitHub Repository](https://github.com/BenedictKing/firecrawl-scraper) for examples and advanced usage.

## Best Practices
- **Environment Variables**: Always configure API keys via environment variables, never hardcode them in the source.
- **Rate Limiting**: Be mindful of your Firecrawl plan limits when batch scraping.

## Troubleshooting
Refer to the GitHub repository for troubleshooting guides and known issues.

## Related Skills
- `context7-auto-research`
- `tavily-web`
- `exa-search`
- `codex-review`