'use client';

import React from 'react';
import type { ResumeContent } from '@/types';
import { Mail, Phone, Calendar, Briefcase, GraduationCap, Code, Award, ExternalLink } from 'lucide-react';

interface ResumePreviewProps {
  content: ResumeContent;
  photo?: string | null;
}

export default function ResumePreview({ content, photo }: ResumePreviewProps) {
  const {
    name,
    phone,
    email,
    summary,
    education,
    experiences,
    techStack,
    projects,
    certifications,
  } = content;

  return (
    <div className="w-full flex justify-center py-8 bg-zinc-100 dark:bg-zinc-800 px-4">
      {/* --- A4 용지 규격 비율 컨테이너 --- */}
      <div
        id="resume-content"
        className="w-full max-w-[210mm] bg-white text-zinc-900 shadow-2xl p-[15mm] sm:p-[20mm] min-h-[297mm] font-sans overflow-hidden"
      >
        {/* --- 헤더: 인적사항 --- */}
        <header className="flex gap-8 items-start border-b-2 border-zinc-900 pb-8 mb-10">
          {photo && (
            <div className="w-32 h-44 bg-zinc-100 shrink-0 overflow-hidden border border-zinc-200">
              <img src={photo} alt={name} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex-1 space-y-4">
            <h1 className="text-4xl font-black tracking-tight uppercase">{name}</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-sm text-zinc-600 font-medium">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-zinc-400" /> {email}
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-zinc-400" /> {phone}
              </div>
            </div>
            <div className="pt-2">
              <p className="text-sm leading-relaxed text-zinc-700 font-medium bg-zinc-50 p-4 border-l-4 border-zinc-900">
                {summary}
              </p>
            </div>
          </div>
        </header>

        <div className="space-y-12">
          {/* --- 기술 스택 --- */}
          <section>
            <h2 className="text-lg font-black uppercase tracking-widest border-b border-zinc-200 mb-4 flex items-center gap-2">
              <Code className="w-5 h-5" /> 핵심 기술 역량
            </h2>
            <div className="flex flex-wrap gap-2">
              {techStack.map((skill) => (
                <span key={skill} className="px-3 py-1 bg-zinc-100 text-zinc-800 text-xs font-bold rounded">
                  {skill}
                </span>
              ))}
            </div>
          </section>

          {/* --- 경력 사항 --- */}
          <section>
            <h2 className="text-lg font-black uppercase tracking-widest border-b border-zinc-200 mb-6 flex items-center gap-2">
              <Briefcase className="w-5 h-5" /> 주요 프로젝트 및 경력
            </h2>
            <div className="space-y-10">
              {experiences.map((exp, idx) => (
                <div key={idx} className="space-y-3">
                  <div className="flex justify-between items-end">
                    <div>
                      <h3 className="text-xl font-bold">{exp.company}</h3>
                      <p className="text-sm font-black text-indigo-600 uppercase tracking-wide">{exp.title}</p>
                    </div>
                    <span className="text-xs font-bold text-zinc-400 bg-zinc-50 px-2 py-1 rounded border">
                      {exp.period}
                    </span>
                  </div>
                  <ul className="space-y-2 pl-4">
                    {exp.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="text-sm text-zinc-600 list-disc leading-relaxed">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* --- 주요 프로젝트 (별도 기재 시) --- */}
          {projects.length > 0 && (
            <section>
              <h2 className="text-lg font-black uppercase tracking-widest border-b border-zinc-200 mb-6 flex items-center gap-2">
                <ExternalLink className="w-5 h-5" /> 추가 프로젝트 경험
              </h2>
              <div className="grid grid-cols-1 gap-8">
                {projects.map((project, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="text-md font-bold text-zinc-900">{project.name}</h3>
                      {project.period && <span className="text-[10px] text-zinc-400 font-bold">{project.period}</span>}
                    </div>
                    <p className="text-sm text-zinc-600 leading-relaxed italic">{project.description}</p>
                    {project.techStack && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {project.techStack.map((s) => (
                          <span key={s} className="text-[10px] bg-zinc-50 text-zinc-400 px-1.5 py-0.5 rounded border border-zinc-100">
                             #{s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* --- 학력 및 자격 사항 --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-4">
            <section>
              <h2 className="text-sm font-black uppercase tracking-widest border-b border-zinc-200 mb-4 flex items-center gap-2">
                <GraduationCap className="w-4 h-4" /> 교육 및 학력
              </h2>
              <div className="space-y-4">
                {education.map((edu, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <h3 className="text-sm font-bold">{edu.school}</h3>
                    <p className="text-xs text-zinc-500">
                      {edu.degree} {edu.field && ` - ${edu.field}`}
                    </p>
                    {edu.year && <p className="text-[10px] text-zinc-400">{edu.year}</p>}
                  </div>
                ))}
              </div>
            </section>

            {certifications && certifications.length > 0 && (
              <section>
                <h2 className="text-sm font-black uppercase tracking-widest border-b border-zinc-200 mb-4 flex items-center gap-2">
                  <Award className="w-4 h-4" /> 자격 및 수상
                </h2>
                <ul className="space-y-2">
                  {certifications.map((cert, idx) => (
                    <li key={idx} className="text-xs text-zinc-600 flex items-center gap-2">
                      <div className="w-1 h-1 bg-zinc-900 rounded-full" /> {cert}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>

        {/* --- 푸터 --- */}
        <footer className="mt-20 pt-8 border-t border-zinc-100 text-center">
          <p className="text-[10px] text-zinc-300 font-medium tracking-widest uppercase">
            Generated by MyResume AI • 2026
          </p>
        </footer>
      </div>
    </div>
  );
}
