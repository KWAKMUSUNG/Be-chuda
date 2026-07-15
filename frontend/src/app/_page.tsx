'use client';

import { useState, useEffect } from 'react';

interface DiagnosticLog {
  id: number;
  userName: string;
  timestamp: string;
  riskLevel: string;
  issueDetails: string;
  score: number;
}

export default function Home() {
  const [userName, setUserName] = useState('');
  const [rrn, setRrn] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [logs, setLogs] = useState<DiagnosticLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    detections: string[];
    leakFound: boolean;
    detectedSource: string;
  } | null>(null);

  const BACKEND_URL = 'http://localhost:3000'; // 👈 백엔드 API 서버 포트 명시!

  // 1. 실시간 진단 로그 불러오기 (백엔드 통신)
  const fetchLogs = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/diagnostic/logs`);
      if (response.ok) {
        const data = await response.json();
        setLogs(data);
      } else {
        console.error('서버 로그 조회 실패');
      }
    } catch (error) {
      console.error('로그 조회 중 오류 발생:', error);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // 2. 가상 유출 DB 비교 및 분석 시작
  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !rrn) {
      alert('이름과 주민등록번호는 필수 분석 대상입니다.');
      return;
    }

    setLoading(true);
    setResult(null);

    // 사용자가 입력한 본문 정보 조합 (백엔드 분석 타겟 텍스트)
    const combinedText = `이름: ${userName}, 주민등록번호: ${rrn}, 이메일: ${email}, 비밀번호: ${password}`;

    try {
      const response = await fetch(`${BACKEND_URL}/diagnostic/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName: userName,
          text: combinedText,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setResult({
          score: data.score,
          detections: data.detections,
          leakFound: data.leakFound,
          detectedSource: data.detectedSource,
        });
        // 분석 완료 후 이력 로그 목록 최신화
        fetchLogs();
      } else {
        alert('분석 요청 중 서버 에러가 발생했습니다.');
      }
    } catch (error) {
      console.error('분석 중 오류 발생:', error);
      alert('백엔드 서버와 통신할 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans p-6 md:p-12">
      {/* 헤더 영역 */}
      <header className="max-w-6xl mx-auto mb-10 flex items-center justify-between border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-teal-400">Be-chuda (비추다)</h1>
          <p className="text-sm text-zinc-400 mt-1">CPPG 관점의 개인정보 유출 실시간 정밀 진단 시스템</p>
        </div>
        <span className="px-3 py-1 text-xs font-semibold text-teal-400 bg-teal-950/50 border border-teal-800 rounded-full">
          가상 유출 DB 연동 활성화
        </span>
      </header>

      {/* 메인 콘텐츠 대시보드 */}
      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* 왼쪽: 개인정보 입력 및 진단 폼 (7컬럼) */}
        <section className="lg:col-span-7 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            🔑 개인정보 진단 및 입력 폼
          </h2>

          <form onSubmit={handleAnalyze} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">검사자 이름</label>
              <input
                type="text"
                placeholder="예: 홍길동"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-teal-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">주민등록번호 (13자리)</label>
              <input
                type="text"
                placeholder="예: 950101-1234567"
                value={rrn}
                onChange={(e) => setRrn(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-teal-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">이메일 계정</label>
              <input
                type="email"
                placeholder="예: gildong@naver.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-teal-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">비밀번호</label>
              <input
                type="password"
                placeholder="가입 시 자주 쓰는 비밀번호 입력"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-teal-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-teal-500 hover:bg-teal-600 text-black font-semibold rounded-xl transition-colors mt-6 shadow-lg shadow-teal-500/20 disabled:opacity-50"
            >
              {loading ? '가상 유출 DB 실시간 조회 및 분석 중...' : '유출 여부 분석 및 점검 시작'}
            </button>
          </form>

          {/* 실시간 검사 리포트 출력 창 */}
          {result && (
            <div className="mt-8 p-6 bg-zinc-950 border border-zinc-800 rounded-xl">
              <h3 className="text-lg font-semibold mb-4 text-teal-400">🛡️ 실시간 개인정보 유출 검사 결과</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-800">
                  <span className="text-xs text-zinc-500 block mb-1">진단 벌점</span>
                  <span className={`text-2xl font-bold ${result.score >= 80 ? 'text-red-500' : result.score >= 30 ? 'text-yellow-500' : 'text-green-500'}`}>
                    {result.score}점
                  </span>
                </div>
                <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-800">
                  <span className="text-xs text-zinc-500 block mb-1">통제 등급</span>
                  <span className={`text-xl font-bold ${result.score >= 80 ? 'text-red-500' : result.score >= 30 ? 'text-yellow-500' : 'text-green-500'}`}>
                    {result.score >= 80 ? '🚨 즉시 통제' : result.score >= 30 ? '⚠️ 안전성 주의' : '✅ 안전'}
                  </span>
                </div>
              </div>

              {result.leakFound && (
                <div className="mb-4 p-3 bg-red-950/30 border border-red-900 text-red-400 text-sm rounded-lg">
                  ❌ <strong>[유출 경보]</strong> 입력한 정보가 가상 DB 내 <strong>{result.detectedSource}</strong> 유출 건과 정확히 일치합니다! 신속한 비밀번호 변경 및 계정 보호 조치가 요구됩니다.
                </div>
              )}

              <div>
                <span className="text-xs text-zinc-500 block mb-1">진단 및 검출 내역</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {result.detections.map((det, idx) => (
                    <span key={idx} className="px-3 py-1 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-md text-xs">
                      {det}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* 오른쪽: 가상 DB 및 실시간 모니터링 로그 (5컬럼) */}
        <section className="lg:col-span-5 flex flex-col gap-6">
          
          {/* 최근 진단 모니터링 로그 */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex-1 flex flex-col">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              📊 최신 진단 이력 통계 로그
            </h2>
            
            <div className="space-y-3 overflow-y-auto max-h-[450px] pr-2 flex-1">
              {logs.length === 0 ? (
                <p className="text-zinc-500 text-sm text-center py-10">최근 진단 이력이 존재하지 않습니다.</p>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="p-3 bg-zinc-950 rounded-xl border border-zinc-800/80 hover:border-zinc-700 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm text-zinc-200">{log.userName}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        log.riskLevel === 'HIGH' ? 'bg-red-950/50 text-red-400 border border-red-800' :
                        log.riskLevel === 'MEDIUM' ? 'bg-yellow-950/50 text-yellow-400 border border-yellow-800' :
                        'bg-green-950/50 text-green-400 border border-green-800'
                      }`}>
                        {log.riskLevel}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 line-clamp-1 mb-2">{log.issueDetails}</p>
                    <div className="flex justify-between items-center text-[10px] text-zinc-500">
                      <span>{new Date(log.timestamp).toLocaleString()}</span>
                      <span className="font-semibold text-zinc-300">벌점 {log.score}점</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}