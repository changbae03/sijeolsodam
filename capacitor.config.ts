import type { CapacitorConfig } from '@capacitor/cli';
import { KeyboardResize, KeyboardStyle } from '@capacitor/keyboard';

/**
 * 시절소담 iOS 앱 설정.
 *
 * 두 가지 모드를 지원한다.
 *
 * 1) 원격 로드 (기본)
 *    앱이 배포된 시절소담 사이트를 그대로 띄운다.
 *    로그인이 httpOnly + SameSite=Lax 쿠키를 쓰고 카카오 OAuth가 리다이렉트 방식이라,
 *    같은 출처에서 돌아야 인증이 깨지지 않는다. 리팩터링 없이 바로 동작하고,
 *    웹을 고치면 앱 재심사 없이 즉시 반영된다.
 *    네트워크가 없을 때는 app-shell/index.html(오프라인 안내)이 대신 뜬다.
 *
 * 2) 번들 (CAP_BUNDLED=1)
 *    정적 export 결과(out/)를 앱에 넣어 오프라인에서도 즉시 실행한다.
 *    쓰려면 먼저 아래가 필요하다.
 *      - 모든 fetch('/api/...')를 Vercel 절대주소로 전환
 *      - 인증 쿠키를 SameSite=None; Secure로 변경 + 28개 API에 CORS 허용
 *      - 카카오 OAuth 콜백을 앱 딥링크로 재설계
 *      - 빌드 시 src/app/api 제외 (API 라우트가 있으면 output:'export'가 실패)
 *    지금은 준비되지 않았으므로 기본값은 원격 로드다.
 */
const bundled = process.env.CAP_BUNDLED === '1';

const SITE_URL = process.env.CAP_SERVER_URL ?? 'https://sijeolsodam1.vercel.app';

const config: CapacitorConfig = {
  appId: 'kr.sijeolsodam.app',
  appName: '시절소담',
  // 번들 모드에서는 next build(output:'export') 결과인 out/을 쓰고,
  // 원격 모드에서는 오프라인 안내 화면만 담긴 app-shell/을 쓴다.
  webDir: bundled ? 'out' : 'app-shell',

  ...(bundled
    ? {}
    : {
        server: {
          url: SITE_URL,
          // 사이트가 https라 평문 트래픽은 허용하지 않는다.
          cleartext: false,
        },
      }),

  ios: {
    // 상단 노치·하단 홈바 영역을 웹뷰가 직접 처리하도록 두고,
    // 세이프에어리어는 CSS(env(safe-area-inset-*))로 맞춘다.
    contentInset: 'always',
    // 당겨서 새로고침 같은 웹뷰 기본 바운스는 앱 느낌을 해쳐서 끈다.
    scrollEnabled: true,
    backgroundColor: '#ffffff',
  },

  plugins: {
    SplashScreen: {
      launchShowDuration: 1200,
      launchAutoHide: true,
      backgroundColor: '#ffffff',
      showSpinner: false,
      iosSpinnerStyle: 'small',
      splashImmersive: false,
    },
    Keyboard: {
      // 키보드가 올라올 때 웹뷰 전체를 밀지 않고 리사이즈해야
      // 입력창이 가려지지 않는다.
      resize: KeyboardResize.Native,
      resizeOnFullScreen: true,
      style: KeyboardStyle.Light,
    },
    StatusBar: {
      style: 'LIGHT', // 밝은 배경 위 어두운 글자
      backgroundColor: '#ffffff',
      overlaysWebView: false,
    },
  },
};

export default config;
