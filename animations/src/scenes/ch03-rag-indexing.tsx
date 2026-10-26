// 第 3 章：建索引流水线——文档 → 切块 → 变成向量 → 存进向量库（开业前把菜谱拆卡、标坐标、上柜）
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Arrow, C, Caption, Card, FONT, Packet, SceneDef, Stage } from "../kit";

// 切出来的小块：从文档位置滑到右边
const Chunk: React.FC<{ i: number; appear: number }> = ({ i, appear }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - appear, fps, config: { damping: 200 } });
  const x = interpolate(p, [0, 1], [110, 350]);
  const y = 200 + i * 90;
  const lit = frame >= 130 + i * 30 && frame < 130 + i * 30 + 30;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 180,
        height: 70,
        opacity: p,
        borderRadius: 12,
        border: `4px solid ${C.orange}`,
        background: lit ? C.orange : C.card,
        color: lit ? "#fff" : C.ink,
        fontSize: 28,
        fontWeight: 700,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
        boxShadow: "0 6px 18px rgba(44,62,80,0.10)",
      }}
    >
      {`📃 块 ${i + 1}`}
    </div>
  );
};

// 向量库里的点：到达时弹出
const Dot: React.FC<{ x: number; y: number; appear: number; label: string }> = ({ x, y, appear, label }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - appear, fps, config: { damping: 12 } });
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: Math.min(p, 1), scale: p, display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ width: 26, height: 26, borderRadius: 13, background: C.blue }} />
      <span style={{ fontSize: 26, fontFamily: FONT, color: C.ink, whiteSpace: "nowrap" }}>{label}</span>
    </div>
  );
};

const Store: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - 200, fps, config: { damping: 200 } });
  return (
    <div
      style={{
        position: "absolute",
        left: 960,
        top: 160,
        width: 280,
        height: 360,
        opacity: p,
        borderRadius: 18,
        border: `4px solid ${C.green}`,
        background: C.card,
        boxSizing: "border-box",
        boxShadow: "0 6px 18px rgba(44,62,80,0.10)",
      }}
    >
      <div style={{ textAlign: "center", fontSize: 32, fontWeight: 700, marginTop: 14 }}>🗄️ 向量库</div>
    </div>
  );
};

const Scene: React.FC = () => (
  <Stage title="建索引：开业前把菜谱上柜">
    <Card x={40} y={230} w={200} h={180} icon="📄" label="长文档" appear={0} active={[[0, 50]]} color={C.ink} />
    <Arrow points={[[240, 320], [340, 320]]} appear={45} />
    <Chunk i={0} appear={60} />
    <Chunk i={1} appear={75} />
    <Chunk i={2} appear={90} />

    <Card x={610} y={265} w={260} h={110} icon="🔢" label="Embedding" appear={115} active={[[130, 230]]} />
    <Arrow points={[[530, 320], [610, 320]]} appear={120} />
    <Arrow points={[[870, 320], [960, 320]]} appear={190} />
    <Store />

    <Packet points={[[530, 320], [610, 320]]} start={130} dur={24} label="块 1" />
    <Packet points={[[530, 320], [610, 320]]} start={160} dur={24} label="块 2" />
    <Packet points={[[530, 320], [610, 320]]} start={190} dur={24} label="块 3" />

    <Packet points={[[870, 320], [960, 320]]} start={215} dur={26} label="[0.12, 0.45…]" color={C.blue} />
    <Packet points={[[870, 320], [960, 320]]} start={245} dur={26} label="[0.80, -0.31…]" color={C.blue} />
    <Packet points={[[870, 320], [960, 320]]} start={275} dur={26} label="[0.15, 0.42…]" color={C.blue} />

    <Dot x={1000} y={240} appear={243} label="块 1 + 原文" />
    <Dot x={1000} y={330} appear={273} label="块 2 + 原文" />
    <Dot x={1000} y={420} appear={303} label="块 3 + 原文" />

    <Caption
      items={[
        { from: 0, to: 55, text: "长文档就像一本厚菜谱" },
        { from: 55, to: 125, text: "拆成一张张菜谱卡" },
        { from: 125, to: 210, text: "每张卡标上口味坐标" },
        { from: 210, to: 330, text: "坐标和原文一起放进柜子" },
        { from: 330, to: 450, text: "开业前做一次，菜谱变了再做" },
      ]}
    />
  </Stage>
);

export const scene: SceneDef = {
  component: Scene,
  durationInFrames: 450,
  fps: 30,
  width: 1280,
  height: 720,
  title: "RAG 建索引流水线：长文档切成小块，每块经 Embedding 变成向量，连同原文存进向量库",
};
