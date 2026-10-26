// 第 1 章：几个 Python 概念拼成一个对话助手
// 字符串进来 → 放进列表 → 函数调用 → 返回值也进列表 → 打印 → 等下一句
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Arrow, C, Caption, Card, FadeIn, Packet, SceneDef, Stage } from "../kit";

// 列表框
const LX = 430;
const LY = 120;
const LW = 420;
const LH = 420;

// 列表里的一条消息（一个字典）
const Msg: React.FC<{ i: number; at: number; who: "user" | "bot"; text: string }> = ({ i, at, who, text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: { damping: 200 } });
  const color = who === "user" ? C.blue : C.green;
  return (
    <div
      style={{
        position: "absolute",
        left: LX + 24,
        top: LY + 80 + i * 78,
        width: LW - 48,
        height: 62,
        opacity: p,
        translate: `${(1 - p) * -40}px 0px`,
        borderRadius: 12,
        background: `${color}22`,
        border: `3px solid ${color}`,
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        paddingLeft: 16,
        fontSize: 26,
        whiteSpace: "nowrap",
        color: C.ink,
      }}
    >
      <b style={{ color, marginRight: 10 }}>{who === "user" ? "👤 用户" : "🤖 助手"}</b>
      {text}
    </div>
  );
};

const ListBox: React.FC<{ active: [number, number][] }> = ({ active }) => {
  const frame = useCurrentFrame();
  const on = active.some(([a, b]) => frame >= a && frame < b);
  const p = interpolate(frame, [5, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        position: "absolute",
        left: LX,
        top: LY,
        width: LW,
        height: LH,
        opacity: p,
        borderRadius: 18,
        border: `4px ${on ? "solid" : "dashed"} ${C.purple}`,
        background: on ? `${C.purple}12` : C.card,
        boxSizing: "border-box",
      }}
    >
      <div style={{ textAlign: "center", marginTop: 16, fontSize: 30, fontWeight: 700, color: C.purple }}>
        📜 对话历史（列表）
      </div>
    </div>
  );
};

// 时间轴
const T = {
  in1: 30, // 字符串出发
  add1: 70, // 进列表
  call1: 120, // 历史传给函数
  ret1: 175, // 函数返回
  add2: 210,
  print1: 240,
  loop: 290, // 回到开头
  in2: 330,
  add3: 355,
  add4: 400,
  end: 540,
};

const Scene: React.FC = () => {
  const inToList: [number, number][] = [[300, 200], [LX, 200]];
  const listToFn: [number, number][] = [[LX + LW, 180], [980, 180]];
  const fnToList: [number, number][] = [[980, 250], [LX + LW, 250]];
  const listToPrint: [number, number][] = [[LX + LW, 465], [980, 465]];
  const loopBack: [number, number][] = [[1105, 530], [1105, 585], [175, 585], [175, 265]];
  return (
    <Stage title="几个 Python 概念拼成对话助手">
      <ListBox active={[[T.add1, T.call1 + 20], [T.add2, T.print1 + 20], [T.add3, T.add4 + 30]]} />
      <Card x={50} y={135} w={250} h={130} icon="⌨️" label="用户输入" sub="字符串" appear={0} fontSize={35} active={[[T.in1, T.add1], [T.in2, T.add3]]} color={C.blue} />
      <Card x={980} y={135} w={250} h={130} icon="⚙️" label="调用模型" sub="函数" appear={10} fontSize={35} active={[[T.call1 + 25, T.ret1 + 10], [T.add3 + 10, T.add4]]} color={C.orange} />
      <Card x={980} y={400} w={250} h={130} icon="🖨️" label="打印回复" appear={20} fontSize={35} active={[[T.print1 + 25, T.loop]]} color={C.green} />

      <Arrow points={inToList} appear={15} />
      <Arrow points={listToFn} appear={20} />
      <Arrow points={fnToList} appear={25} />
      <Arrow points={listToPrint} appear={30} />
      <Arrow points={loopBack} appear={T.loop - 20} dur={25} dashed color={C.muted} />

      <Packet points={inToList} start={T.in1} dur={35} label="“你好”" color={C.blue} />
      <Packet points={listToFn} start={T.call1} dur={30} label="历史" color={C.purple} />
      <Packet points={fnToList} start={T.ret1} dur={30} label="“你好呀”" color={C.green} />
      <Packet points={listToPrint} start={T.print1} dur={28} label="你好呀" color={C.green} />
      <Packet points={loopBack} start={T.loop} dur={40} label="下一句" color={C.muted} />
      <Packet points={inToList} start={T.in2 - 5} dur={25} label="“讲个笑话”" color={C.blue} />
      <Packet points={listToFn} start={T.add3 + 5} dur={20} label="历史" color={C.purple} />
      <Packet points={fnToList} start={T.add4 - 25} dur={20} label="回复" color={C.green} />

      <Msg i={0} at={T.add1} who="user" text="你好" />
      <Msg i={1} at={T.add2} who="bot" text="你好呀" />
      <Msg i={2} at={T.add3} who="user" text="讲个笑话" />
      <Msg i={3} at={T.add4} who="bot" text="从前有个程序员…" />

      <FadeIn appear={T.add1 + 15} style={{ left: LX, top: LY + LH + 2, width: LW, textAlign: "center", fontSize: 24, color: C.muted }}>
        每条消息是一个字典
      </FadeIn>

      <Caption
        items={[
          { from: 0, to: T.add1, text: "用户打了一句话：字符串" },
          { from: T.add1, to: T.call1, text: "放进对话历史：一个列表" },
          { from: T.call1, to: T.ret1, text: "把整段历史交给函数" },
          { from: T.ret1, to: T.print1, text: "函数返回回复，也存进列表" },
          { from: T.print1, to: T.loop, text: "打印给用户看" },
          { from: T.loop, to: T.in2 + 20, text: "循环：回到开头等下一句" },
          { from: T.in2 + 20, to: T.end, text: "列表越来越长，加一记得上文" },
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
  title: "对话助手的数据流：用户输入的字符串放进列表，函数拿到整段历史返回回复，回复存回列表并打印，然后循环",
};
