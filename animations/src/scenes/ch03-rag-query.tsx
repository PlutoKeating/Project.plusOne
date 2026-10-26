// 第 3 章：查询流水线——问题 → 向量 → 找最近的几块 → 拼进 Prompt → LLM 回答（每来一单：取卡 → 递给主厨 → 出菜）
import { Arrow, C, Caption, Card, Packet, SceneDef, Stage } from "../kit";

const Scene: React.FC = () => (
  <Stage title="查询：先取菜谱卡，再做菜">
    {/* 第一排：从左到右 */}
    <Card x={40} y={150} w={220} h={110} icon="🙋" label="用户问题" appear={0} active={[[10, 70]]} color={C.ink} />
    <Card x={330} y={150} w={270} h={110} icon="🔢" label="Embedding" appear={10} active={[[90, 130]]} />
    <Card x={680} y={150} w={240} h={110} icon="🗄️" label="向量库" appear={20} active={[[160, 200]]} color={C.green} />
    <Card x={1000} y={150} w={240} h={110} icon="📑" label="最近 2 块" appear={30} active={[[230, 260]]} color={C.orange} />

    {/* 第二排：从右到左 */}
    <Card x={1000} y={400} w={240} h={110} icon="📝" label="拼 Prompt" appear={40} active={[[300, 340]]} color={C.purple} />
    <Card x={680} y={400} w={240} h={110} icon="🧠" label="LLM 主厨" appear={50} active={[[370, 420]]} />
    <Card x={320} y={400} w={280} h={110} icon="💬" label="加一的回答" appear={60} active={[[450, 540]]} color={C.green} />

    <Arrow points={[[260, 205], [330, 205]]} appear={20} />
    <Arrow points={[[600, 205], [680, 205]]} appear={30} />
    <Arrow points={[[920, 205], [1000, 205]]} appear={40} />
    <Arrow points={[[1120, 260], [1120, 400]]} appear={50} />
    <Arrow points={[[1000, 455], [920, 455]]} appear={60} />
    <Arrow points={[[680, 455], [600, 455]]} appear={70} />

    <Packet points={[[150, 112], [465, 112]]} start={60} dur={28} label="财报数据？" color={C.ink} />
    <Packet points={[[465, 112], [800, 112]]} start={130} dur={28} label="[0.3, 0.8…]" color={C.blue} />
    <Packet points={[[800, 112], [1110, 112]]} start={200} dur={28} label="块 7、块 12" color={C.orange} />
    <Packet points={[[1120, 260], [1120, 400]]} start={262} dur={34} label="资料" color={C.orange} />
    <Packet points={[[1120, 555], [800, 555]]} start={340} dur={28} label="资料 + 问题" color={C.purple} />
    <Packet points={[[800, 555], [460, 555]]} start={420} dur={28} label="回答" color={C.green} />

    <Caption
      items={[
        { from: 0, to: 90, text: "顾客提出问题" },
        { from: 90, to: 160, text: "问题也算出口味坐标" },
        { from: 160, to: 262, text: "从柜里取最接近的几张卡" },
        { from: 262, to: 370, text: "菜谱卡和订单夹在一起" },
        { from: 370, to: 450, text: "主厨照着菜谱卡做菜" },
        { from: 450, to: 540, text: "菜谱里没有，就说没有" },
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
  title: "RAG 查询流水线：问题变成向量，在向量库里找最近的几块资料，和问题一起拼进 Prompt，再由 LLM 回答",
};
