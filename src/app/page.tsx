'use client';

import React, { useState, useEffect } from 'react';
import Stepper from '@/components/Stepper';
import JobInput from '@/components/JobInput';
import ProfileForm from '@/components/ProfileForm';
import MatchScoreCard from '@/components/MatchScore';
import JobAnalyzer from '@/components/JobAnalyzer';
import AnalysisLoading from '@/components/AnalysisLoading';
import ResumePreview from '@/components/ResumePreview';
import { ProfileInput } from '@/schemas/profile';
import { saveToStorage, loadFromStorage, STORAGE_KEYS } from '@/lib/storage';
import { generateResume, ApiError } from '@/lib/api-client';
import { exportToPDF } from '@/lib/pdf';
import { JobAnalysis, MatchScore, ResumeContent } from '@/types';
import { Download, ChevronLeft, CheckCircle } from 'lucide-react';

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1);
  const [jobDescription, setJobDescription] = useState('');
  const [profile, setProfile] = useState<ProfileInput | null>(null);
  
  // 분석 결과 상태
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<JobAnalysis | null>(null);
  const [matchScore, setMatchScore] = useState<MatchScore | null>(null);
  const [resume, setResume] = useState<ResumeContent | null>(null);

  // 1. 초기 데이터 복원
  useEffect(() => {
    const savedJob = loadFromStorage<string>(STORAGE_KEYS.JOB_DESCRIPTION);
    const savedStep = loadFromStorage<number>(STORAGE_KEYS.CURRENT_STEP);
    const savedProfile = loadFromStorage<ProfileInput>(STORAGE_KEYS.PROFILE_DRAFT);
    const savedAnalysis = loadFromStorage<JobAnalysis>(STORAGE_KEYS.ANALYSIS_RESULT);
    const savedScore = loadFromStorage<MatchScore>(STORAGE_KEYS.MATCH_SCORE);
    const savedResume = loadFromStorage<ResumeContent>(STORAGE_KEYS.RESUME_RESULT);

    if (savedJob) setJobDescription(savedJob);
    if (savedStep) setCurrentStep(savedStep);
    if (savedProfile) setProfile(savedProfile);
    if (savedAnalysis) setAnalysis(savedAnalysis);
    if (savedScore) setMatchScore(savedScore);
    if (savedResume) setResume(savedResume);
  }, []);

  // 2. 상태 변경 시 저장 (자동 백업)
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.JOB_DESCRIPTION, jobDescription);
    saveToStorage(STORAGE_KEYS.CURRENT_STEP, currentStep);
  }, [jobDescription, currentStep]);

  // 3. 네비게이션 핸들러
  const handleJobNext = () => setCurrentStep(2);
  
  const handleProfileNext = async (data: ProfileInput) => {
    setProfile(data);
    saveToStorage(STORAGE_KEYS.PROFILE_DRAFT, data);
    
    // AI 분석 시작
    setIsAnalyzing(true);
    try {
      const result = await generateResume({
        jobDescription,
        profile: data,
      });

      // 결과 저장
      setAnalysis(result.analysis);
      setMatchScore(result.matchScore);
      setResume(result.resume.content);
      
      saveToStorage(STORAGE_KEYS.ANALYSIS_RESULT, result.analysis);
      saveToStorage(STORAGE_KEYS.MATCH_SCORE, result.matchScore);
      saveToStorage(STORAGE_KEYS.RESUME_RESULT, result.resume.content);
      
      // Step 3로 이동
      setCurrentStep(3);
    } catch (err) {
      const apiErr = err as ApiError;
      alert(`분석 중 오류가 발생했습니다: ${apiErr.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleToStep4 = () => {
    setCurrentStep(4);
  };

  // 분석 로딩 중일 때 표시
  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black">
        <AnalysisLoading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black flex flex-col items-center">
      {/* --- 헤더 --- */}
      <header className="w-full max-w-4xl py-12 px-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold tracking-widest uppercase">
            AI Powered Resume Builder
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
            MyResume
          </h1>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-xl">
            {currentStep === 3 ? '공고 분석 결과 대시보드' : '당신만을 위한 최적의 이력서 메이커'}
          </p>
        </div>
      </header>

      {/* --- 메인 콘텐츠 --- */}
      <main className="w-full max-w-4xl px-4 pb-24 flex-1">
        <Stepper currentStep={currentStep} />

        <div className="mt-12 transition-all duration-500">
          {currentStep === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
              <JobInput
                value={jobDescription}
                onChange={setJobDescription}
                onNext={handleJobNext}
              />
            </div>
          )}

          {currentStep === 2 && (
            <ProfileForm 
              onNext={handleProfileNext} 
              onPrev={handlePrev} 
            />
          )}

          {currentStep === 3 && analysis && matchScore && (
            <div className="space-y-12 pb-20">
              <MatchScoreCard matchScore={matchScore} />
              <JobAnalyzer 
                analysis={analysis} 
                onNext={handleToStep4} 
                onBack={handlePrev} 
              />
            </div>
          )}

          {currentStep === 4 && resume && (
             <div className="space-y-10 animate-in fade-in zoom-in-95 duration-500">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">이력서 생성이 완료되었습니다!</h2>
                      <p className="text-sm text-zinc-500">PDF로 다운로드하여 지원을 시작해 보세요.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => exportToPDF('resume-content', `Resume_${profile?.name || 'My'}`)}
                    className="flex items-center gap-2 px-8 py-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-black rounded-2xl hover:scale-105 transition-transform shadow-xl"
                  >
                    <Download className="w-5 h-5" /> PDF 다운로드
                  </button>
                </div>

                <ResumePreview content={resume} photo={profile?.photo} />

                <div className="flex justify-center pb-20">
                  <button 
                    onClick={handlePrev}
                    className="flex items-center gap-2 text-zinc-400 hover:text-zinc-600 font-bold transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" /> 분석 결과 다시 보기
                  </button>
                </div>
             </div>
          )}
        </div>
      </main>

      <footer className="py-12 border-t border-zinc-100 dark:border-zinc-900 w-full flex flex-col items-center gap-4">
        <p className="text-sm text-zinc-400 font-medium">© 2026 MyResume AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
