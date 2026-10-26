// Remotion Studio 预览入口：把所有场景注册成 Composition
import { Composition } from "remotion";
import { scenes } from "./registry";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {Object.entries(scenes).map(([id, s]) => (
        <Composition
          key={id}
          id={id}
          component={s.component}
          durationInFrames={s.durationInFrames}
          fps={s.fps}
          width={s.width}
          height={s.height}
        />
      ))}
    </>
  );
};
