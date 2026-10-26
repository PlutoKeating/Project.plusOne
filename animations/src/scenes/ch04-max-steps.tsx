// 第 4 章："最多步数"保护——工具一直出错时，循环到上限就停下
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Arrow, C, Caption, Card, FadeIn, Packet, SceneDef, Stage } from "../kit";

const MAX = 5;
const LAP = 56; // 每一圈的帧数
const START = 30;
const STOP = START + LAP * MAX; // 310

const lapEnd = (k: number) => START + LAP * k + LAP - 4;

// 已走步数的格子
const Slot: React.FC<{ i: number; x: number; y: number }> = ({ i, x, y }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fill = spring({ frame: frame - lapEnd(i), fps, config: { damping: 200 } });
  const last = i === MAX - 1;
  const color = last ? C.red : C.blue;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 90,
        height: 90,
        borderRadius: 14,
        border: `4px solid ${color}`,
        boxSizing: "border-box",
        background: fill > 0.5 ? color : C.card,
        color: fill > 0.5 ? "#fff" : C.muted,
        scale: interpolate(fill, [0, 0.5, 1], [1, 1.12, 1]),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 34,
        fontWeight: 700,
      }}
    >
      {i + 1}
    </div>
  );
};

const Counter: React.FC = () => {
  const frame = useCurrentFrame();
  let n = 0;
  for (let k = 0; k < MAX; k++) if (frame >= lapEnd(k)) n = k + 1;
  return (
    <div
      style={{
        position: "absolute",
        left: 640,
        top: 160,
        width: 560,
        textAlign: "center",
        fontSize: 34,
        fontWeight: 700,
      }}
    >
      已走 <span style={{ color: n >= MAX ? C.red : C.blue }}>{n}</span> 步 / 最多 {MAX} 步
    </div>
  );
};

const Scene: React.FC = () => {
  const down: [number, number][] = [[240, 262], [240, 448]];
  const up: [number, number][] = [[400, 448], [400, 262]];
  return (
    <Stage title="最多步数：让失控的循环停下">
      <Card x={120} y={140} w={360} h={110} icon="🧠" label="LLM" appear={0} />
      <Card x={120} y={460} w={360} h={110} icon="🔧" label="搜索工具" appear={8} color={C.orange} />

      <Arrow points={[[240, 250], [240, 458]]} appear={15} />
      <Arrow points={[[400, 458], [400, 252]]} appear={20} />

      {Array.from({ length: MAX }).map((_, k) => {
        const s = START + LAP * k;
        return (
          <div key={k}>
            <Packet points={down} start={s} dur={22} label="搜索" color={C.blue} />
            <Packet points={up} start={s + 26} dur={22} label="❌ 超时" color={C.red} />
          </div>
        );
      })}

      <Counter />
      {Array.from({ length: MAX }).map((_, i) => (
        <Slot key={i} i={i} x={660 + i * 108} y={240} />
      ))}

      <FadeIn appear={STOP} style={{ left: 640, top: 380, width: 560 }}>
        <div
          style={{
            margin: "0 auto",
            width: 480,
            padding: "18px 0",
            textAlign: "center",
            borderRadius: 18,
            background: C.red,
            color: "#fff",
            fontSize: 34,
            fontWeight: 700,
            boxShadow: `0 10px 30px ${C.red}55`,
          }}
        >
          ⛔ 到上限，停止循环
        </div>
      </FadeIn>
      <FadeIn appear={STOP + 30} style={{ left: 640, top: 490, width: 560, textAlign: "center" }}>
        <span style={{ fontSize: 28, color: C.ink }}>💬 回复用户：请简化问题后重试</span>
      </FadeIn>

      <Caption
        items={[
          { from: 0, to: 120, text: "工具一直超时，LLM 一直重试" },
          { from: 120, to: 230, text: "程序每绕一圈，就记一步" },
          { from: STOP - 80, to: STOP, text: "快到上限了" },
          { from: STOP, to: 480, text: "到上限就停，给用户一个交代" },
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
  title: "最多步数保护：工具反复出错时，程序每绕一圈记一步，到上限就停止循环并告诉用户",
};
