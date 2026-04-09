'use client';

import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProfileSchema, ProfileInput } from '@/schemas/profile';
import { Plus, Trash2, Camera, ChevronRight, ChevronLeft, Save, FileText, Upload, Loader2, AlertCircle, Download, FileUp } from 'lucide-react';
import { saveToStorage, loadFromStorage, STORAGE_KEYS } from '@/lib/storage';
import PhotoCrop from './PhotoCrop';
import { profileToMarkdown, downloadMarkdown } from '@/lib/profile-md';

interface ProfileFormProps {
  onNext: (data: ProfileInput) => void;
  onPrev: () => void;
}

export default function ProfileForm({ onNext, onPrev }: ProfileFormProps) {
  const [showPhotoCrop, setShowPhotoCrop] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<{ [key: string]: File | null }>({
    resume: null,
    experience: null,
    portfolio: null
  });
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  // 1. react-hook-form 초기화
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProfileInput>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      skills: [{ name: '', proficiency: '중' }],
      experiences: [{ company: '', title: '', startDate: '', bullets: [''] }],
      education: [{ school: '' }],
      projects: [],
    },
  });

  // 2. 동적 필드 배열 관리 (기술, 경력, 학력 등)
  const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray({
    control,
    name: 'skills',
  });

  const { fields: expFields, append: appendExp, remove: removeExp } = useFieldArray({
    control,
    name: 'experiences',
  });

  const { fields: eduFields } = useFieldArray({
    control,
    name: 'education',
  });

  // 3. 로컬 스토리지 데이터 복원
  useEffect(() => {
    const savedData = loadFromStorage<ProfileInput>(STORAGE_KEYS.PROFILE_DRAFT);
    if (savedData) {
      Object.entries(savedData).forEach(([key, value]) => {
        if (value !== undefined) {
          setValue(key as keyof ProfileInput, value);
        }
      });
    }
  }, [setValue]);

  // 4. 실시간 데이터 저장
  const watchedData = watch();
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.PROFILE_DRAFT, watchedData);
  }, [watchedData]);

  // 5. 사진 업로드 처리
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImage(reader.result as string);
        setShowPhotoCrop(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const currentPhoto = watch('photo');

  // --- PDF 분석 로직 (Unit 8) ---
  const handleFileChange = (type: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFiles(prev => ({ ...prev, [type]: file }));
    setErrorStatus(null);
  };

  const handleAnalyze = async () => {
    const filesArray = Object.values(selectedFiles).filter(f => f !== null) as File[];
    if (filesArray.length === 0) {
      setErrorStatus('분석할 파일을 하나 이상 선택해주세요.');
      return;
    }

    setIsAnalyzing(true);
    setErrorStatus(null);

    try {
      const formData = new FormData();
      filesArray.forEach(file => formData.append('files', file));

      const res = await fetch('/api/resumes/parse-pdf', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error?.message || '분석 중 오류 발생');

      if (window.confirm('AI가 분석한 내용으로 프로필을 자동 완성하시겠습니까? (기존 내용은 덮어씌워집니다.)')) {
        reset(result.data);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'PDF 분석 중 오류가 발생했습니다.';
      setErrorStatus(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // --- Markdown 파일 처리 (Unit 9) ---
  const handleExportMarkdown = () => {
    const name = watch('name') || '이름없음';
    const date = new Date().toISOString().split('T')[0];
    const fileName = `프로필_${name}_${date}.md`;
    const content = profileToMarkdown(watchedData);
    downloadMarkdown(content, fileName);
  };

  const handleImportMarkdown = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    setErrorStatus(null);

    try {
      const markdown = await file.text();
      const res = await fetch('/api/resumes/parse-markdown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markdown }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error?.message || 'Markdown 분석 실패');

      if (window.confirm('저장된 Markdown 파일에서 데이터를 불러올까요? (기존 내용은 덮어씌워집니다.)')) {
        reset(result.data);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Markdown 분석 실패';
      setErrorStatus(errorMessage);
    } finally {
      setIsAnalyzing(false);
      e.target.value = '';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 pb-32 pt-8 px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">프로필 정보 입력</h2>
        <p className="text-zinc-500 dark:text-zinc-400">당신의 빛나는 경력을 빠짐없이 기록해주세요.</p>
      </div>

      <form onSubmit={handleSubmit(onNext)} className="space-y-12">
        {/* --- [Unit 8/9] AI 및 파일 관리 대시보드 --- */}
        <section className="bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/20 dark:to-zinc-900 p-8 rounded-3xl border border-indigo-100 dark:border-indigo-900/50 shadow-sm overflow-hidden relative">
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-lg">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">AI 프로필 도우미</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">기존 파일(PDF, MD)을 활용하여 프로필을 지능적으로 채워보세요.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: 'resume', label: '이력서', icon: FileText },
                { id: 'experience', label: '경력기술서', icon: Save },
                { id: 'portfolio', label: '포트폴리오', icon: Upload }
              ].map((item) => (
                <div key={item.id} className="relative">
                  <label className={`flex flex-col items-center justify-center p-4 h-28 rounded-2xl border-2 border-dashed transition-all cursor-pointer ${
                    selectedFiles[item.id] ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/10' : 'border-zinc-200 dark:border-zinc-800 hover:border-indigo-300'
                  }`}>
                    <item.icon className={`w-5 h-5 mb-1 ${selectedFiles[item.id] ? 'text-indigo-600' : 'text-zinc-400'}`} />
                    <span className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400">{item.label}</span>
                    <span className="text-[9px] text-zinc-400 mt-0.5 truncate max-w-full px-2">
                      {selectedFiles[item.id] ? selectedFiles[item.id]?.name : '선택 (PDF)'}
                    </span>
                    <input type="file" accept=".pdf" className="hidden" onChange={(e) => handleFileChange(item.id, e)} />
                  </label>
                </div>
              ))}
            </div>

            <div className="flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full py-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> 분석 중...</>
                ) : (
                  <><Save className="w-5 h-5" /> PDF 파일로 자동 완성</>
                )}
              </button>
              {errorStatus && (
                <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" /> {errorStatus}
                </p>
              )}
            </div>

            <div className="pt-4 border-t border-indigo-100 dark:border-indigo-900/30 flex flex-wrap gap-2 justify-center">
              <button
                type="button"
                onClick={handleExportMarkdown}
                className="px-3 py-2 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[11px] font-bold rounded-xl border border-zinc-200 dark:border-zinc-700 flex items-center gap-2 hover:bg-zinc-50 transition-all"
              >
                <Download className="w-3.5 h-3.5" /> .md 내보내기
              </button>
              <label className="px-3 py-2 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[11px] font-bold rounded-xl border border-zinc-200 dark:border-zinc-700 flex items-center gap-2 hover:bg-zinc-50 transition-all cursor-pointer">
                <FileUp className="w-3.5 h-3.5" /> .md 불러오기
                <input type="file" accept=".md" className="hidden" onChange={handleImportMarkdown} />
              </label>
            </div>
          </div>
        </section>

        {/* --- 기본 인적사항 --- */}
        <section className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 space-y-6">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="relative group">
              <div className="w-32 h-44 bg-zinc-100 dark:bg-zinc-800 rounded-xl overflow-hidden border-2 border-dashed border-zinc-200 dark:border-zinc-700 flex items-center justify-center transition-all group-hover:border-indigo-400">
                {currentPhoto ? (
                  <img src={currentPhoto} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-8 h-8 text-zinc-300 dark:text-zinc-600" />
                )}
              </div>
              <label className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-2 rounded-lg cursor-pointer shadow-lg hover:bg-indigo-700 transition-colors">
                <Plus className="w-4 h-4" />
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
              </label>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">이름</label>
                <input
                  {...register('name')}
                  placeholder="홍길동"
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:bg-zinc-800"
                />
                {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">연락처</label>
                <input
                  {...register('phone')}
                  placeholder="010-1234-5678"
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:bg-zinc-800"
                />
                {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">이메일</label>
                <input
                  {...register('email')}
                  placeholder="example@email.com"
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:bg-zinc-800"
                />
                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">자기소개 핵심 요약</label>
            <textarea
              {...register('summary')}
              placeholder="자신의 핵심 역량과 가치관을 한 문장으로 표현해보세요."
              className="w-full px-4 py-3 min-h-[100px] rounded-xl border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:bg-zinc-800 resize-none"
            />
            {errors.summary && <p className="text-xs text-red-500">{errors.summary.message}</p>}
          </div>
        </section>

        {/* --- 기술 스택 --- */}
        <section className="space-y-4">
          <div className="flex justify-between items-end">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 italic">Core Skills</h3>
            <button
              type="button"
              onClick={() => appendSkill({ name: '', proficiency: '중' })}
              className="text-indigo-600 hover:text-indigo-700 text-sm font-semibold flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> 기술 추가
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {skillFields.map((field, index) => (
              <div key={field.id} className="relative group">
                <div className="flex gap-2 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700 transition-all hover:shadow-md">
                  <input
                    {...register(`skills.${index}.name`)}
                    placeholder="React, SQL 등"
                    className="flex-1 bg-transparent border-none outline-none text-sm font-medium"
                  />
                  <select
                    {...register(`skills.${index}.proficiency`)}
                    className="bg-zinc-200 dark:bg-zinc-700 px-2 py-1 rounded text-[10px] font-bold outline-none"
                  >
                    <option value="상">상</option>
                    <option value="중">중</option>
                    <option value="하">하</option>
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => removeSkill(index)}
                  className="absolute -top-2 -right-2 bg-white dark:bg-zinc-800 text-red-400 p-1 rounded-full border border-zinc-100 dark:border-zinc-700 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* --- 경력 사항 --- */}
        <section className="space-y-6">
          <div className="flex justify-between items-end">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Work Experience</h3>
            <button
              type="button"
              onClick={() => appendExp({ company: '', title: '', startDate: '', bullets: [''] })}
              className="text-indigo-600 hover:text-indigo-700 text-sm font-semibold flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> 경력 추가
            </button>
          </div>
          <div className="space-y-4">
            {expFields.map((field, index) => (
              <div key={field.id} className="relative p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 group transition-all hover:border-indigo-100 dark:hover:border-zinc-700">
                <button
                  type="button"
                  onClick={() => removeExp(index)}
                  className="absolute top-4 right-4 text-zinc-300 hover:text-red-400 p-2 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">회사명</label>
                    <input
                      {...register(`experiences.${index}.company`)}
                      className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-700 py-1 focus:border-indigo-500 outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">직책</label>
                    <input
                      {...register(`experiences.${index}.title`)}
                      className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-700 py-1 focus:border-indigo-500 outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">시작일</label>
                    <input
                      {...register(`experiences.${index}.startDate`)}
                      placeholder="YYYY-MM"
                      className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-700 py-1 focus:border-indigo-500 outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">종료일</label>
                    <input
                      {...register(`experiences.${index}.endDate`)}
                      placeholder="YYYY-MM (진행 중일 경우 비움)"
                      className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-700 py-1 focus:border-indigo-500 outline-none transition-colors"
                    />
                  </div>
                </div>
                
                <div className="mt-8 space-y-4">
                   <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center justify-between">
                    주요 성과 및 업무
                    <button 
                      type="button"
                      onClick={() => {
                        const current = watch(`experiences.${index}.bullets`) || [];
                        setValue(`experiences.${index}.bullets`, [...current, '']);
                      }}
                      className="text-indigo-500 hover:underline text-[10px]"
                    >+ 항목 추가</button>
                   </label>
                   <div className="space-y-2">
                    {watch(`experiences.${index}.bullets`)?.map((_, bIdx) => (
                      <div key={bIdx} className="flex gap-2 items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                        <input 
                          {...register(`experiences.${index}.bullets.${bIdx}`)}
                          className="flex-1 bg-transparent border-none outline-none text-sm py-1"
                        />
                      </div>
                    ))}
                   </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- 하단 네비게이션 --- */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-lg border-t border-zinc-100 dark:border-zinc-800 flex justify-center gap-4 z-50">
          <div className="w-full max-w-4xl flex gap-4">
            <button
              type="button"
              onClick={onPrev}
              className="flex-1 max-w-[200px] py-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all"
            >
              <ChevronLeft className="w-5 h-5" /> 이전
            </button>
            <button
              type="submit"
              className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 dark:shadow-none translate-y-0 active:translate-y-1"
            >
              다음 단계로 <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </form>

      {/* --- 사진 크롭 모달 --- */}
      {showPhotoCrop && tempImage && (
        <PhotoCrop
          imageSrc={tempImage}
          onCropComplete={(cropped) => {
            if (cropped) {
              setValue('photo', cropped);
              setShowPhotoCrop(false);
            }
          }}
          onCancel={() => setShowPhotoCrop(false)}
        />
      )}
    </div>
  );
}
