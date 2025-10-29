import { useEffect, useMemo, useState } from 'react';
import { ArrowRightLeft } from 'lucide-react';

const SAMPLE_DEXES = ['Uniswap v3', 'SushiSwap', 'Curve', 'Balancer', 'PancakeSwap'];
const SAMPLE_PAIRS = ['ETH/USDC', 'ETH/USDT', 'BTC/USDC', 'SOL/USDC', 'ARB/ETH'];

function randomSeeded(seed) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export default function SampleOpportunities({ selectedPair }) {
  const [seed, setSeed] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setSeed(Date.now()), 5000);
    return () => clearInterval(id);
  }, []);

  const rows = useMemo(() => {
    const data = [];
    for (let i = 0; i < 6; i++) {
      const dexA = SAMPLE_DEXES[Math.floor(randomSeeded(seed + i) * SAMPLE_DEXES.length)];
      const dexB = SAMPLE_DEXES[Math.floor(randomSeeded(seed + i + 1) * SAMPLE_DEXES.length)];
      const pair = SAMPLE_PAIRS[Math.floor(randomSeeded(seed + i + 2) * SAMPLE_PAIRS.length)];
      if (dexA === dexB) continue;
      const base = 1000 + (seed % 1000) * 0.001 + i * 3;
      const spread = (randomSeeded(seed + i + 3) * 0.7 + 0.05); // 0.05% - 0.75%
      const priceA = base;
      const priceB = base * (1 + spread / 100);
      const fee = 0.003 * 2; // both sides 30 bps
      const slip = 0.002 * 2;
      const net = spread / 100 - fee - slip; // rough
      data.push({ id: `${i}-${seed}`, dexA, dexB, pair, priceA, priceB, spreadPct: spread, netPct: net * 100 });
    }
    return data
      .filter((r) => r.pair === selectedPair || randomSeeded(seed + r.id.length) > 0.5)
      .sort((a, b) => b.netPct - a.netPct)
      .slice(0, 5);
  }, [seed, selectedPair]);

  return (
    <section id="opps" className="rounded-xl border border-white/10 bg-white/5 p-4 sm:p-6 backdrop-blur">
      <div className="mb-4 flex items-center gap-3">
        <div className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-white/10">
          <ArrowRightLeft className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Sample opportunities</h2>
          <p className="text-sm text-white/70">Synthetic spreads for quick exploration. Update every ~5s.</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-white/10">
        <table className="min-w-full text-sm">
          <thead className="bg-white/5">
            <tr className="text-left text-white/70">
              <th className="px-4 py-3 font-medium">Pair</th>
              <th className="px-4 py-3 font-medium">Buy @</th>
              <th className="px-4 py-3 font-medium">Sell @</th>
              <th className="px-4 py-3 font-medium">Gross spread</th>
              <th className="px-4 py-3 font-medium">Net (rough)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr key={r.id} className={idx % 2 ? 'bg-white/[0.025]' : ''}>
                <td className="px-4 py-3">
                  <div className="font-medium">{r.pair}</div>
                  <div className="text-white/50">{r.dexA} → {r.dexB}</div>
                </td>
                <td className="px-4 py-3">${r.priceA.toFixed(2)} ({r.dexA})</td>
                <td className="px-4 py-3">${r.priceB.toFixed(2)} ({r.dexB})</td>
                <td className="px-4 py-3">{r.spreadPct.toFixed(3)}%</td>
                <td className={`px-4 py-3 font-semibold ${r.netPct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{r.netPct.toFixed(3)}%</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-center text-white/60" colSpan={5}>
                  No samples available right now.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-white/60">
        Values are illustrative, not live market data. Always validate on-chain quotes directly on each exchange before trading.
      </p>
    </section>
  );
}
