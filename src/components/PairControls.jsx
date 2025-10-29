import { ArrowLeftRight } from 'lucide-react';

const DEXES = [
  'Uniswap v3',
  'SushiSwap',
  'PancakeSwap',
  'Curve',
  'Balancer',
  'Raydium',
];

const PAIRS = [
  'ETH/USDC',
  'ETH/USDT',
  'BTC/USDC',
  'ARB/ETH',
  'SOL/USDC',
  'MATIC/USDT',
];

export default function PairControls({ dexA, dexB, pair, onChange }) {
  return (
    <section className="rounded-xl border border-white/10 bg-white/5 p-4 sm:p-6 backdrop-blur">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Route setup</h2>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:items-end">
        <div>
          <label className="text-sm text-white/70">Exchange A</label>
          <select
            value={dexA}
            onChange={(e) => onChange({ dexA: e.target.value })}
            className="mt-1 w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 outline-none ring-0 focus:border-white/30"
          >
            {DEXES.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-center">
          <button
            onClick={() => onChange({ dexA: dexB, dexB: dexA })}
            className="mt-6 inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
            title="Swap venues"
          >
            <ArrowLeftRight className="h-4 w-4" />
            Swap
          </button>
        </div>

        <div>
          <label className="text-sm text-white/70">Exchange B</label>
          <select
            value={dexB}
            onChange={(e) => onChange({ dexB: e.target.value })}
            className="mt-1 w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 outline-none ring-0 focus:border-white/30"
          >
            {DEXES.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-3">
          <label className="text-sm text-white/70">Token pair</label>
          <select
            value={pair}
            onChange={(e) => onChange({ pair: e.target.value })}
            className="mt-1 w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 outline-none ring-0 focus:border-white/30"
          >
            {PAIRS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
}
