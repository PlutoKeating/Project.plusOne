// 第 5 章：MCP 的"发现 → 选择 → 调用"
import { useCurrentFrame } from "remotion";
import { Arrow, C, Caption, Card, FadeIn, Packet, SceneDef, Stage, progress, within } from "../kit";

const STEPS: { label: string; from: number; to: number; color: string }[] = [
  { label: "① 发现", from: 80, to: 170, color: C.blue },
  { label: "② 选择", from: 170, to: 290, color: C.purple },
  { label: "③ 调用", from: 290, to: 420, color: C.orange },
];

// 底部的步骤指示条
const StepPills: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      {STEPS.map((s, i) => {
        const on = within(frame, s.from, s.to) || frame >= 420;
        const p = progress(frame, 60 + i * 6, 15);
        return (
          <div
            key={s.label}
            style={{
              position: "absolute",
              left: 60 + i * 250,
              top: 470,
              width: 220,
              height: 60,
              borderRadius: 999,
              border: `4px solid ${s.color}`,
              background: on ? s.color : C.card,
              color: on ? "#fff" : C.ink,
              fontSize: 28,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxSizing: "border-box",
              opacity: p,
            }}
          >
            {s.label}
          </div>
        );
      })}
    </>
  );
};

const TOP: [number, number][] = [
  [360, 290],
  [920, 290],
];
const BOTTOM: [number, number][] = [
  [920, 370],
  [360, 370],
];
const TO_LLM: [number, number][] = [
  [200, 240],
  [200, 150],
  [470, 150],
];
const FROM_LLM: [number, number][] = [
  [470, 195],
  [290, 195],
  [290, 240],
];

const Scene: React.FC = () => (
  <Stage title="MCP：发现 → 选择 → 调用">
    <Card x={60} y={240} w={300} h={180} icon="🤖" label="Agent" sub="餐厅 + 采购员" appear={0} active={[[80, 95], [170, 185], [285, 300], [410, 430]]} />
    <Card x={920} y={240} w={300} h={180} icon="🧩" label="MCP Server" sub="供应商" fontSize={30} appear={10} active={[[118, 135], [330, 372]]} color={C.green} />
    <Card x={470} y={110} w={320} h={110} icon="🧠" label="模型" sub="主厨：挑一个工具" appear={20} active={[[205, 245]]} color={C.purple} />

    <Card x={940} y={440} w={260} h={50} label="🌤 get_weather" fontSize={24} appear={130} active={[[335, 372]]} color={C.orange} />
    <Card x={940} y={500} w={260} h={50} label="🔍 search" fontSize={24} appear={138} color={C.orange} />
    <Card x={940} y={560} w={260} h={50} label="✉️ send_email" fontSize={24} appear={146} color={C.orange} />

    <Arrow points={TOP} appear={30} />
    <Arrow points={BOTTOM} appear={40} />
    <Arrow points={TO_LLM} appear={50} color={C.purple} />
    <Arrow points={FROM_LLM} appear={55} color={C.purple} />

    <FadeIn appear={30} style={{ left: 360, width: 560, top: 312, textAlign: "center", fontSize: 26, color: C.muted }}>
      📋 MCP：统一的送货单格式
    </FadeIn>

    <StepPills />

    <Packet points={TOP} start={85} dur={32} label="有哪些工具？" color={C.blue} />
    <Packet points={BOTTOM} start={132} dur={32} label="工具清单" color={C.green} />
    <Packet points={TO_LLM} start={175} dur={30} label="清单 + 问题" color={C.blue} />
    <Packet points={[[470, 195], [290, 195], [290, 210]]} start={245} dur={36} label="用 get_weather" color={C.purple} />
    <Packet points={TOP} start={295} dur={34} label="get_weather(北京)" />
    <Packet points={BOTTOM} start={375} dur={34} label="晴 25°C" color={C.green} />

    <Caption
      items={[
        { from: 0, to: 80, text: "MCP 像统一供货标准" },
        { from: 80, to: 170, text: "先问供应商：有哪些工具？" },
        { from: 170, to: 290, text: "模型看清单，挑一个来用" },
        { from: 290, to: 420, text: "Server 动手执行，交回结果" },
        { from: 420, to: 600, text: "新供应商按标准接入就能用" },
      ]}
    />
  </Stage>
);

export const scene: SceneDef = {
  component: Scene,
  durationInFrames: 510,
  fps: 30,
  width: 1280,
  height: 720,
  title: "MCP 的三步：Agent 向 Server 要工具清单，模型挑选工具，Server 执行并返回结果",
};
