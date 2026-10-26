// 第 5 章：长期记忆——把要点存到外面，用到时再取回来
import { useCurrentFrame } from "remotion";
import { Arrow, C, Caption, Card, Packet, SceneDef, Stage, progress } from "../kit";

const WIN = { x: 60, y: 120, w: 440, h: 450 };
const STORE = { x: 800, y: 120, w: 420, h: 290 };

// 窗口里的一条消息：in 帧出现，out 帧消失（被挤出窗口）
const Msg: React.FC<{
  text: string;
  row: number;
  at: number;
  out?: number;
  color: string;
  fill?: boolean;
}> = ({ text, row, at, out, color, fill }) => {
  const frame = useCurrentFrame();
  const o = progress(frame, at, 15) * (out ? 1 - progress(frame, out, 15) : 1);
  if (o <= 0) return null;
  const lift = out ? progress(frame, out, 15) * 40 : 0;
  return (
    <div
      style={{
        position: "absolute",
        left: WIN.x + 20,
        top: WIN.y + 70 + row * 76 - lift,
        width: WIN.w - 40,
        height: 62,
        borderRadius: 14,
        border: `3px solid ${color}`,
        background: fill ? color : C.card,
        color: fill ? "#fff" : C.ink,
        fontSize: 26,
        fontWeight: 600,
        display: "flex",
        alignItems: "center",
        paddingLeft: 18,
        boxSizing: "border-box",
        whiteSpace: "nowrap",
        opacity: o,
      }}
    >
      {text}
    </div>
  );
};

const Box: React.FC<{ x: number; y: number; w: number; h: number; title: string; color: string; appear: number }> = ({
  x,
  y,
  w,
  h,
  title,
  color,
  appear,
}) => {
  const frame = useCurrentFrame();
  const p = progress(frame, appear, 15);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        border: `5px dashed ${color}`,
        borderRadius: 20,
        boxSizing: "border-box",
        opacity: p,
        textAlign: "center",
        paddingTop: 10,
        fontSize: 26,
        fontWeight: 700,
        color,
      }}
    >
      {title}
    </div>
  );
};

const TOP: [number, number][] = [
  [500, 200],
  [800, 200],
];
const BACK: [number, number][] = [
  [800, 340],
  [500, 340],
];
const TO_LLM: [number, number][] = [
  [500, 500],
  [800, 500],
];

const Scene: React.FC = () => (
  <Stage title="长期记忆：要点存起来，用时再取">
    <Box {...WIN} title="上下文窗口" color={C.blue} appear={0} />
    <Box {...STORE} title="📒 老顾客档案本" color={C.green} appear={0} />

    <Msg text="用户：我叫小王" row={0} at={5} out={110} color={C.blue} />
    <Msg text="用户：我爱吃辣" row={1} at={15} out={110} color={C.blue} />
    <Msg text="加一：记住啦" row={2} at={25} out={110} color={C.green} />

    <Msg text="用户：晚饭吃啥？" row={0} at={170} color={C.blue} />
    <Msg text="📌 记忆：爱吃辣" row={1} at={262} color={C.green} fill />
    <Msg text="加一：去吃川菜吧" row={2} at={345} color={C.purple} />

    <Card x={830} y={180} w={170} h={56} label="住在北京" fontSize={24} appear={0} color={C.green} />
    <Card x={1020} y={180} w={170} h={56} label="喜欢猫" fontSize={24} appear={0} color={C.green} />
    <Card x={830} y={250} w={170} h={56} label="叫小王" fontSize={24} appear={95} color={C.green} />
    <Card x={1020} y={250} w={170} h={56} label="爱吃辣" fontSize={24} appear={100} active={[[215, 262]]} color={C.green} />

    <Card x={800} y={450} w={420} h={100} icon="🧠" label="模型" sub="主厨" appear={0} active={[[315, 345]]} color={C.purple} />

    <Arrow points={TOP} appear={20} />
    <Arrow points={BACK} appear={25} />
    <Arrow points={TO_LLM} appear={30} color={C.purple} />

    <Packet points={TOP} start={55} dur={36} label="总结要点" />
    <Packet points={TOP} start={180} dur={34} label="查：口味偏好" color={C.blue} />
    <Packet points={BACK} start={222} dur={36} label="爱吃辣" color={C.green} />
    <Packet points={TO_LLM} start={282} dur={32} label="问题 + 记忆" color={C.purple} />

    <Caption
      items={[
        { from: 0, to: 100, text: "旧对话快被挤出窗口了" },
        { from: 100, to: 170, text: "要点先记进档案本" },
        { from: 170, to: 262, text: "新问题来了，先翻档案本" },
        { from: 262, to: 345, text: "找到的要点放回窗口" },
        { from: 345, to: 600, text: "模型看到要点，答得上来" },
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
  title: "长期记忆：旧对话的要点存进记忆库，新问题来时按相关度取回，放进上下文窗口交给模型",
};
