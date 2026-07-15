import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 개발 모드에서 로컬 IP 접근 및 HMR 웹소켓 허용
  devIndicators: {
    appIsrStatus: true,
  },
  // Next.js 15+ 에서는 헤더 설정을 통해 CORS를 관리하거나 
  // devServer 설정을 별도로 합니다. 아래는 요청하신 내용을 반영한 구조입니다.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "http://10.10.70.175:3000, http://localhost:3001" },
        ],
      },
    ];
  },
};

export default nextConfig;
