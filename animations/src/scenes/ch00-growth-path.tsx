// 序章：加一的成长路线——七个阶段依次点亮
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Arrow, C, Caption, Packet, SceneDef, Stage, within } from "../kit";

const CW = 220;
const CH = 150;
const TOP = 130;
const BOT = 370;
const XS = [50, 370, 690, 1010];

type Stop = { ch: string; icon: string; label: string; sub: string; color: string; x: number; y: number };

const STOPS: Stop[] = [
  { ch: "第 1 章", icon: "🧱", label: "身体", sub: "Python", color: C.blue, x: XS[0], y: TOP },
  { ch: "第 2 章", icon: "👁️", label: "眼睛", sub: "调大模型", color: C.blue, x: XS[1], y: TOP },
  { ch: "第 3 章", icon: "📚", label: "读书", sub: "RAG", color: C.green, x: XS[2], y: TOP },
  { ch: "第 4 章", icon: "🖐️", label: "动手", sub: "Agent", color: C.orange, x: XS[3], y: TOP },
  { ch: "第 5 章", icon: "🧰", label: "工具箱", sub: "Tool / MCP", color: C.orange, x: XS[3], y: BOT },
  { ch: "第 6 章", icon: "👥", label: "团队", sub: "多 Agent", color: C.purple, x: XS[2], y: BOT },
  { ch: "第 7 章", icon: "🚀", label: "毕业", sub: "项目实战", color: C.red, x: XS[1], y: BOT },
];

const START = 30; // 第一站点亮
const STEP = 45; // 每站间隔
const lightAt = (i: number) => START + i * STEP;

// 本地卡片：上方小字章节号，中间图标+名字，下方技能
const StopCard: React.FC<{ s: Stop; i: number }> = ({ s, i }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - i * 4, fps, config: { damping: 200 } });
  const lit = spring({ frame: frame - lightAt(i), fps, config: { damping: 14 } });
  const on = frame >= lightAt(i);
  return (
    <div
      style={{
        position: "absolute",
        left: s.x,
        top: s.y,
        width: CW,
        height: CH,
        opacity: interpolate(pop, [0, 1], [0, on ? 1 : 0.55]),
        scale: on ? interpolate(lit, [0, 1], [1, 1.06]) : interpolate(pop, [0, 1], [0.85, 1]),
        borderRadius: 18,
        background: on ? s.color : C.card,
        color: on ? "#fff" : C.muted,
        border: `4px solid ${on ? s.color : C.line}`,
        boxShadow: on ? `0 10px 30px ${s.color}55` : "0 6px 18px rgba(44,62,80,0.08)",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        whiteSpace: "nowrap",
      }}
    >
      <div style={{ fontSize: 24, opacity: 0.9 }}>{s.ch}</div>
      <div style={{ fontSize: 32, fontWeight: 700 }}>
        <span style={{ marginRight: 8 }}>{s.icon}</span>
        {s.label}
      </div>
      <div style={{ fontSize: 24, opacity: 0.9 }}>{s.sub}</div>
    </div>
  );
};

// 相邻两站之间的连线
const links: [number, number][][] = [
  [[XS[0] + CW, TOP + CH / 2], [XS[1], TOP + CH / 2]],
  [[XS[1] + CW, TOP + CH / 2], [XS[2], TOP + CH / 2]],
  [[XS[2] + CW, TOP + CH / 2], [XS[3], TOP + CH / 2]],
  [[XS[3] + CW / 2, TOP + CH], [XS[3] + CW / 2, BOT]],
  [[XS[3], BOT + CH / 2], [XS[2] + CW, BOT + CH / 2]],
  [[XS[2], BOT + CH / 2], [XS[1] + CW, BOT + CH / 2]],
];

const Finish: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - (lightAt(6) + 20), fps, config: { damping: 12 } });
  return (
    <div
      style={{
        position: "absolute",
        left: XS[0],
        top: BOT,
        width: CW,
        height: CH,
        opacity: p,
        scale: interpolate(p, [0, 1], [0.6, 1]),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 28,
        fontWeight: 700,
        color: C.ink,
        lineHeight: 1.4,
      }}
    >
      <div style={{ fontSize: 56 }}>🎓</div>
      <div>能独立做</div>
      <div>Agent 了</div>
    </div>
  );
};

const Scene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Stage title="加一的成长路线">
      {links.map((pts, i) => (
        <Arrow key={i} points={pts} appear={lightAt(i) + 5} dur={20} color={within(frame, 0, lightAt(i + 1)) ? C.line : STOPS[i + 1].color} />
      ))}
      {links.map((pts, i) => (
        <Packet key={i} points={pts} start={lightAt(i) + 12} dur={STEP - 18} label="+1" color={C.ink} />
      ))}
      {STOPS.map((s, i) => (
        <StopCard key={s.label} s={s} i={i} />
      ))}
      <Finish />
      <Caption
        items={[
          { from: 0, to: lightAt(0), text: "加一从零开始长大" },
          { from: lightAt(0), to: lightAt(1), text: "先有身体：学 Python" },
          { from: lightAt(1), to: lightAt(2), text: "睁开眼睛：会调大模型" },
          { from: lightAt(2), to: lightAt(3), text: "学会读书：先查资料再回答" },
          { from: lightAt(3), to: lightAt(4), text: "学会动手：边想边做" },
          { from: lightAt(4), to: lightAt(5), text: "有了工具箱：能用更多工具" },
          { from: lightAt(5), to: lightAt(6), text: "组个团队：多个 Agent 分工" },
          { from: lightAt(6), to: 420, text: "毕业：做项目，准备面试" },
        ]}
      />
    </Stage>
  );
};

export const scene: SceneDef = {
  component: Scene,
  durationInFrames: 420,
  fps: 30,
  width: 1280,
  height: 720,
  title: "加一的成长路线：身体、眼睛、读书、动手、工具箱、团队、毕业七个阶段依次点亮",
};
