import { useState } from 'react';
import Hero from './components/Hero.jsx';
import PairControls from './components/PairControls.jsx';
import ArbCalculator from './components/ArbCalculator.jsx';
import SampleOpportunities from './components/SampleOpportunities.jsx';

export default function App() {
  const [dexA, setDexA] = useState('Uniswap v3');
  const [dexB, setDexB] = useState('SushiSwap');
  const [pair, setPair] = useState('ETH/USDC');

  return (
    <div className="min-h-screen bg-black text-white">
      <Hero />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        <PairControls
          dexA={dexA}
          dexB={dexB}
          pair={pair}
          onChange={(next) => {
            if (next.dexA !== undefined) setDexA(next.dexA);
            if (next.dexB !== undefined) setDexB(next.dexB);
            if (next.pair !== undefined) setPair(next.pair);
          }}
        />

        <ArbCalculator dexA={dexA} dexB={dexB} pair={pair} />

        <SampleOpportunities selectedPair={pair} />

        <section className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <h3 className="text-lg font-semibold">Important risk notice</h3>
          <p className="mt-2 text-white/80 text-sm leading-relaxed">
            Crypto and arbitrage trading are highly risky. Prices can change rapidly, transactions can fail, and
            costs like slippage, fees, and gas can turn apparent spreads into losses. This interface is for educational
            and exploratory purposes only and does not guarantee profits or provide financial advice. Always test with
            small amounts and do your own research.
          </p>
        </section>
      </main>
    </div>
  );
}
