// 速查表：整个技术栈怎么一层层叠起来
import { C, Caption, Card, FadeIn, SceneDef, Stage } from "../kit";

const X = 300;
const W = 760;
const H = 80;
const rowY = (i: number) => 520 - i * 95; // i=0 最底层

type Layer = { y: number; appear: number; tag: string; hl: [number, number] };

const L: Layer[] = [
  { y: rowY(0), appear: 10, tag: "第 2 章", hl: [360, 395] },
  { y: rowY(1), appear: 70, tag: "第 3 章", hl: [340, 365] },
  { y: rowY(2), appear: 130, tag: "第 4 章", hl: [320, 345] },
  { y: rowY(3), appear: 190, tag: "第 5 章", hl: [300, 325] },
  { y: rowY(4), appear: 250, tag: "第 6 章", hl: [280, 305] },
];

const Scene: React.FC = () => (
  <Stage title="技术栈：一层叠一层">
    {L.map((l) => (
      <FadeIn key={l.tag} appear={l.appear} style={{ left: 120, top: l.y + 22, fontSize: 26, color: C.muted }}>
        {l.tag}
      </FadeIn>
    ))}

    <Card x={X} y={L[0].y} w={W} h={H} icon="🧠" label="LLM：主厨，负责动脑" appear={L[0].appear} active={[L[0].hl]} color={C.blue} fontSize={30} />
    <Card x={X} y={L[1].y} w={W} h={H} icon="📚" label="RAG：先翻菜谱库再做菜" appear={L[1].appear} active={[L[1].hl]} color={C.green} fontSize={30} />
    <Card x={X} y={L[2].y} w={W} h={H} icon="🔧" label="Agent：主厨开单，帮厨取货" appear={L[2].appear} active={[L[2].hl]} color={C.orange} fontSize={30} />
    <Card x={X} y={L[3].y} w={370} h={H} icon="🔌" label="MCP：统一供货标准" appear={L[3].appear} active={[L[3].hl]} color={C.purple} fontSize={30} />
    <Card x={X + 390} y={L[3].y} w={370} h={H} icon="🗂️" label="Memory：顾客档案本" appear={L[3].appear + 8} active={[L[3].hl]} color={C.purple} fontSize={30} />
    <Card x={X} y={L[4].y} w={W} h={H} icon="👥" label="Multi-Agent：分档口协作" appear={L[4].appear} active={[L[4].hl]} color={C.red} fontSize={30} />

    <Caption
      items={[
        { from: 0, to: 70, text: "地基是主厨 LLM，负责动脑" },
        { from: 70, to: 130, text: "加上 RAG，先翻菜谱" },
        { from: 130, to: 190, text: "加上工具，帮厨跑腿取货" },
        { from: 190, to: 250, text: "供货统一，熟客记得住" },
        { from: 250, to: 280, text: "几个档口一起开工" },
        { from: 280, to: 420, text: "上层每一步都靠下层" },
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
  title: "技术栈分层：LLM 打底，依次叠上 RAG、Agent、MCP 与 Memory，最上层是 Multi-Agent",
};
