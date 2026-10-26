// 第 4 章：ReAct 循环——思考、调用工具、看结果、再思考
import { Arrow, C, Caption, Card, Packet, SceneDef, Stage } from "../kit";

const Scene: React.FC = () => (
  <Stage title="Agent 循环：想一步，做一步">
    <Card x={50} y={170} w={220} h={110} icon="🙋" label="用户提问" appear={0} active={[[60, 90]]} color={C.ink} />
    <Card x={520} y={150} w={240} h={130} icon="🧠" label="LLM 思考" sub="下一步做什么？" appear={10} active={[[90, 130], [295, 335]]} />
    <Card x={940} y={380} w={300} h={120} icon="🔧" label="程序执行工具" appear={20} active={[[170, 200]]} color={C.orange} />
    <Card x={500} y={500} w={280} h={110} icon="📋" label="结果放回对话" appear={30} active={[[240, 262]]} color={C.green} />
    <Card x={1000} y={160} w={220} h={110} icon="💬" label="最终回答" appear={330} active={[[365, 450]]} color={C.purple} />

    <Arrow points={[[270, 225], [520, 215]]} appear={30} />
    <Arrow points={[[700, 280], [700, 330], [1090, 330], [1090, 380]]} appear={40} label="要用工具" labelAt={[890, 318]} />
    <Arrow points={[[1090, 500], [1090, 555], [780, 555]]} appear={50} />
    <Arrow points={[[580, 500], [580, 280]]} appear={60} />
    <Arrow points={[[760, 200], [1000, 210]]} appear={330} label="信息够了" labelAt={[880, 188]} color={C.purple} />

    <Packet points={[[270, 225], [520, 215]]} start={60} dur={28} label="北京天气？" color={C.ink} />
    <Packet points={[[700, 280], [700, 330], [1090, 330], [1090, 380]]} start={130} dur={38} label="get_weather(北京)" />
    <Packet points={[[1090, 500], [1090, 555], [780, 555]]} start={200} dur={38} label="晴 25°C" color={C.green} />
    <Packet points={[[580, 500], [580, 280]]} start={262} dur={30} label="晴 25°C" color={C.green} />
    <Packet points={[[760, 200], [1000, 210]]} start={335} dur={28} label="北京晴，25°C" color={C.purple} />

    <Caption
      items={[
        { from: 0, to: 90, text: "用户提出问题" },
        { from: 90, to: 130, text: "LLM 判断：要查天气，得用工具" },
        { from: 130, to: 200, text: "LLM 只说要调哪个工具，真正去查的是程序" },
        { from: 200, to: 295, text: "工具结果写回对话记录，交还给 LLM" },
        { from: 295, to: 365, text: "LLM 再想一次：信息够了，开始回答" },
        { from: 365, to: 450, text: "不够就继续绕圈，直到能回答为止" },
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
  title: "Agent 的 ReAct 循环：LLM 思考、程序执行工具、结果放回对话，再由 LLM 决定是否回答",
};
