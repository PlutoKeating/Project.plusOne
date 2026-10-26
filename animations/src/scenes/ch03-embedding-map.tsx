// 第 3 章：Embedding 像给菜谱卡标口味坐标——口味相近的卡坐标也近，顾客需求落下后取最近的卡
import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, Caption, FONT, SceneDef, Stage, progress } from "../kit";

const MAP = { x: 340, y: 110, w: 900, h: 480 };

type Word = { text: string; to: [number, number]; group: "spicy" | "sweet" };

// 词的目标坐标（画布坐标）
const WORDS: Word[] = [
  { text: "麻婆豆腐", to: [480, 210], group: "spicy" },
  { text: "双皮奶", to: [940, 420], group: "sweet" },
  { text: "水煮鱼", to: [590, 300], group: "spicy" },
  { text: "拔丝苹果", to: [1010, 330], group: "sweet" },
  { text: "辣子鸡", to: [460, 360], group: "spicy" },
  { text: "糖水", to: [1080, 500], group: "sweet" },
];

const QUERY: [number, number] = [570, 420];

const WordPin: React.FC<{ w: Word; i: number }> = ({ w, i }) => {
  const frame = useCurrentFrame();
  const appear = 20 + i * 8;
  const fly = 70 + i * 22;
  const show = progress(frame, appear, 12);
  const t = interpolate(frame, [fly, fly + 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const fromX = 60;
  const fromY = 140 + i * 72;
  const x = fromX + (w.to[0] - fromX) * t;
  const y = fromY + (w.to[1] - fromY) * t;
  const near = w.group === "spicy" && frame >= 360;
  const color = w.group === "spicy" ? C.orange : C.blue;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        translate: "0 -50%",
        opacity: show,
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      <div
        style={{
          width: 24,
          height: 24,
          borderRadius: 12,
          background: color,
          boxShadow: near ? `0 0 0 8px ${C.orange}55` : "none",
        }}
      />
      <span
        style={{
          fontSize: 30,
          fontWeight: 700,
          fontFamily: FONT,
          color: C.ink,
          background: "#fff",
          padding: "2px 10px",
          borderRadius: 8,
          whiteSpace: "nowrap",
        }}
      >
        {w.text}
      </span>
    </div>
  );
};

const Zone: React.FC<{ cx: number; cy: number; rx: number; ry: number; color: string; label: string; lx: number; ly: number }> = ({
  cx,
  cy,
  rx,
  ry,
  color,
  label,
  lx,
  ly,
}) => {
  const frame = useCurrentFrame();
  const p = progress(frame, 230, 20);
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: cx - rx,
          top: cy - ry,
          width: rx * 2,
          height: ry * 2,
          borderRadius: "50%",
          background: `${color}22`,
          border: `3px dashed ${color}`,
          opacity: p,
          boxSizing: "border-box",
        }}
      />
      <div style={{ position: "absolute", left: lx, top: ly, fontSize: 28, fontWeight: 700, color, opacity: p, whiteSpace: "nowrap" }}>
        {label}
      </div>
    </>
  );
};

const Query: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - 280, fps, config: { damping: 12 } });
  const ring = interpolate(frame, [320, 360], [0, 150], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lines = progress(frame, 360, 20);
  const near = WORDS.filter((w) => w.group === "spicy");
  return (
    <>
      <svg width={1280} height={720} style={{ position: "absolute", left: 0, top: 0 }}>
        <circle cx={QUERY[0]} cy={QUERY[1]} r={ring} fill={`${C.red}14`} stroke={C.red} strokeWidth={3} strokeDasharray="10 8" opacity={frame >= 320 ? 1 : 0} />
        {near.map((w) => (
          <line
            key={w.text}
            x1={QUERY[0]}
            y1={QUERY[1]}
            x2={QUERY[0] + (w.to[0] + 12 - QUERY[0]) * lines}
            y2={QUERY[1] + (w.to[1] - QUERY[1]) * lines}
            stroke={C.red}
            strokeWidth={4}
            opacity={lines}
          />
        ))}
      </svg>
      <div
        style={{
          position: "absolute",
          left: QUERY[0],
          top: QUERY[1],
          translate: "-50% -50%",
          scale: p,
          opacity: Math.min(p, 1),
          width: 32,
          height: 32,
          borderRadius: 16,
          background: C.red,
          border: "4px solid #fff",
          boxShadow: `0 4px 12px ${C.red}88`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: QUERY[0] + 30,
          top: QUERY[1] + 20,
          opacity: Math.min(p, 1),
          fontSize: 28,
          fontWeight: 700,
          color: "#fff",
          background: C.red,
          padding: "4px 14px",
          borderRadius: 999,
          whiteSpace: "nowrap",
        }}
      >
        🙋 想吃辣的
      </div>
    </>
  );
};

const Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const mapIn = progress(frame, 40, 20);
  return (
    <Stage title="Embedding：口味相近，坐标就近">
      <div
        style={{
          position: "absolute",
          left: MAP.x,
          top: MAP.y,
          width: MAP.w,
          height: MAP.h,
          borderRadius: 18,
          background: "#fff",
          border: `3px solid ${C.line}`,
          opacity: mapIn,
          backgroundImage: `linear-gradient(${C.line}55 1px, transparent 1px), linear-gradient(90deg, ${C.line}55 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          boxSizing: "border-box",
        }}
      />
      <Zone cx={520} cy={290} rx={150} ry={135} color={C.orange} label="辣味区" lx={380} ly={124} />
      <Zone cx={1040} cy={420} rx={150} ry={135} color={C.blue} label="甜味区" lx={900} ly={240} />
      {WORDS.map((w, i) => (
        <WordPin key={w.text} w={w} i={i} />
      ))}
      <Query />
      <Caption
        items={[
          { from: 0, to: 70, text: "每张菜谱卡算出口味坐标" },
          { from: 70, to: 230, text: "口味相近，坐标也挨得近" },
          { from: 230, to: 280, text: "自然聚成一片一片" },
          { from: 280, to: 360, text: "顾客的需求也算出坐标" },
          { from: 360, to: 480, text: "取最近的几张卡给主厨" },
        ]}
      />
    </Stage>
  );
};

export const scene: SceneDef = {
  component: Scene,
  durationInFrames: 480,
  fps: 30,
  width: 1280,
  height: 720,
  title: "Embedding 给每张菜谱卡标上口味坐标：辣菜聚在一起，甜品聚在另一处，离顾客需求最近的卡就是检索结果",
};
