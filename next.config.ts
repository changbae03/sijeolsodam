import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Vercel 이미지 최적화(변환)를 끄고 원본을 직접 서빙한다.
    // 이유: Hobby 플랜의 이미지 변환 한도는 월 5,000회인데 레시피 이미지가 2,600장이 넘어
    // 한도가 바로 소진된다. 대신 생성 스크립트가 처음부터 1200px WebP(장당 ~100KB)로
    // 만들어 올리므로 재최적화 없이 서빙해도 용량·화질 손해가 없다.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
      {
        // Cloudflare R2 공개 개발 URL (커뮤니티 사진·동영상)
        protocol: "https",
        hostname: "*.r2.dev",
      },
    ],
  },
};

export default nextConfig;
