// 第 2 章附加阅读：自注意力——一个词向句中其他词"投注意力"，连线越粗权重越大
import { interpolate, useCurrentFrame } from "remotion";
import { C, Caption, FONT, SceneDef, Stage, W, H } from "../kit";

const WORDS = ["小明", "把", "书", "给了", "小红", "因为", "她", "需要", "它"];
const BOX_W = 112;
const GAP = 15;
const X0 = (W - (WORDS.length * BOX_W + (WORDS.length - 1) * GAP)) / 2;
const BOX_Y = 420;
const BOX_H = 72;
const cx = (i: number) => X0 + i * (BOX_W + GAP) + BOX_W / 2;

// 两个阶段：先看"它"，再看"她"。权重为示意数值，每组加起来等于 1
const PHASES = [
  { focus: 8, from: 40, to: 215, w: [0.08, 0.02, 0.55, 0.05, 0.1, 0.03, 0.05, 0.1, 0.02], color: C.orange },
  { focus: 6, from: 230, to: 480, w: [0.2, 0.02, 0.05, 0.05, 0.5, 0.08, 0.03, 0.05, 0.02], color: C.purple },
];

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const Links: React.FC = () => {
  const frame = useCurrentFrame();
  const ph = PHASES.find((p) => frame >= p.from && frame < p.to);
  if (!ph) return null;
  const grow = interpolate(frame, [ph.from + 10, ph.from + 45], [0, 1], clamp);
  const fade = ph.to >= 480 ? 1 : interpolate(frame, [ph.to - 15, ph.to], [1, 0], clamp);
  const fx = cx(ph.focus);
  return (
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, opacity: fade }}>
      {ph.w.map((wt, i) => {
        if (i === ph.focus) return null;
        const tx = cx(i);
        const d = Math.abs(fx - tx);
        const ctrlY = BOX_Y - 8 - d * 0.5;
        const path = `M${fx},${BOX_Y - 6} Q${(fx + tx) / 2},${ctrlY} ${tx},${BOX_Y - 6}`;
        const apexY = (BOX_Y - 6 + ctrlY) / 2;
        const len = d * 1.3 + 40;
        return (
          <g key={i}>
            <path
              d={path}
              fill="none"
              stroke={ph.color}
              strokeWidth={2 + wt * 26}
              strokeLinecap="round"
              opacity={0.35 + wt}
              strokeDasharray={`${len} ${len}`}
              strokeDashoffset={len * (1 - grow)}
            />
            {wt >= 0.2 ? (
              <text
                x={(fx + tx) / 2}
                y={apexY - 14}
                textAnchor="middle"
                fontSize={wt >= 0.3 ? 30 : 24}
                fontWeight={700}
                fontFamily={FONT}
                fill={ph.color}
                opacity={grow}
              >
                {Math.round(wt * 100)}%
              </text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
};

const Words: React.FC = () => {
  const frame = useCurrentFrame();
  const ph = PHASES.find((p) => frame >= p.from && frame < p.to);
  const grow = ph ? interpolate(frame, [ph.from + 10, ph.from + 45], [0, 1], clamp) : 0;
  return (
    <>
      {WORDS.map((wd, i) => {
        const o = interpolate(frame, [i * 3, i * 3 + 12], [0, 1], clamp);
        const isFocus = ph?.focus === i;
        const wt = ph && !isFocus ? ph.w[i] * grow : 0;
        const color = ph?.color ?? C.blue;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: X0 + i * (BOX_W + GAP),
              top: BOX_Y,
              width: BOX_W,
              height: BOX_H,
              opacity: o,
              boxSizing: "border-box",
              borderRadius: 14,
              border: `4px solid ${isFocus || wt >= 0.3 ? color : C.line}`,
              background: isFocus ? color : `rgba(245,166,35,${wt * 0.6})`,
              color: isFocus ? "#fff" : C.ink,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 30,
              fontWeight: 700,
              whiteSpace: "nowrap",
            }}
          >
            {wd}
          </div>
        );
      })}
    </>
  );
};

const Scene: React.FC = () => (
  <Stage title="自注意力：每个词都看一遍全句">
    <Links />
    <Words />
    <div style={{ position: "absolute", right: 60, top: 516, fontSize: 24, color: C.muted }}>
      线越粗，关注越多（数字为示意）
    </div>
    <Caption
      items={[
        { from: 0, to: 40, text: "一句话，拆成一个个词" },
        { from: 40, to: 125, text: "「它」向每个词投去注意力" },
        { from: 125, to: 230, text: "最粗的线连着「书」" },
        { from: 230, to: 360, text: "换成「她」：最关注「小红」" },
        { from: 360, to: 480, text: "每个词都这样看全句" },
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
  title: "自注意力示意：句中的「它」和「她」分别向其他词分配注意力，连线越粗代表权重越大",
};
