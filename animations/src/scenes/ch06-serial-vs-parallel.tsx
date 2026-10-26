// 第 6 章：串行流水线与并行分派的耗时对比（甘特图）
import { interpolate, useCurrentFrame } from "remotion";
import { C, Caption, FadeIn, SceneDef, Stage, progress } from "../kit";

const X0 = 300; // 时间轴起点
const UNIT = 290; // 一份时间的宽度
const T0 = 60; // 开始计时的帧
const FPU = 100; // 每份时间多少帧

type Lane = { y: number; label: string; from: number; to: number; color: string };

const SERIAL: Lane[] = [
  { y: 165, label: "🔎 调研", from: 0, to: 1, color: C.blue },
  { y: 220, label: "✍️ 写作", from: 1, to: 2, color: C.blue },
  { y: 275, label: "📧 发邮件", from: 2, to: 3, color: C.blue },
];
const PARALLEL: Lane[] = [
  { y: 435, label: "🌤️ 查天气", from: 0, to: 0.9, color: C.orange },
  { y: 490, label: "📰 查新闻", from: 0, to: 1, color: C.orange },
  { y: 545, label: "📈 查股票", from: 0, to: 0.8, color: C.orange },
];

const now = (frame: number) =>
  interpolate(frame, [T0, T0 + 3 * FPU], [0, 3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const Row: React.FC<{ lane: Lane; appear: number }> = ({ lane, appear }) => {
  const frame = useCurrentFrame();
  const t = now(frame);
  const filled = Math.max(0, Math.min(t, lane.to) - lane.from);
  const waiting = t < lane.from && frame >= T0;
  return (
    <div style={{ position: "absolute", left: 0, top: lane.y, opacity: progress(frame, appear) }}>
      <div style={{ position: "absolute", left: 60, top: 0, width: 220, height: 44, fontSize: 28, fontWeight: 700, lineHeight: "44px", whiteSpace: "nowrap" }}>
        {lane.label}
      </div>
      <div
        style={{
          position: "absolute",
          left: X0,
          top: 4,
          width: UNIT * 3,
          height: 36,
          borderRadius: 10,
          background: "#E8EDF3",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: X0 + lane.from * UNIT,
          top: 4,
          width: filled * UNIT,
          height: 36,
          borderRadius: 10,
          background: lane.color,
        }}
      />
      {waiting ? (
        <div style={{ position: "absolute", left: X0 + 16, top: 0, fontSize: 24, lineHeight: "44px", color: C.muted, whiteSpace: "nowrap" }}>
          ⏳ 等上一步
        </div>
      ) : null}
    </div>
  );
};

const Header: React.FC<{ y: number; text: string; appear: number; color: string }> = ({ y, text, appear, color }) => (
  <FadeIn appear={appear} style={{ left: 60, top: y, fontSize: 30, fontWeight: 700, color }}>
    {text}
  </FadeIn>
);

const Badge: React.FC<{ y: number; text: string; appear: number; color: string }> = ({ y, text, appear, color }) => (
  <FadeIn appear={appear} style={{ left: 900, top: y }}>
    <div style={{ width: 280, textAlign: "center", fontSize: 28, fontWeight: 700, color: "#fff", background: color, borderRadius: 999, padding: "6px 0" }}>
      {text}
    </div>
  </FadeIn>
);

const Cursor: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < T0) return null;
  const x = X0 + now(frame) * UNIT;
  return <div style={{ position: "absolute", left: x - 2, top: 160, width: 4, height: 435, background: C.red, opacity: 0.7 }} />;
};

const Scene: React.FC = () => (
  <Stage title="串行和并行，谁更快？">
    <Header y={110} text="串行：后一步等前一步" appear={0} color={C.blue} />
    {SERIAL.map((l, i) => (
      <Row key={l.label} lane={l} appear={8 + i * 5} />
    ))}
    <Badge y={108} text="✅ 用时 3 份" appear={T0 + 3 * FPU} color={C.blue} />

    <Header y={380} text="并行：互不依赖，同时开工" appear={20} color={C.orange} />
    {PARALLEL.map((l, i) => (
      <Row key={l.label} lane={l} appear={28 + i * 5} />
    ))}
    <Badge y={378} text="✅ 用时 1 份" appear={T0 + FPU} color={C.orange} />

    <Cursor />

    <Caption
      items={[
        { from: 0, to: 60, text: "两种安排任务的方式" },
        { from: 60, to: 165, text: "并行这边三件事一起做" },
        { from: 165, to: 360, text: "串行这边一个等一个" },
        { from: 360, to: 480, text: "有先后就串行，没依赖就并行" },
      ]}
    />
  </Stage>
);

export const scene: SceneDef = {
  component: Scene,
  durationInFrames: 480,
  fps: 30,
  width: 1280,
  height: 720,
  title: "串行流水线要等前一步做完，用时 3 份；并行分派三件互不依赖的事同时开工，用时 1 份",
};
