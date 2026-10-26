// 第 6 章：协调者拆任务，依次派给调研、写作、发邮件三个 Agent，再汇总结果
import { useCurrentFrame } from "remotion";
import { Arrow, C, Caption, Card, Packet, SceneDef, Stage, progress } from "../kit";

const LEFT: [number, number][] = [[560, 240], [560, 310], [230, 310], [230, 380]];
const MID: [number, number][] = [[640, 240], [640, 380]];
const RIGHT: [number, number][] = [[720, 240], [720, 310], [1050, 310], [1050, 380]];
const back = (pts: [number, number][]) => [...pts].reverse();

// 卡片下方的小注释
const Note: React.FC<{ x: number; appear: number; text: string }> = ({ x, appear, text }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: 505,
        width: 300,
        textAlign: "center",
        fontSize: 24,
        color: C.muted,
        opacity: progress(frame, appear),
      }}
    >
      {text}
    </div>
  );
};

const Scene: React.FC = () => (
  <Stage title="协调者：拆任务、派任务、收结果">
    <Card x={40} y={130} w={240} h={110} icon="🙋" label="用户需求" appear={0} active={[[20, 60]]} color={C.ink} />
    <Card x={490} y={130} w={300} h={110} icon="🧭" label="协调者" appear={8} active={[[60, 100], [445, 485]]} color={C.purple} />
    <Card x={1000} y={130} w={240} h={110} icon="✅" label="最终结果" appear={440} active={[[485, 540]]} color={C.green} />

    <Card x={80} y={380} w={300} h={110} icon="🔎" label="调研 Agent" appear={20} active={[[135, 185]]} />
    <Card x={490} y={380} w={300} h={110} icon="✍️" label="写作 Agent" appear={26} active={[[260, 305]]} />
    <Card x={900} y={380} w={300} h={110} icon="📧" label="邮件 Agent" appear={32} active={[[380, 415]]} />

    <Note x={80} appear={40} text="自己的提示词和工具" />
    <Note x={490} appear={44} text="自己的提示词和工具" />
    <Note x={900} appear={48} text="自己的提示词和工具" />

    <Arrow points={[[280, 185], [490, 185]]} appear={14} />
    <Arrow points={LEFT} appear={40} />
    <Arrow points={MID} appear={46} />
    <Arrow points={RIGHT} appear={52} />
    <Arrow points={[[790, 185], [1000, 185]]} appear={440} color={C.green} />

    <Packet points={[[280, 185], [490, 185]]} start={25} dur={30} label="竞品报告" color={C.ink} />

    <Packet points={LEFT} start={100} dur={35} label="查资料" color={C.purple} />
    <Packet points={back(LEFT)} start={185} dur={35} label="资料" color={C.green} />

    <Packet points={MID} start={225} dur={30} label="资料 + 写报告" color={C.purple} />
    <Packet points={back(MID)} start={305} dur={30} label="报告" color={C.green} />

    <Packet points={RIGHT} start={345} dur={35} label="报告 + 发邮件" color={C.purple} />
    <Packet points={back(RIGHT)} start={415} dur={30} label="已发送" color={C.green} />

    <Packet points={[[790, 185], [1000, 185]]} start={455} dur={28} label="报告已发出" color={C.green} />

    <Caption
      items={[
        { from: 0, to: 60, text: "用户交给协调者一个大任务" },
        { from: 60, to: 100, text: "协调者先把任务拆成三块" },
        { from: 100, to: 225, text: "调研 Agent 只管查资料" },
        { from: 225, to: 345, text: "写作 Agent 拿资料写报告" },
        { from: 345, to: 445, text: "邮件 Agent 把报告发出去" },
        { from: 445, to: 490, text: "三个 Agent 互不直接对话" },
        { from: 490, to: 540, text: "协调者汇总，交给用户" },
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
  title: "Multi-Agent 协调者把任务拆开，依次派给调研、写作、邮件三个 Agent，收回结果后汇总给用户",
};
