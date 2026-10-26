// 附录：Prompt 五要素逐块拼成一条完整 Prompt
import { interpolate, useCurrentFrame } from "remotion";
import { C, Caption, Card, Packet, SceneDef, Stage, progress } from "../kit";

const PARTS = [
  { icon: "🎭", label: "角色", line: "你是 AI 导师，面向零基础新手", color: C.blue },
  { icon: "🎯", label: "任务", line: "用 200 字以内解释什么是 RAG", color: C.orange },
  { icon: "📦", label: "背景", line: "读者会调 API，没听过 RAG", color: C.green },
  { icon: "📝", label: "输出", line: "先打比方，再下定义，最后 3 个要点", color: C.purple },
  { icon: "📐", label: "格式", line: "Markdown 段落，不用列表", color: C.red },
];

const START = 70;
const STEP = 50;
const CHIP_X = 60;
const CHIP_W = 250;
const CHIP_H = 76;
const rowY = (i: number) => 130 + i * 92;

const PANEL = { x: 380, y: 120, w: 840, h: 480 };

const Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const badOpacity = interpolate(frame, [0, 10, START - 10, START], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const done = progress(frame, START + STEP * 5, 20);
  return (
    <Stage title="Prompt 五要素：把订单五栏填齐">
      {/* 右侧 Prompt 纸面 */}
      <div
        style={{
          position: "absolute",
          left: PANEL.x,
          top: PANEL.y,
          width: PANEL.w,
          height: PANEL.h,
          background: C.card,
          borderRadius: 18,
          border: `4px solid ${done > 0 ? C.green : C.line}`,
          boxShadow: `0 6px 18px rgba(44,62,80,${0.1 + done * 0.1})`,
          boxSizing: "border-box",
        }}
      />
      {/* 开头：只有一句的提问 */}
      <div
        style={{
          position: "absolute",
          left: PANEL.x,
          width: PANEL.w,
          top: PANEL.y + 190,
          textAlign: "center",
          fontSize: 34,
          fontWeight: 700,
          color: C.red,
          opacity: badOpacity,
        }}
      >
        只写一句：“解释什么是 RAG”
      </div>

      {PARTS.map((p, i) => {
        const t = START + i * STEP;
        const lp = progress(frame, t + 22, 15);
        return (
          <div key={p.label}>
            <Card
              x={CHIP_X}
              y={rowY(i)}
              w={CHIP_W}
              h={CHIP_H}
              icon={p.icon}
              label={p.label}
              color={p.color}
              appear={i * 6}
              active={[[t, t + 30]]}
              fontSize={30}
            />
            <Packet
              points={[
                [CHIP_X + CHIP_W, rowY(i) + CHIP_H / 2],
                [PANEL.x + 120, rowY(i) + CHIP_H / 2],
              ]}
              start={t}
              dur={20}
              label={p.label}
              color={p.color}
            />
            <div
              style={{
                position: "absolute",
                left: PANEL.x + 36,
                top: rowY(i) + CHIP_H / 2 - 20,
                fontSize: 28,
                lineHeight: "40px",
                whiteSpace: "nowrap",
                opacity: lp,
                translate: `${(1 - lp) * 20}px 0px`,
              }}
            >
              <span style={{ color: p.color, fontWeight: 700 }}>{p.label}：</span>
              {p.line}
            </div>
          </div>
        );
      })}

      <Caption
        items={[
          { from: 0, to: START, text: "订单只写一句，主厨只能猜" },
          { from: START, to: START + STEP, text: "第一栏：找哪种风格的主厨" },
          { from: START + STEP, to: START + STEP * 2, text: "第二栏：做什么菜" },
          { from: START + STEP * 2, to: START + STEP * 3, text: "第三栏：客人是谁、忌口" },
          { from: START + STEP * 3, to: START + STEP * 4, text: "第四栏：要端出什么" },
          { from: START + STEP * 4, to: START + STEP * 5, text: "第五栏：怎么装盘" },
          { from: START + STEP * 5, to: 420, text: "五栏填齐，菜就对味了" },
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
  title: "Prompt 五要素：角色、任务、背景、输出、格式逐块加入，拼成一条完整的提示词",
};
