import { ProfileInput } from '@/schemas/profile';

/**
 * ProfileInput 데이터를 구조화된 Markdown 문자열로 변환합니다.
 */
export function profileToMarkdown(data: ProfileInput): string {
  const now = new Date().toISOString().split('T')[0];
  
  // 1. YAML Frontmatter (구조화된 데이터 보존용)
  const frontmatter = `---
type: MyResumeProfile
version: 1.0
exportedAt: ${now}
name: "${data.name || ''}"
email: "${data.email || ''}"
phone: "${data.phone || ''}"
---`;

  // 2. Markdown 본문 (사람이 읽기 좋은 형식)
  let markdown = `${frontmatter}\n\n# ${data.name || '이름 없음'} - 프로필 요약\n\n`;

  if (data.summary) {
    markdown += `## 📝 한 줄 소개\n${data.summary}\n\n`;
  }

  if (data.skills && data.skills.length > 0) {
    markdown += `## 🛠️ 기술 스택\n`;
    data.skills.forEach(skill => {
      markdown += `- **${skill.name}** (${skill.proficiency})\n`;
    });
    markdown += `\n`;
  }

  if (data.experiences && data.experiences.length > 0) {
    markdown += `## 💼 경력 사항\n`;
    data.experiences.forEach(exp => {
      markdown += `### ${exp.company} | ${exp.title}\n`;
      markdown += `*기간: ${exp.startDate} ~ ${exp.endDate || '현재'}*\n\n`;
      if (exp.bullets && exp.bullets.length > 0) {
        exp.bullets.forEach(bullet => {
          if (bullet.trim()) markdown += `- ${bullet}\n`;
        });
      }
      markdown += `\n`;
    });
  }

  if (data.education && data.education.length > 0) {
    markdown += `## 🎓 학력 사항\n`;
    data.education.forEach(edu => {
      markdown += `- ${edu.school}\n`;
    });
    markdown += `\n`;
  }

  if (data.projects && data.projects.length > 0) {
    markdown += `## 🚀 주요 프로젝트\n`;
    data.projects.forEach(project => {
      markdown += `### ${project.name}\n`;
      if (project.role) markdown += `*역할: ${project.role}*\n\n`;
      if (project.description) markdown += `${project.description}\n`;
      if (project.techStack && project.techStack.length > 0) {
        markdown += `기술 스택: ${project.techStack.join(', ')}\n`;
      }
      markdown += `\n`;
    });
  }

  return markdown;
}

/**
 * 브라우저에서 문자열을 파일로 다운로드합니다.
 */
export function downloadMarkdown(content: string, fileName: string) {
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
