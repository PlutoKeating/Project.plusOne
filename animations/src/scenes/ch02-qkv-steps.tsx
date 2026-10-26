// 第 2 章附加阅读：Q/K/V 计算过程——Q 和每个 K 打分，Softmax 变成百分比，再按百分比混合 V
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Arrow, C, Caption, Card, Packet, SceneDef, Stage } from "../kit";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const ITEMS = [
  { word: "书", y: 150, score: "3.0", pct: 74, color: C.orange },
  { word: "小红", y: 290, score: "1.5", pct: 16, color: C.blue },
  { word: "需要", y: 430, score: "1.0", pct: 10, color: C.green },
];
const CARD_X = 600;
const CARD_W = 280;
const CARD_H = 100;
const LEFT: [number, number] = [380, 360];
const lineTo = (y: number): [number, number][] => [LEFT, [CARD_X, y + CARD_H / 2]];
const lineFrom = (y: number): [number, number][] => [[CARD_X, y + CARD_H / 2], LEFT];
// 数据包只走到离左侧卡片一段距离的位置，避免盖住卡片文字
const along = (y: number, dx: number): [number, number] => {
  const t = dx / (CARD_X - LEFT[0]);
  return [LEFT[0] + dx, LEFT[1] + (y + CARD_H / 2 - LEFT[1]) * t];
};
const packTo = (y: number): [number, number][] => [along(y, 65), along(y, CARD_X - LEFT[0] - 55)];
const packFrom = (y: number): [number, number][] => [along(y, CARD_X - LEFT[0] - 55), along(y, 65)];

// 阶段切换：K→V、Q→输出
const SWAP = 225;

const Fade: React.FC<{ from?: number; to?: number; children: React.ReactNode }> = ({
  from = -100,
  to = 99999,
  children,
}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [from, from + 15, to - 15, to], [0, 1, 1, 0], clamp);
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

const Badge: React.FC<{ y: number; appear: number; score: string; pct: number; color: string }> = ({
  y,
  appear,
  score,
  pct,
  color,
}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [appear, appear + 12], [0, 1], clamp);
  const toPct = interpolate(frame, [140, 165], [0, 1], clamp);
  return (
    <div
      style={{
        position: "absolute",
        left: 930,
        top: y + 15,
        width: 290,
        height: 70,
        opacity: o,
        borderRadius: 999,
        border: `4px solid ${color}`,
        background: C.card,
        boxSizing: "border-box",
        fontSize: 30,
        fontWeight: 700,
      }}
    >
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: 1 - toPct }}>
        分数 {score}
      </div>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: toPct, color }}>
        权重 {pct}%
      </div>
    </div>
  );
};

const MixBar: React.FC = () => {
  const frame = useCurrentFrame();
  const total = 480;
  const arrive = [320, 350, 380];
  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        top: 470,
        width: total,
        height: 56,
        borderRadius: 12,
        background: "#E6ECF2",
        display: "flex",
        overflow: "hidden",
        opacity: interpolate(frame, [SWAP + 20, SWAP + 35], [0, 1], clamp),
      }}
    >
      {ITEMS.map((it, i) => {
        const g = interpolate(frame, [arrive[i], arrive[i] + 20], [0, 1], clamp);
        return (
          <div
            key={it.word}
            style={{
              width: (total * it.pct * g) / 100,
              height: "100%",
              background: it.color,
              color: "#fff",
              fontSize: 26,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            {i === 0 ? "书 74%" : ""}
          </div>
        );
      })}
    </div>
  );
};

const Scene: React.FC = () => (
  <Stage title="Q、K、V：先打分，再加权求和">
    {/* 第一阶段：Query 去和每个 Key 比对 */}
    <Fade to={SWAP + 10}>
      <Card x={60} y={290} w={320} h={140} icon="❓" label="「它」的 Query" sub="我想找什么" appear={0} color={C.purple} active={[[30, 75]]} />
      {ITEMS.map((it, i) => (
        <Card key={it.word} x={CARD_X} y={it.y} w={CARD_W} h={CARD_H} icon="🏷️" label={`${it.word}的 Key`} appear={8 + i * 5} color={it.color} />
      ))}
      {ITEMS.map((it, i) => (
        <Arrow key={it.word} points={lineTo(it.y)} appear={30 + i * 6} />
      ))}
      {ITEMS.map((it, i) => (
        <Packet key={it.word} points={packTo(it.y)} start={45 + i * 6} dur={28} label="比对" color={C.purple} />
      ))}
    </Fade>

    {ITEMS.map((it, i) => (
      <Badge key={it.word} y={it.y} appear={85 + i * 10} score={it.score} pct={it.pct} color={it.color} />
    ))}

    {/* 第二阶段：按权重把各词的 Value 混成新表示 */}
    <Fade from={SWAP}>
      <Card x={60} y={290} w={320} h={140} icon="✨" label="「它」的新表示" appear={SWAP} color={C.purple} active={[[420, 600]]} />
      {ITEMS.map((it, i) => (
        <Card key={it.word} x={CARD_X} y={it.y} w={CARD_W} h={CARD_H} icon="📦" label={`${it.word}的 Value`} appear={SWAP + i * 5} color={it.color} />
      ))}
      {ITEMS.map((it, i) => (
        <Arrow key={it.word} points={lineFrom(it.y)} appear={SWAP + 20 + i * 6} color={it.color} />
      ))}
      {ITEMS.map((it, i) => (
        <Packet key={it.word} points={packFrom(it.y)} start={270 + i * 30} dur={45} label={`×${it.pct}%`} color={it.color} />
      ))}
      <MixBar />
    </Fade>

    <Caption
      items={[
        { from: 0, to: 140, text: "「它」的 Q 和每个 K 比对打分" },
        { from: 140, to: 225, text: "Softmax：分数变成百分比" },
        { from: 225, to: 270, text: "换成每个词的 Value" },
        { from: 270, to: 420, text: "按百分比把 Value 混在一起" },
        { from: 420, to: 600, text: "新表示里，大半来自「书」" },
      ]}
    />
  </Stage>
);

export const scene: SceneDef = {
  component: Scene,
  durationInFrames: 600,
  fps: 30,
  width: 1280,
  height: 720,
  title: "Q、K、V 计算过程：Query 与每个 Key 打分，Softmax 变成权重，再按权重混合各词的 Value",
};
