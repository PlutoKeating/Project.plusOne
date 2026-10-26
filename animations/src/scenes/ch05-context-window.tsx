// 第 5 章：上下文窗口大小固定，新消息进来，旧消息被挤出去
import { interpolate, useCurrentFrame } from "remotion";
import { C, Caption, FadeIn, SceneDef, Stage, progress } from "../kit";

const MSGS: { text: string; at: number; who: "user" | "bot" | "fail" }[] = [
  { text: "用户：我叫小王", at: 20, who: "user" },
  { text: "加一：你好，小王", at: 60, who: "bot" },
  { text: "用户：北京天气？", at: 100, who: "user" },
  { text: "加一：北京晴 25°C", at: 140, who: "bot" },
  { text: "用户：那上海呢？", at: 180, who: "user" },
  { text: "加一：上海多云 22°C", at: 230, who: "bot" },
  { text: "用户：我叫什么？", at: 290, who: "user" },
  { text: "加一：……不记得了", at: 350, who: "fail" },
];

const BOX = { x: 380, y: 120, w: 520, h: 470 };
const SLOTS = 5;
const ROW = 78;
const PILL_H = 64;
const BOTTOM_Y = BOX.y + BOX.h - 16 - PILL_H;

const color = (who: string) => (who === "user" ? C.blue : who === "bot" ? C.green : C.red);

const Window: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: BOX.x,
          top: BOX.y,
          width: BOX.w,
          height: BOX.h,
          border: `5px dashed ${C.blue}`,
          borderRadius: 20,
          boxSizing: "border-box",
          background: "#EEF4FB",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: BOX.x,
          width: BOX.w,
          top: BOX.y + 10,
          textAlign: "center",
          fontSize: 26,
          fontWeight: 700,
          color: C.blue,
        }}
      >
        上下文窗口（最多 5 条）
      </div>
      {MSGS.map((m, i) => {
        const appear = progress(frame, m.at, 15);
        if (appear <= 0) return null;
        // 后来的消息每进来一条，这条就往上挪一格
        let pos = 0;
        for (let j = i + 1; j < MSGS.length; j++) pos += progress(frame, MSGS[j].at, 20);
        const over = Math.max(0, pos - (SLOTS - 1));
        const inside = over <= 0;
        const y = inside ? BOTTOM_Y - pos * ROW + (1 - appear) * 30 : BOTTOM_Y - (SLOTS - 1) * ROW;
        // 被挤出的消息滑向左边的"丢掉"区
        const x = inside ? BOX.x + 20 : interpolate(over, [0, 1], [BOX.x + 20, 40]);
        const outY = interpolate(over, [0, 1], [y, 230 + (i * 70)], { extrapolateRight: "clamp" });
        const c = color(m.who);
        return (
          <div
            key={m.text}
            style={{
              position: "absolute",
              left: inside ? x : Math.max(40, x),
              top: inside ? y : outY,
              width: inside ? BOX.w - 40 : interpolate(over, [0, 1], [BOX.w - 40, 300], { extrapolateRight: "clamp" }),
              height: PILL_H,
              borderRadius: 14,
              background: inside ? C.card : "#E3E7EC",
              border: `3px solid ${inside ? c : C.line}`,
              color: inside ? C.ink : C.muted,
              textDecoration: over >= 1 ? "line-through" : "none",
              fontSize: 26,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              paddingLeft: 18,
              boxSizing: "border-box",
              whiteSpace: "nowrap",
              opacity: appear,
            }}
          >
            {m.text}
          </div>
        );
      })}
    </>
  );
};

const Scene: React.FC = () => (
  <Stage title="上下文窗口：装满了就挤掉最旧的">
    <FadeIn appear={200} style={{ left: 40, top: 170, width: 300, textAlign: "center", fontSize: 26, color: C.muted }}>
      🗑️ 被挤出去的
    </FadeIn>
    <Window />
    <FadeIn appear={110} style={{ left: 940, top: 240, width: 300, fontSize: 28, lineHeight: 1.6, color: C.ink }}>
      🧾 像出餐台订单夹
      <br />
      📏 只夹得下 5 张
      <br />
      📥 新消息从下面进
      <br />
      📤 最旧的从上面出
    </FadeIn>
    <Caption
      items={[
        { from: 0, to: 110, text: "每轮对话都放进窗口" },
        { from: 110, to: 220, text: "订单夹快夹满了" },
        { from: 220, to: 330, text: "新消息进来，最旧的被挤掉" },
        { from: 330, to: 600, text: "名字被挤掉，加一就忘了" },
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
  title: "上下文窗口大小固定：对话越来越长，最早的消息被挤出窗口，模型就忘了",
};
