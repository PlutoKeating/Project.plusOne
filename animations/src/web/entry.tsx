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

  // 滚动到可见区域才播放，离开就暂停
  useEffect(() => {
    const el = box.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => {
        const p = ref.current;
        if (!p) return;
        if (entry.isIntersecting) p.play();
        else p.pause();
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
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
