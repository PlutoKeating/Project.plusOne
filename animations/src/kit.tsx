// 所有教程动画共用的画布、配色和基础图元。
// 坐标统一用 1280x720 的画布坐标，组件内部自己读取当前帧。
import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export type SceneDef = {
  component: React.FC;
  durationInFrames: number;
  fps: number;
  width: number;
  height: number;
  // 给读者看的一句话说明，用作无障碍标签
  title: string;
};

export const W = 1280;
export const H = 720;

export const C = {
  bg: "#F7F9FC",
  ink: "#2C3E50",
  muted: "#7A8A9A",
  line: "#C9D3DE",
  blue: "#4A90D9",
  orange: "#F5A623",
  green: "#3DB37A",
  red: "#E05D44",
  purple: "#8E6CD8",
  card: "#FFFFFF",
};

export const FONT =
  '"PingFang SC", "Noto Sans CJK SC", "Noto Sans SC", "Microsoft YaHei", "Hiragino Sans GB", sans-serif';

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

// 0→1 的淡入进度
export const progress = (frame: number, start: number, dur = 15) =>
  interpolate(frame, [start, start + dur], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

// 在 [start, end) 区间内为 true
export const within = (frame: number, start: number, end: number) =>
  frame >= start && frame < end;

export const Stage: React.FC<{
  title?: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <AbsoluteFill style={{ backgroundColor: C.bg, fontFamily: FONT, color: C.ink }}>
    {title ? (
      <div
        style={{
          position: "absolute",
          top: 36,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 40,
          fontWeight: 700,
        }}
      >
        {title}
      </div>
    ) : null}
    {children}
  </AbsoluteFill>
);

// 卡片：appear 帧弹出；active 区间内高亮
export const Card: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sub?: string;
  icon?: string;
  color?: string;
  appear?: number;
  active?: [number, number][];
  fontSize?: number;
}> = ({ x, y, w, h, label, sub, icon, color = C.blue, appear = 0, active = [], fontSize = 32 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - appear, fps, config: { damping: 200 } });
  const on = active.some(([a, b]) => within(frame, a, b));
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        opacity: pop,
        scale: interpolate(pop, [0, 1], [0.85, 1]),
        borderRadius: 18,
        background: on ? color : C.card,
        color: on ? "#fff" : C.ink,
        border: `4px solid ${color}`,
        boxShadow: on ? `0 10px 30px ${color}55` : "0 6px 18px rgba(44,62,80,0.10)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        boxSizing: "border-box",
        padding: 10,
      }}
    >
      <div style={{ fontSize, fontWeight: 700, lineHeight: 1.25, whiteSpace: "nowrap" }}>
        {icon ? <span style={{ marginRight: 8 }}>{icon}</span> : null}
        {label}
      </div>
      {sub ? (
        <div style={{ fontSize: Math.max(24, fontSize * 0.75), marginTop: 6, opacity: 0.85, lineHeight: 1.3 }}>
          {sub}
        </div>
      ) : null}
    </div>
  );
};

// 折线箭头：appear 帧开始"画"出来
export const Arrow: React.FC<{
  points: [number, number][];
  appear?: number;
  dur?: number;
  color?: string;
  dashed?: boolean;
  label?: string;
  labelAt?: [number, number];
}> = ({ points, appear = 0, dur = 15, color = C.line, dashed, label, labelAt }) => {
  const frame = useCurrentFrame();
  const p = progress(frame, appear, dur);
  let len = 0;
  for (let i = 1; i < points.length; i++) {
    len += Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]);
  }
  const d = points.map((pt, i) => `${i ? "L" : "M"}${pt[0]},${pt[1]}`).join(" ");
  const [ax, ay] = points[points.length - 1];
  const [bx, by] = points[points.length - 2];
  const ang = Math.atan2(ay - by, ax - bx);
  const head = 16;
  const tri = [
    [ax, ay],
    [ax - head * Math.cos(ang - 0.45), ay - head * Math.sin(ang - 0.45)],
    [ax - head * Math.cos(ang + 0.45), ay - head * Math.sin(ang + 0.45)],
  ]
    .map((q) => q.join(","))
    .join(" ");
  return (
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={5}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={dashed ? "12 10" : `${len} ${len}`}
        strokeDashoffset={dashed ? 0 : len * (1 - p)}
        opacity={dashed ? p : 1}
      />
      <polygon points={tri} fill={color} opacity={p >= 0.98 ? 1 : 0} />
      {label && labelAt ? (
        <text
          x={labelAt[0]}
          y={labelAt[1]}
          textAnchor="middle"
          fontSize={26}
          fontFamily={FONT}
          fill={C.muted}
          opacity={p}
        >
          {label}
        </text>
      ) : null}
    </svg>
  );
};

// 沿折线移动的小标签，表示"一份数据在流动"
export const Packet: React.FC<{
  points: [number, number][];
  start: number;
  dur: number;
  label: string;
  color?: string;
  fontSize?: number;
}> = ({ points, start, dur, label, color = C.orange, fontSize = 24 }) => {
  const frame = useCurrentFrame();
  if (frame < start || frame > start + dur + 6) return null;
  const t = interpolate(frame, [start, start + dur], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const segs: number[] = [];
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    const l = Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]);
    segs.push(l);
    total += l;
  }
  let dist = t * total;
  let x = points[0][0];
  let y = points[0][1];
  for (let i = 0; i < segs.length; i++) {
    if (dist <= segs[i] || i === segs.length - 1) {
      const r = segs[i] === 0 ? 0 : Math.min(dist / segs[i], 1);
      x = points[i][0] + (points[i + 1][0] - points[i][0]) * r;
      y = points[i][1] + (points[i + 1][1] - points[i][1]) * r;
      break;
    }
    dist -= segs[i];
  }
  const fade = interpolate(frame, [start, start + 5, start + dur, start + dur + 6], [0, 1, 1, 0], clamp);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        translate: "-50% -50%",
        opacity: fade,
        background: color,
        color: "#fff",
        fontSize,
        fontWeight: 700,
        padding: "6px 16px",
        borderRadius: 999,
        whiteSpace: "nowrap",
        boxShadow: `0 6px 16px ${color}66`,
      }}
    >
      {label}
    </div>
  );
};

// 画面底部的字幕，按时间段切换
export const Caption: React.FC<{ items: { from: number; to: number; text: string }[] }> = ({
  items,
}) => {
  const frame = useCurrentFrame();
  const cur = items.find((it) => within(frame, it.from, it.to));
  if (!cur) return null;
  const o = interpolate(frame, [cur.from, cur.from + 8, cur.to - 8, cur.to], [0, 1, 1, 0], clamp);
  return (
    <div
      style={{
        position: "absolute",
        left: 80,
        right: 80,
        bottom: 36,
        textAlign: "center",
        fontSize: 32,
        color: C.ink,
        opacity: o,
      }}
    >
      <span style={{ background: "#fff", padding: "10px 24px", borderRadius: 12, boxShadow: "0 4px 14px rgba(44,62,80,0.10)" }}>
        {cur.text}
      </span>
    </div>
  );
};

// 任意元素按 appear 帧淡入并上移
export const FadeIn: React.FC<{
  appear: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ appear, style, children }) => {
  const frame = useCurrentFrame();
  const p = progress(frame, appear, 15);
  return (
    <div style={{ position: "absolute", opacity: p, translate: `0px ${(1 - p) * 20}px`, ...style }}>
      {children}
    </div>
  );
};
