import Link from 'next/link';

export const metadata = { title: '개인정보처리방침 — 시절소담' };

const SECTIONS: { title: string; body: string[] }[] = [
  {
    title: '1. 수집하는 개인정보',
    body: [
      '이메일 가입 시: 이메일 주소, 닉네임, 암호화된 비밀번호',
      '카카오 계정 연동 시: 카카오 회원번호, 닉네임, 이메일(동의한 경우)',
      '서비스 이용 과정에서: 레시피 즐겨찾기·조회 기록, 커뮤니티 게시물·댓글, AI 요리 상담(소담이) 대화 내용',
    ],
  },
  {
    title: '2. 개인정보의 이용 목적',
    body: [
      '회원 식별 및 로그인 유지, 개인화된 레시피·식재료 추천, 커뮤니티 운영, 서비스 개선을 위한 통계 분석에 이용합니다.',
      '수집한 정보는 명시된 목적 외의 용도로 이용하지 않으며, 제3자에게 판매하지 않습니다.',
    ],
  },
  {
    title: '3. 보유 및 파기',
    body: [
      '개인정보는 회원 탈퇴 시 지체 없이 파기합니다. 탈퇴 시 즐겨찾기, 조회 기록, 게시물 등 회원이 남긴 데이터가 함께 삭제됩니다.',
      '관계 법령에 따라 보존이 필요한 정보는 해당 법령이 정한 기간 동안 보관 후 파기합니다.',
    ],
  },
  {
    title: '4. 처리 위탁 및 국외 이전',
    body: [
      '서비스는 안정적인 운영을 위해 다음 업체에 데이터 처리를 위탁합니다: Vercel(서비스 호스팅), Neon(데이터베이스), Google(AI 이미지 생성), Anthropic(AI 대화), Kakao(소셜 로그인).',
      '위 업체의 서버는 국외에 위치할 수 있으며, 각 업체는 자체 보안 기준에 따라 데이터를 보호합니다.',
    ],
  },
  {
    title: '5. 이용자의 권리',
    body: [
      '이용자는 언제든지 자신의 개인정보를 조회·수정하거나 마이페이지에서 회원 탈퇴를 통해 삭제를 요청할 수 있습니다.',
      '개인정보 관련 문의는 마이페이지의 문의하기를 통해 접수할 수 있습니다.',
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main className="max-w-md mx-auto px-5 pt-8 pb-16">
      <p className="text-[12px] tracking-[0.08em] text-sage font-semibold mb-1.5">시절소담</p>
      <h1 className="text-[24px] font-bold tracking-[-0.02em] text-ink">개인정보처리방침</h1>
      <p className="text-[12.5px] text-ink-soft/60 mt-2">시행일: 2026년 7월 16일</p>

      <div className="mt-8 space-y-7">
        {SECTIONS.map((sec) => (
          <section key={sec.title}>
            <h2 className="text-[15px] font-bold text-ink mb-2">{sec.title}</h2>
            {sec.body.map((b, i) => (
              <p key={i} className="text-[13.5px] text-ink-soft leading-[1.75] mt-1">
                {b}
              </p>
            ))}
          </section>
        ))}
      </div>

      <Link href="/my" className="mt-10 inline-block text-[14px] text-sage font-medium">
        ← 마이페이지로 돌아가기
      </Link>
    </main>
  );
}
