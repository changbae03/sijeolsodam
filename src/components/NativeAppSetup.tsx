'use client';

import { useEffect } from 'react';

/**
 * iOS 앱(Capacitor)으로 실행될 때만 동작하는 네이티브 초기화.
 *
 * 웹 브라우저에서는 Capacitor가 없으므로 전부 건너뛴다.
 * 여기서 하는 일:
 *  - <html>에 capacitor-app 클래스를 붙여 앱 전용 CSS가 걸리게 함
 *  - 상태바 스타일을 밝은 배경에 맞게 지정
 *  - 웹 로딩이 끝나면 스플래시를 내림
 *  - 안드로이드 대비 뒤로가기 처리(현재는 iOS만이지만 미리 대응)
 */
export default function NativeAppSetup() {
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { Capacitor } = await import('@capacitor/core');
      if (!Capacitor.isNativePlatform()) return;
      if (cancelled) return;

      document.documentElement.classList.add('capacitor-app');

      // 상태바: 흰 배경 위 어두운 글자
      try {
        const { StatusBar, Style } = await import('@capacitor/status-bar');
        await StatusBar.setStyle({ style: Style.Light });
        await StatusBar.setOverlaysWebView({ overlay: false });
      } catch {
        // 상태바 플러그인이 없는 환경(웹 미리보기 등)에서는 무시
      }

      // 화면이 준비되면 스플래시를 내린다
      try {
        const { SplashScreen } = await import('@capacitor/splash-screen');
        await SplashScreen.hide();
      } catch {
        /* 무시 */
      }

      // 키보드가 올라올 때 입력창이 가려지지 않도록 스크롤 보정
      try {
        const { Keyboard } = await import('@capacitor/keyboard');
        Keyboard.addListener('keyboardWillShow', () => {
          const el = document.activeElement as HTMLElement | null;
          if (el && typeof el.scrollIntoView === 'function') {
            setTimeout(() => el.scrollIntoView({ block: 'center', behavior: 'smooth' }), 120);
          }
        });
      } catch {
        /* 무시 */
      }

      // 하드웨어 뒤로가기(안드로이드) — 뒤로 갈 곳이 없으면 앱을 종료하지 않고 홈으로
      try {
        const { App } = await import('@capacitor/app');
        App.addListener('backButton', ({ canGoBack }) => {
          if (canGoBack) {
            window.history.back();
          } else {
            window.location.href = '/';
          }
        });
      } catch {
        /* 무시 */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
