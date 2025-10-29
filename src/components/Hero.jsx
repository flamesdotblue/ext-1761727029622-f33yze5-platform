import Spline from '@splinetool/react-spline';
import { Rocket, ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative h-[75vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/44zrIZf-iQZhbQNQ/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-black/50 to-black" />

      <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-white/80 backdrop-blur">
            <Rocket className="h-3.5 w-3.5" />
            Live demo interface
          </div>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-6xl">
            Explore crypto arbitrage opportunities
          </h1>
          <p className="mt-4 text-white/80 max-w-xl">
            Compare prices across venues, estimate slippage, fees, and gas, and simulate potential PnL — all in one streamlined interface.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <a
              href="#calculator"
              className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-black transition hover:bg-white/90"
            >
              Get started
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#opps"
              className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/5 px-4 py-2 text-white transition hover:bg-white/10"
            >
              View samples
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
