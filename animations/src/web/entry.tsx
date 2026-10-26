// 网页端入口：把页面里的 <div data-anim="id"></div> 挂载成 Remotion Player。
// Docsify 每次切换页面后调用 window.PlusOneAnim.mountAll()。
import React, { useEffect, useRef } from "react";
import { createRoot, Root } from "react-dom/client";
import { Player, PlayerRef } from "@remotion/player";
import { scenes } from "../registry";
import type { SceneDef } from "../kit";

const AnimPlayer: React.FC<{ scene: SceneDef }> = ({ scene }) => {
  const ref = useRef<PlayerRef>(null);
  const box = useRef<HTMLDivElement>(null);

  // 滚动到可见区域才播放，离开就暂停。
  // 首屏可见时 IntersectionObserver 会在播放器就绪前触发，所以可见期间重试几次。
  useEffect(() => {
    const el = box.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    let visible = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const tryPlay = (left: number) => {
      const p = ref.current;
      if (!visible) return;
      if (p && !p.isPlaying()) p.play();
      if (left > 0) timer = setTimeout(() => tryPlay(left - 1), 400);
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        clearTimeout(timer);
        if (visible) tryPlay(5);
        else ref.current?.pause();
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      clearTimeout(timer);
      io.disconnect();
    };
  }, []);

  return (
    <div ref={box} role="img" aria-label={scene.title}>
      <Player
        ref={ref}
        component={scene.component}
        durationInFrames={scene.durationInFrames}
        fps={scene.fps}
        compositionWidth={scene.width}
        compositionHeight={scene.height}
        style={{ width: "100%", borderRadius: 12, overflow: "hidden" }}
        controls
        loop
        clickToPlay
        initiallyMuted
        acknowledgeRemotionLicense
      />
    </div>
  );
};

const mounted = new Map<HTMLElement, Root>();

const mountAll = (scope: ParentNode = document) => {
  for (const [el, root] of mounted) {
    if (!el.isConnected) {
      root.unmount();
      mounted.delete(el);
    }
  }
  scope.querySelectorAll<HTMLElement>("[data-anim]").forEach((el) => {
    if (mounted.has(el)) return;
    const id = el.dataset.anim ?? "";
    const scene = scenes[id];
    if (!scene) {
      el.textContent = `动画缺失：${id}`;
      return;
    }
    const root = createRoot(el);
    mounted.set(el, root);
    root.render(<AnimPlayer scene={scene} />);
  });
};

(window as unknown as { PlusOneAnim: unknown }).PlusOneAnim = { mountAll };

// Docsify 可能在本脚本加载前就渲染完了首屏，这里补挂载一次
mountAll();
