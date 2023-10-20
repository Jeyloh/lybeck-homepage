import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useEffect, useState } from 'react'

declare global {
  interface Window {
    updateFluidConfig: (config: Config, guiStarted: boolean) => void;
    invokeSplash: () => void;
    startGUI: () => void;
    fluidConfig: {
      SPLAT_RADIUS: number;
      SPLAT_FORCE: number;
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

  useEffect(() => {
    setTimeout( () => {

      const existingScript = document.getElementById("fluid-animation-script");
      if (existingScript) return;
      const script = document.createElement("script");
      script.id = "fluid-animation-script"
      script.src = "/fluid-animation/script.js"
      script.type = "text/javascript"
      document.body.appendChild(script)
    }, 1000)
  }, [])

  const [initialSplash, setInitialSplash] = useState(false)

  function getConfig(i: number) {
    return {
      SPLAT_RADIUS: window.fluidConfig.SPLAT_RADIUS + 0.1 * i,
      SPLAT_FORCE: window.fluidConfig.SPLAT_FORCE + 2000 * i,
    };
  }


  useEffect(() => {
    if (initialSplash) return;
    setTimeout(() => {
      let i = 1;

      let interval: NodeJS.Timeout;
      interval = setInterval(() => {
        if (i > 2) {
          clearInterval(interval)
          return
        }
        i++;
        invokeSplash(getConfig(i))
      }, 2000);
    }, 2000)
    setInitialSplash(true)
  }, [initialSplash])


  const [invokedSplashes, setInvokedSplashes] = useState(0)
  const [guiStarted, setGuiStarted] = useState(false)


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
      SPLAT_RADIUS: Math.random(),
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
              className="flex lg:justify-center gap-2 flex-col lg:flex-row xl:w-1/4 lg:w-1/2 sm:w-1/3 cursor-pointer z-2 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 py-16 px-8 border-4 border-white text-4xl box-3d"
              style={{ transition: '0.2s' }}
          >
            <p>Amina</p>
            <p>Ømer</p>
          </div>
        </div>
      </main>
  )
}