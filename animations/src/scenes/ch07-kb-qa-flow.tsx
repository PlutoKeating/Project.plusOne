// 第 7 章：知识库问答助手的完整数据流——先入库，再问答
import { Arrow, C, Caption, Card, Packet, SceneDef, Stage } from "../kit";

const DOC_CHUNK: [number, number][] = [[220, 165], [290, 165]];
const CHUNK_VEC: [number, number][] = [[470, 165], [540, 165]];
const VEC_DB: [number, number][] = [[740, 165], [1050, 165], [1050, 250]];
const Q_QVEC: [number, number][] = [[220, 315], [290, 315]];
const QVEC_DB: [number, number][] = [[490, 315], [860, 315]];
const DB_PROMPT: [number, number][] = [[1050, 360], [1050, 500], [990, 500]];
const PROMPT_LLM: [number, number][] = [[750, 500], [640, 500]];
const LLM_ANS: [number, number][] = [[420, 500], [340, 500]];

const Scene: React.FC = () => (
  <Stage title="知识库问答助手：数据怎么走">
    {/* 入库：提前做一次 */}
    <Card x={40} y={120} w={180} h={90} icon="📄" label="文档" appear={0} active={[[25, 45]]} color={C.ink} fontSize={30} />
    <Card x={290} y={120} w={180} h={90} icon="✂️" label="切块" appear={6} active={[[60, 80]]} color={C.blue} fontSize={30} />
    <Card x={540} y={120} w={200} h={90} icon="🔢" label="转向量" appear={12} active={[[90, 110]]} color={C.blue} fontSize={30} />
    <Card x={860} y={250} w={380} h={110} icon="🗄️" label="向量库" sub="按意思找相似段落" appear={18} active={[[130, 160], [240, 290]]} color={C.purple} />

    <Arrow points={DOC_CHUNK} appear={20} />
    <Arrow points={CHUNK_VEC} appear={24} />
    <Arrow points={VEC_DB} appear={28} />

    <Packet points={DOC_CHUNK} start={30} dur={25} label="手册.pdf" color={C.ink} />
    <Packet points={CHUNK_VEC} start={62} dur={25} label="300 段" />
    <Packet points={VEC_DB} start={95} dur={35} label="[0.12, -0.8, …]" />

    {/* 问答：每次提问都走一遍 */}
    <Card x={40} y={270} w={180} h={90} icon="🙋" label="提问" appear={150} active={[[165, 190]]} color={C.ink} fontSize={30} />
    <Card x={290} y={270} w={200} h={90} icon="🔢" label="转向量" appear={156} active={[[198, 222]]} color={C.blue} fontSize={30} />
    <Arrow points={Q_QVEC} appear={160} />
    <Arrow points={QVEC_DB} appear={164} label="找最像的 3 段" labelAt={[675, 300]} />

    <Packet points={Q_QVEC} start={170} dur={25} label="年假几天？" color={C.ink} />
    <Packet points={QVEC_DB} start={205} dur={32} label="问题向量" />

    <Card x={750} y={450} w={240} h={100} icon="📝" label="拼提示词" appear={280} active={[[325, 360]]} color={C.orange} fontSize={30} />
    <Card x={420} y={450} w={220} h={100} icon="🧠" label="LLM" appear={286} active={[[395, 440]]} color={C.blue} fontSize={30} />
    <Card x={40} y={450} w={300} h={100} icon="💬" label="答案 + 出处" appear={292} active={[[475, 600]]} color={C.green} fontSize={30} />
    <Arrow points={DB_PROMPT} appear={290} />
    <Arrow points={PROMPT_LLM} appear={294} />
    <Arrow points={LLM_ANS} appear={298} />

    <Packet points={DB_PROMPT} start={292} dur={32} label="3 段原文" color={C.purple} />
    <Packet points={PROMPT_LLM} start={360} dur={32} label="问题 + 原文" color={C.orange} />
    <Packet points={LLM_ANS} start={440} dur={32} label="答案" color={C.green} />

    <Caption
      items={[
        { from: 0, to: 150, text: "先把文档切块，存进向量库" },
        { from: 150, to: 240, text: "用户提问，问题也转成向量" },
        { from: 240, to: 292, text: "按意思找出最像的几段" },
        { from: 292, to: 395, text: "原文和问题一起交给 LLM" },
        { from: 395, to: 475, text: "LLM 照着原文写答案" },
        { from: 475, to: 600, text: "附上出处，方便用户核对" },
      ]}
    />
  </Stage>
);

export const scene: SceneDef = {
  component: Scene,
  durationInFrames: 600,
  fps: 30,
  width: 1280,
  height: 720,
  title: "知识库问答助手：文档切块转向量存入向量库；提问时按意思检索相似段落，与问题一起交给 LLM，生成带出处的答案",
};
