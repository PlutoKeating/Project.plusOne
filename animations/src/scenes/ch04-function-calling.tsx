// 第 4 章：Function Calling 四步——程序和 LLM 之间来回传递的消息
import { Arrow, C, Caption, Card, FadeIn, Packet, SceneDef, Stage } from "../kit";

const L = 340; // 程序卡片右边缘
const R = 940; // LLM 卡片左边缘

// 每一步留在箭头上方的说明
const Note: React.FC<{ y: number; appear: number; text: string; color: string }> = ({
  y,
  appear,
  text,
  color,
}) => (
  <FadeIn appear={appear} style={{ left: L, width: R - L, top: y - 50, textAlign: "center" }}>
    <span style={{ fontSize: 26, fontWeight: 700, color, whiteSpace: "nowrap" }}>{text}</span>
  </FadeIn>
);

const Scene: React.FC = () => (
  <Stage title="Function Calling：四步来回">
    <Card
      x={60}
      y={120}
      w={280}
      h={440}
      icon="💻"
      label="你的程序"
      appear={0}
      active={[[40, 80], [195, 265], [280, 320]]}
      color={C.orange}
    />
    <Card
      x={940}
      y={120}
      w={280}
      h={440}
      icon="🧠"
      label="LLM"
      appear={8}
      active={[[120, 160], [350, 480]]}
    />

    <FadeIn appear={10} style={{ left: 60, width: 280, top: 572, textAlign: "center", fontSize: 26, color: C.muted }}>
      帮厨：照单去取
    </FadeIn>
    <FadeIn appear={18} style={{ left: 940, width: 280, top: 572, textAlign: "center", fontSize: 26, color: C.muted }}>
      主厨：只开领料单
    </FadeIn>

    {/* ① 程序 → LLM */}
    <Arrow points={[[L + 10, 210], [R - 10, 210]]} appear={30} color={C.orange} />
    <Packet points={[[L + 10, 210], [R - 10, 210]]} start={40} dur={38} label="问题 + 工具清单" color={C.orange} />
    <Note y={210} appear={80} text="① 问题 + 工具清单" color={C.orange} />

    {/* ② LLM → 程序 */}
    <Arrow points={[[R - 10, 310], [L + 10, 310]]} appear={110} color={C.blue} />
    <Packet points={[[R - 10, 310], [L + 10, 310]]} start={120} dur={38} label="get_weather(北京)" color={C.blue} />
    <Note y={310} appear={160} text="② 请调用 get_weather(北京)" color={C.blue} />

    {/* ③ 程序本地执行 */}
    <Card
      x={380}
      y={355}
      w={360}
      h={70}
      icon="🔧"
      label="③ 本地执行 → 晴 25°C"
      appear={195}
      active={[[200, 265]]}
      color={C.orange}
      fontSize={26}
    />

    {/* ④ 程序 → LLM */}
    <Arrow points={[[L + 10, 510], [R - 10, 510]]} appear={270} color={C.green} />
    <Packet points={[[L + 10, 510], [R - 10, 510]]} start={280} dur={38} label="晴 25°C" color={C.green} />
    <Note y={510} appear={320} text="④ 工具结果：晴 25°C" color={C.green} />

    <Caption
      items={[
        { from: 0, to: 110, text: "① 程序把问题和工具清单发给 LLM" },
        { from: 110, to: 190, text: "② LLM 开领料单：调哪个工具" },
        { from: 190, to: 270, text: "③ 程序在本地执行工具" },
        { from: 270, to: 350, text: "④ 把结果发回给 LLM" },
        { from: 350, to: 480, text: "LLM 写回答，或再要一个工具" },
      ]}
    />
  </Stage>
);

export const scene: SceneDef = {
  component: Scene,
  durationInFrames: 480,
  fps: 30,
  width: 1280,
  height: 720,
  title: "Function Calling 四步：程序发问题和工具清单，LLM 回调用请求，程序执行工具，再把结果发回 LLM",
};
