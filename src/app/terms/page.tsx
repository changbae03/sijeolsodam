import Link from 'next/link';

export const metadata = { title: '이용약관 — 시절소담' };

const SECTIONS: { title: string; body: string[] }[] = [
  {
    title: '제1조 (목적)',
    body: [
      '이 약관은 시절소담(이하 "서비스")이 제공하는 제철 식재료 정보, 레시피, 커뮤니티 및 관련 제반 서비스의 이용 조건과 절차, 이용자와 서비스의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.',
    ],
  },
  {
    title: '제2조 (회원가입 및 계정)',
    body: [
      '이용자는 이메일 가입 또는 카카오 계정 연동을 통해 회원으로 가입할 수 있습니다.',
      '회원은 자신의 계정 정보를 안전하게 관리할 책임이 있으며, 계정의 부정 사용을 알게 된 경우 즉시 서비스에 알려야 합니다.',
    ],
  },
  {
    title: '제3조 (서비스의 내용)',
    body: [
      '서비스는 제철 식재료 정보, 레시피, AI 기반 요리 안내(소담이), 가격 정보, 커뮤니티 기능을 제공합니다.',
      '가격 정보는 공공 데이터(KAMIS)를 기반으로 하며 실제 판매 가격과 다를 수 있습니다. AI가 생성한 답변과 이미지는 참고용이며 정확성을 보증하지 않습니다.',
    ],
  },
  {
    title: '제4조 (이용자의 게시물)',
    body: [
      '이용자가 커뮤니티에 게시한 콘텐츠의 저작권은 이용자에게 있습니다. 다만 서비스는 서비스 운영·홍보 목적의 범위에서 게시물을 사용할 수 있습니다.',
      '타인의 권리를 침해하거나 법령에 위반되는 게시물은 사전 통지 없이 삭제될 수 있습니다.',
    ],
  },
  {
    title: '제5조 (회원 탈퇴)',
    body: [
      '회원은 마이페이지에서 언제든지 탈퇴할 수 있으며, 탈퇴 시 계정 및 관련 데이터는 즉시 삭제됩니다.',
    ],
  },
  {
    title: '제6조 (면책)',
    body: [
      '서비스가 제공하는 레시피·보관법·영양 정보는 일반적인 참고 정보이며, 개인의 건강 상태에 따른 판단을 대신하지 않습니다.',
      '천재지변, 시스템 장애 등 불가항력으로 인한 서비스 중단에 대해 서비스는 책임을 지지 않습니다.',
    ],
  },
];

export default function TermsPage() {
  return (
    <main className="max-w-md mx-auto px-5 pt-8 pb-16">
      <p className="text-[12px] tracking-[0.08em] text-sage font-semibold mb-1.5">시절소담</p>
      <h1 className="text-[24px] font-bold tracking-[-0.02em] text-ink">이용약관</h1>
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
