import { Inter } from 'next/font/google'
import { useEffect, useState } from 'react'

declare global {
  interface Window {
    updateFluidConfig: (config: Config, guiStarted: boolean) => void;
    createSplashAnimation: (fromX: number, fromY: number, toX: number, toY: number, steps: number, color: { r: number, g: number, b: number }) => void;
    invokeSplash: () => void;
    startGUI: () => void;
    fluidConfig: {
      SPLAT_RADIUS: number;
      SPLAT_FORCE: number;
      DENSITY_DISSIPATION: number;
    }
  }
}
interface Config {
  SPLAT_RADIUS?: number
  SPLAT_FORCE?: number
  DENSITY_DISSIPATION?: number
}

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [startShow, setStartShow] = useState(true)

  useEffect(() => {
    if(!startShow)return
      const existingScript = document.getElementById("fluid-animation-script");
      if (existingScript) {
        setTimeout( () => {
          setIsScriptLoaded(true);
        }, 500)
        return;
      }
      const script = document.createElement("script");
      script.id = "fluid-animation-script"
      script.src = "/fluid-animation/script.js"
      script.type = "text/javascript"
      script.onload = () => {
        setTimeout( () => {
          setIsScriptLoaded(true);
        }, 500)
      };
      document.body.appendChild(script)
  }, [startShow])


  // function getConfig(i: number) {
  //   return {
  //     SPLAT_RADIUS: window.fluidConfig.SPLAT_RADIUS + 0.05 * i,
  //     SPLAT_FORCE: window.fluidConfig.SPLAT_FORCE + 500 * i,
  //   };
  // }

  // Initial splash exploding 3 times
  // useEffect(() => {
  //   if (initialSplash) return;
  //   console.log({initialSplash})
  //   setTimeout(() => {
  //     let i = 1;
  //
  //     let interval: NodeJS.Timeout;
  //     interval = setInterval(() => {
  //       if (i > 2) {
  //         clearInterval(interval)
  //         return
  //       }
  //       i++;
  //       invokeSplash(getConfig(i))
  //     }, 2000);
  //   }, 2000)
  //   setInitialSplash(true)
  // }, [initialSplash])


  const [invokedSplashes, setInvokedSplashes] = useState(0)
  const [guiStarted, setGuiStarted] = useState(false)

  function getRandomConfig() {
    const config = window.fluidConfig
    const gentleBreeze = {
      ...config,
      SPLAT_RADIUS: 0.03, // Smaller splat radius for finer splashes
      SPLAT_FORCE: 500, // Reduced force for softer splashes
      VELOCITY_DISSIPATION: 2.5, // Increased velocity dissipation for quicker settling
      DENSITY_DISSIPATION: 2, // Increased density dissipation for a more ephemeral look
      BLOOM: true, // Disable bloom for a less intense visual effect
      SUNRAYS: true, // Disable sunrays for simplicity and focus on the fluid motion
    };
    const mysticalSwirl = {
      ...config,
      VELOCITY_DISSIPATION: 0.9, // Lower velocity dissipation for longer-lasting swirls
      DENSITY_DISSIPATION: 0.8, // Lower density dissipation for a denser appearance
      CURL: 60, // Increase curl for more pronounced swirling effects
      PRESSURE_ITERATIONS: 15, // Fewer pressure iterations for a softer fluid motion
      COLORFUL: true, // Disable colorful mode for a more unified color theme
    };
    const vividAndBright = {
      ...config,
      COLOR_UPDATE_SPEED: 20, // Increase the speed of color changes
      BLOOM_INTENSITY: 1.2, // Increase the bloom intensity for a brighter effect
      BLOOM_THRESHOLD: 0.5, // Lower the bloom threshold for more areas to bloom
      DYE_RESOLUTION: 2048, // Higher resolution for more detailed color gradients
      SHADING: true, // Disable shading for a more flat and colorful look
    };
    const deepOcean = {
      ...config,
      SPLAT_RADIUS: 0.1,
      SPLAT_FORCE: 1500,
      VELOCITY_DISSIPATION: 1.2,
      DENSITY_DISSIPATION: 0.98,
      PRESSURE_ITERATIONS: 25,
      BLOOM: false,
      SUNRAYS: true,
      COLORFUL: false,
      BACK_COLOR: { r: 0, g: 0, b: 0.1 },
    };
    const cosmicGlow = {
      ...config,
      SPLAT_RADIUS: 0.05,
      SPLAT_FORCE: 700,
      VELOCITY_DISSIPATION: 1.5,
      DENSITY_DISSIPATION: 1.1,
      PRESSURE_ITERATIONS: 20,
      BLOOM: true,
      BLOOM_INTENSITY: 0.6,
      BLOOM_THRESHOLD: 0.4,
      CURL: 40,
      SHADING: false,
      COLORFUL: true,
    };
    const fieryExplosion = {
      ...config,
      SPLAT_RADIUS: 0.02,
      SPLAT_FORCE: 3000,
      VELOCITY_DISSIPATION: 0.8,
      DENSITY_DISSIPATION: 0.9,
      PRESSURE_ITERATIONS: 10,
      BLOOM: true,
      BLOOM_INTENSITY: 1.5,
      BLOOM_THRESHOLD: 0.7,
      CURL: 20,
      COLOR_UPDATE_SPEED: 30,
      BACK_COLOR: { r: 0.1, g: 0, b: 0 },
    };

    return [
      gentleBreeze,
      mysticalSwirl,
      vividAndBright,
      deepOcean,
      cosmicGlow,
      fieryExplosion,
    ][Math.floor(Math.random() * 6)];
  }


  useEffect(() => {
    if (isScriptLoaded && startShow) {

      const randomConfig = getRandomConfig()
      window.updateFluidConfig(randomConfig, guiStarted)

      const isMobile = window.innerWidth < 768;
      // Circle's center
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      // Calculate radii based on screen size
      const maxRadius = Math.min(centerX, centerY) * 0.8;
      const innerRadius = isMobile ?  maxRadius * 0.4 : 200
      const outerRadius = isMobile ?  maxRadius * 3 : 600

      // Random between 8 - 24
      const stepsPerSegment = Math.floor(Math.random() * 16) + 8;
      // Random between 24 and 36
      const numberOfSegments = Math.floor(Math.random() * 12) + 24;
      const rounds = 6; // Total number of rounds

      // Function to create animations for one round
      const createRoundAnimations = (roundIndex:number) => {
        for (let i = 0; i < numberOfSegments / 2; i++) {
          const angleOffset = roundIndex * (2 * Math.PI); // Offset for each round
          const angle1 = (i * 2 * Math.PI) / numberOfSegments + angleOffset;
          const angle2 = ((i + numberOfSegments / 2) * 2 * Math.PI) / numberOfSegments + angleOffset;

          const fromX1 = centerX + innerRadius * Math.cos(angle1);
          const fromY1 = centerY + innerRadius * Math.sin(angle1);
          const toX1 = centerX + outerRadius * Math.cos(angle1);
          const toY1 = centerY + outerRadius * Math.sin(angle1);

          const fromX2 = centerX + innerRadius * Math.cos(angle2);
          const fromY2 = centerY + innerRadius * Math.sin(angle2);
          const toX2 = centerX + outerRadius * Math.cos(angle2);
          const toY2 = centerY + outerRadius * Math.sin(angle2);

          setTimeout(() => {
            const greeness = Math.random() / 2;
            const oppositeColor = Math.random() / 2;

            window.createSplashAnimation(fromX1, fromY1, toX1, toY1, stepsPerSegment, {
              r: 1,
              g: greeness,
              b: oppositeColor,
            });
            window.createSplashAnimation(fromX2, fromY2, toX2, toY2, stepsPerSegment, {
              r: oppositeColor,
              g: greeness,
              b: 1,
            });
          }, i * 600 + roundIndex * (numberOfSegments / 2 * 600)); // Adjust delay as needed
        }
      };

      // Create animations for the desired number of rounds
      for (let roundIndex = 0; roundIndex < rounds; roundIndex++) {
        createRoundAnimations(roundIndex);
      }
    }
  }, [isScriptLoaded, startShow]);

function invokeSplash(config: Config = { }) {
  if (typeof window !== 'undefined') {

    if (typeof window.invokeSplash === 'function') {
      window.invokeSplash()
    }

    if (typeof window.updateFluidConfig === 'function') {
      window.updateFluidConfig(config, guiStarted)
    }
  }
}

  function invokeRandomSplash() {
    setInvokedSplashes(invokedSplashes + 1)
    const randomSplashConfig:Config = {
      // between 0.01 and 1.0
      SPLAT_RADIUS: Math.random() / 3,
      // between 0 and 8000
      SPLAT_FORCE: Math.random() * 8000,
      // between 0.01 and 4.0
      DENSITY_DISSIPATION: Math.random() * 4,
    }
    invokeSplash(randomSplashConfig)
  }

  useEffect(() => {
    if (!guiStarted && invokedSplashes >= 6) {
      if (typeof window.startGUI === 'function') {
        window.startGUI()
        setGuiStarted(true)
      }
    }
  }, [guiStarted, invokedSplashes])

  return (
      <main
          className={`flex min-h-screen flex-col items-center justify-between ${inter.className}`}
      >
        <div className="relative w-screen h-screen">
          <canvas id="fluid-canvas"/>
          <div id={"my-box"}
              onClick={invokeRandomSplash}
              className="flex justify-center items-center gap-2 flex-col lg:flex-row xl:w-1/4 lg:w-1/2 sm:w-1/3 cursor-pointer z-2 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 py-16 px-8 text-4xl "
              style={{ transition: '0.2s' }}
          >
            <p>Ivor</p>
            <p>30 år</p>
            <p>{`<3`}</p>
          </div>
        </div>
      </main>
  )
}