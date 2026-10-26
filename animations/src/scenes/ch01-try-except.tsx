// 第 1 章：try / except——出错时接住错误，程序继续跑
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Arrow, C, Caption, Card, FadeIn, Packet, SceneDef, Stage } from "../kit";

const TOP = 130;
const BOT = 340;
const H = 120;

const T = {
  call1: 40,
  crash: 100,
  call2: 170,
  boom2: 230,
  catch: 260,
  ok: 300,
  end: 420,
};

const LaneLabel: React.FC<{ y: number; text: string; color: string; appear: number }> = ({ y, text, color, appear }) => (
  <FadeIn appear={appear} style={{ left: 40, top: y, width: 210, height: H, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 700, color, whiteSpace: "nowrap" }}>
    {text}
  </FadeIn>
);

// 崩溃时整条上方泳道变灰
const Dim: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [T.crash + 20, T.crash + 35], [0, 0.55], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <div style={{ position: "absolute", left: 30, top: TOP - 20, width: 1220, height: H + 40, borderRadius: 20, background: C.bg, opacity: o }} />;
};

const Scene: React.FC = () => {
  const a1: [number, number][] = [[540, TOP + H / 2], [620, TOP + H / 2]];
  const a2: [number, number][] = [[860, TOP + H / 2], [940, TOP + H / 2]];
  const b1: [number, number][] = [[540, BOT + H / 2], [620, BOT + H / 2]];
  const b2: [number, number][] = [[860, BOT + H / 2], [940, BOT + H / 2]];
  return (
    <Stage title="出错了怎么办：try / except">
      <LaneLabel y={TOP} text="没加保护" color={C.red} appear={0} />
      <LaneLabel y={BOT} text="加了 try" color={C.green} appear={T.call2 - 20} />

      <Card x={280} y={TOP} w={260} h={H} icon="📡" label="调用模型" appear={5} active={[[T.call1, T.call1 + 30]]} fontSize={34} />
      <Card x={620} y={TOP} w={240} h={H} icon="💥" label="网络超时" appear={T.call1 + 25} color={C.orange} active={[[T.call1 + 30, T.crash + 10]]} fontSize={34} />
      <Card x={940} y={TOP} w={290} h={H} icon="🛑" label="程序崩溃" appear={T.crash} color={C.red} active={[[T.crash, T.end]]} fontSize={34} />
      <Arrow points={a1} appear={T.call1 + 15} />
      <Arrow points={a2} appear={T.crash - 5} color={C.red} />
      <Packet points={a1} start={T.call1 + 15} dur={20} label="请求" color={C.blue} />
      <Dim />

      <Card x={280} y={BOT} w={260} h={H} icon="📡" label="调用模型" appear={T.call2 - 15} active={[[T.call2, T.call2 + 30]]} fontSize={34} />
      <Card x={620} y={BOT} w={240} h={H} icon="💥" label="网络超时" appear={T.call2 + 25} color={C.orange} active={[[T.call2 + 30, T.catch]]} fontSize={34} />
      <Card x={940} y={BOT} w={290} h={H} icon="🧯" label="except 接住" appear={T.catch - 5} color={C.green} active={[[T.catch, T.end]]} fontSize={34} />
      <Arrow points={b1} appear={T.call2 + 15} />
      <Arrow points={b2} appear={T.boom2} color={C.green} />
      <Packet points={b1} start={T.call2 + 15} dur={20} label="请求" color={C.blue} />
      <Packet points={b2} start={T.boom2} dur={25} label="错误" color={C.orange} />

      <FadeIn appear={T.ok} style={{ left: 860, top: BOT + H + 16, width: 400, whiteSpace: "nowrap", textAlign: "center", fontSize: 26, color: C.ink, lineHeight: 1.5 }}>
        回复“网络出错，请重试”
        <br />
        ✅ 程序继续运行
      </FadeIn>

      <Caption
        items={[
          { from: 0, to: T.crash, text: "调用模型要走网络，可能出错" },
          { from: T.crash, to: T.call2, text: "没加保护：一出错程序就停" },
          { from: T.call2, to: T.catch, text: "这次把调用包进 try 里" },
          { from: T.catch, to: T.ok, text: "错误被 except 接住" },
          { from: T.ok, to: T.end, text: "给用户一句提示，接着跑" },
        ]}
      />
    </Stage>
  );
};

export const scene: SceneDef = {
  component: Scene,
  durationInFrames: T.end,
  fps: 30,
  width: 1280,
  height: 720,
  title: "try/except 的作用：没加保护时网络出错会让程序崩溃；加了 try 后错误被 except 接住，程序给出提示并继续运行",
};
