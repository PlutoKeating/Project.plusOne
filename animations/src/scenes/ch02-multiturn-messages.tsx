// 第 2 章：多轮对话——消息列表越变越长，每轮都把整个列表重新发给模型
import { interpolate, useCurrentFrame } from "remotion";
import { Arrow, C, Caption, Card, FadeIn, Packet, SceneDef, Stage, within } from "../kit";

const ROW_H = 52;
const TOP = 170;

const ROWS: { at: number; who: string; text: string; color: string }[] = [
  { at: 10, who: "⚙️ system", text: "你是加一", color: C.muted },
  { at: 40, who: "🙋 user", text: "你好，我叫小王", color: C.ink },
  { at: 155, who: "🤖 assistant", text: "你好，小王！", color: C.green },
  { at: 185, who: "🙋 user", text: "我叫什么？", color: C.ink },
  { at: 300, who: "🤖 assistant", text: "你叫小王", color: C.green },
  { at: 330, who: "🙋 user", text: "讲个笑话", color: C.ink },
  { at: 445, who: "🤖 assistant", text: "从前有只……", color: C.green },
];

// 三轮发送：发出时刻、条数
const SENDS = [
  { start: 60, n: 2 },
  { start: 205, n: 4 },
  { start: 350, n: 6 },
];

const SEND: [number, number][] = [[620, 250], [860, 250]];
const BACK: [number, number][] = [[860, 310], [620, 310]];

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const MessageList: React.FC = () => {
  const frame = useCurrentFrame();
  const sending = SENDS.some((s) => within(frame, s.start - 5, s.start + 35));
  const visible = ROWS.filter((r) => frame >= r.at).length;
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 60,
          top: 110,
          width: 560,
          height: 70 + Math.max(visible, 1) * ROW_H,
          border: `4px solid ${sending ? C.orange : C.line}`,
          background: sending ? "#FFF6E6" : C.card,
          borderRadius: 18,
          boxSizing: "border-box",
        }}
      />
      <div style={{ position: "absolute", left: 90, top: 122, fontSize: 28, fontWeight: 700 }}>
        messages：这桌的订单记录
      </div>
      {ROWS.map((r, i) => {
        const o = interpolate(frame, [r.at, r.at + 12], [0, 1], clamp);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 90,
              top: TOP + i * ROW_H,
              opacity: o,
              translate: `${(1 - o) * -20}px 0px`,
              fontSize: 26,
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ fontWeight: 700, color: r.color }}>{r.who}</span>
            <span>：{r.text}</span>
          </div>
        );
      })}
    </>
  );
};

const SizeBar: React.FC = () => {
  const frame = useCurrentFrame();
  const n = interpolate(
    frame,
    SENDS.flatMap((s) => [s.start, s.start + 20]),
    [0, 2, 2, 4, 4, 6],
    clamp,
  );
  const shown = SENDS.filter((s) => frame >= s.start).pop()?.n ?? 0;
  return (
    <>
      <div style={{ position: "absolute", left: 760, top: 430, fontSize: 28, fontWeight: 700, whiteSpace: "nowrap" }}>
        每次发送量：{shown} 条
      </div>
      <div
        style={{
          position: "absolute",
          left: 760,
          top: 480,
          width: 440,
          height: 40,
          borderRadius: 999,
          background: "#E6ECF2",
          overflow: "hidden",
        }}
      >
        <div style={{ width: `${(n / 6) * 100}%`, height: "100%", background: C.orange, borderRadius: 999 }} />
      </div>
    </>
  );
};

const Scene: React.FC = () => (
  <Stage title="多轮对话：每轮都把整个列表发过去">
    <MessageList />
    <Card
      x={860}
      y={200}
      w={320}
      h={150}
      icon="🧠"
      label="LLM"
      sub="主厨：记不住这桌"
      appear={5}
      active={[[95, 125], [240, 270], [385, 415]]}
    />
    <Arrow points={SEND} appear={20} />
    <Arrow points={BACK} appear={25} />
    <FadeIn appear={30} style={{ left: 0, top: 0, width: 1280, height: 720 }}>
      <SizeBar />
    </FadeIn>

    {SENDS.map((s) => (
      <Packet key={s.start} points={SEND} start={s.start} dur={32} label={`整包 ${s.n} 条`} />
    ))}
    <Packet points={BACK} start={125} dur={28} label="回复" color={C.green} />
    <Packet points={BACK} start={270} dur={28} label="回复" color={C.green} />
    <Packet points={BACK} start={415} dur={28} label="回复" color={C.green} />

    <Caption
      items={[
        { from: 0, to: 60, text: "消息列表就是聊天记录" },
        { from: 60, to: 155, text: "第一轮：发 2 条消息" },
        { from: 155, to: 300, text: "第二轮：前面的话也要再发" },
        { from: 300, to: 445, text: "第三轮：整包 6 条一起发" },
        { from: 445, to: 540, text: "主厨记不住，每次整本递进去" },
      ]}
    />
  </Stage>
);

export const scene: SceneDef = {
  component: Scene,
  durationInFrames: 540,
  fps: 30,
  width: 1280,
  height: 720,
  title: "多轮对话：消息列表每轮变长，程序每次都把整个列表发给模型",
};
