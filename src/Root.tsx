import "./index.css";
import { Composition, Folder } from "remotion";
import { HelloWorld } from "./HelloWorld";
import { Logo } from "./HelloWorld/Logo";
import { Title } from "./HelloWorld/Title";
import { SiberOlaylar2026 } from "./CyberSecurity/SiberOlaylar2026";
import { IntroScene } from "./CyberSecurity/IntroScene";
import { OutroScene } from "./CyberSecurity/OutroScene";
import { CyberBackground } from "./CyberSecurity/CyberBackground";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Ana Siber Olaylar 2026 Video Kompozisyonu */}
      <Composition
        id="SiberOlaylar2026"
        component={SiberOlaylar2026}
        durationInFrames={630} // 21 saniye @ 30fps
        fps={30}
        width={1920}
        height={1080}
      />

      {/* Siber Olaylar Bölüm/Bileşen Önizlemeleri */}
      <Folder name="SiberOlaylar-Parcalar">
        <Composition
          id="Cyber-Intro"
          component={() => (
            <>
              <CyberBackground />
              <IntroScene />
            </>
          )}
          durationInFrames={120}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Cyber-Outro"
          component={() => (
            <>
              <CyberBackground />
              <OutroScene />
            </>
          )}
          durationInFrames={120}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>

      {/* Varsayılan Remotion Şablon Bileşenleri */}
      <Folder name="Remotion-Starter">
        <Composition
          id="HelloWorld"
          component={HelloWorld}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            titleText: "Welcome to Remotion",
            titleColor: "#000000",
          }}
        />
        <Composition
          id="Logo"
          component={Logo}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            logoColor1: "#91EAE4",
            logoColor2: "#86A8E7",
          }}
        />
        <Composition
          id="Title"
          component={Title}
          durationInFrames={115}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            titleText: "Welcome to Remotion",
            titleColor: "#000000",
          }}
        />
      </Folder>
    </>
  );
};
