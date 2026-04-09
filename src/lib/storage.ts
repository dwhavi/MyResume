// Lib Layer — sessionStorage/localStorage 타입 안전 유틸
// SSR 환경(서버사이드)에서 안전하게 동작하도록 typeof window 체크

const isBrowser = () => typeof window !== 'undefined';

// ─── sessionStorage (탭 유지 중) ────────────────────────────────────────────

export function sessionSet<T>(key: string, value: T): void {
  if (!isBrowser()) return;
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.error(`[storage] sessionSet 실패: ${key}`);
  }
}

export function sessionGet<T>(key: string): T | null {
  if (!isBrowser()) return null;
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function sessionRemove(key: string): void {
  if (!isBrowser()) return;
  sessionStorage.removeItem(key);
}

// ─── localStorage (영구 저장) ────────────────────────────────────────────────

export function localSet<T>(key: string, value: T): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.error(`[storage] localSet 실패: ${key}`);
  }
}

export function localGet<T>(key: string): T | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function localRemove(key: string): void {
  if (!isBrowser()) return;
  localStorage.removeItem(key);
}

// ─── 앱 전용 스토리지 키 상수 ────────────────────────────────────────────────

export const saveToStorage = sessionSet;
export const loadFromStorage = sessionGet;

export const STORAGE_KEYS = {
  JOB_DESCRIPTION: 'mr_job_description',
  PROFILE_DRAFT: 'mr_profile_draft',
  PROFILE_SAVED: 'mr_profile_saved',   // localStorage — 재방문 시 복원
  CURRENT_STEP: 'mr_current_step',
  ANALYSIS_RESULT: 'mr_analysis_result',
  MATCH_SCORE: 'mr_match_score',
  RESUME_RESULT: 'mr_resume_result',
} as const;
