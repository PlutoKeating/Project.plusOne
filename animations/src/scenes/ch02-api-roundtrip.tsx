// 第 2 章：一次 API 调用的往返——程序发请求，模型生成，回答原路返回
import { Arrow, C, Caption, Card, FadeIn, Packet, SceneDef, Stage } from "../kit";

const REQ_A: [number, number][] = [[320, 290], [510, 290]];
const REQ_B: [number, number][] = [[770, 290], [960, 290]];
const RES_A: [number, number][] = [[960, 350], [770, 350]];
const RES_B: [number, number][] = [[510, 350], [320, 350]];

const Row: React.FC<{ k: string; v: string }> = ({ k, v }) => (
  <div style={{ fontSize: 26, lineHeight: 1.6, whiteSpace: "nowrap" }}>
    <span style={{ fontWeight: 700, color: C.blue }}>{k}</span>
    <span style={{ color: C.muted }}>：{v}</span>
  </div>
);

const Scene: React.FC = () => (
  <Stage title="一次 API 调用：发出去，拿回来">
    <Card x={60} y={230} w={260} h={160} icon="💻" label="你的程序" sub="服务员" appear={0} active={[[330, 420]]} color={C.ink} />
    <Card x={510} y={230} w={260} h={160} icon="🌐" label="API 端点" sub="后厨的传菜窗口" appear={8} active={[[110, 150]]} color={C.orange} />
    <Card x={960} y={230} w={260} h={160} icon="🧠" label="LLM" sub="主厨：读单、做菜" appear={16} active={[[185, 260]]} />

    <Arrow points={REQ_A} appear={20} />
    <Arrow points={REQ_B} appear={25} />
    <Arrow points={RES_A} appear={30} />
    <Arrow points={RES_B} appear={35} />

    <FadeIn appear={35} style={{ left: 60, top: 430 }}>
      <div
        style={{
          background: C.card,
          border: `3px dashed ${C.line}`,
          borderRadius: 16,
          padding: "14px 26px",
        }}
      >
        <div style={{ fontSize: 26, fontWeight: 700, marginBottom: 4 }}>📦 请求里装着</div>
        <Row k="model" v="选哪个模型" />
        <Row k="messages" v="聊天记录" />
        <Row k="API Key" v="证明你是谁" />
      </div>
    </FadeIn>

    <Packet points={REQ_A} start={75} dur={32} label="请求" color={C.ink} />
    <Packet points={REQ_B} start={150} dur={32} label="消息" color={C.orange} />
    <Packet points={RES_A} start={260} dur={32} label="回答" color={C.green} />
    <Packet points={RES_B} start={295} dur={32} label="回答" color={C.green} />

    <Caption
      items={[
        { from: 0, to: 75, text: "程序把问题打包成请求" },
        { from: 75, to: 150, text: "请求带着 Key 发到服务商" },
        { from: 150, to: 260, text: "模型读完消息，写出回答" },
        { from: 260, to: 340, text: "回答原路送回程序" },
        { from: 340, to: 420, text: "一发一收，就是一次调用" },
      ]}
    />
  </Stage>
);

export const scene: SceneDef = {
  component: Scene,
  durationInFrames: 420,
  fps: 30,
  width: 1280,
  height: 720,
  title: "一次 LLM API 调用：程序把请求发到 API 端点，模型生成回答后原路返回给程序",
};
