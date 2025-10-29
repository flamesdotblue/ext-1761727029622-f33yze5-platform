import { useMemo, useState } from 'react';
import { Calculator, AlertTriangle } from 'lucide-react';

function formatUSD(n) {
  if (Number.isNaN(n)) return '-';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 6 }).format(n);
}

export default function ArbCalculator({ dexA, dexB, pair }) {
  const [priceA, setPriceA] = useState('3000');
  const [priceB, setPriceB] = useState('3012');
  const [tradeSize, setTradeSize] = useState('1000'); // in quote currency, e.g., USDC
  const [feeBpsA, setFeeBpsA] = useState('30'); // 0.30%
  const [feeBpsB, setFeeBpsB] = useState('30');
  const [slippagePct, setSlippagePct] = useState('0.20'); // percent
  const [gasCost, setGasCost] = useState('8'); // USD

  const metrics = useMemo(() => {
    const pA = parseFloat(priceA);
    const pB = parseFloat(priceB);
    const size = parseFloat(tradeSize);
    const feeA = parseFloat(feeBpsA) / 10000; // convert bps to fraction
    const feeB = parseFloat(feeBpsB) / 10000;
    const slip = parseFloat(slippagePct) / 100;
    const gas = parseFloat(gasCost);

    if ([pA, pB, size, feeA, feeB, slip, gas].some((x) => !Number.isFinite(x))) {
      return null;
    }

    // Assume buy on cheaper venue, sell on more expensive.
    const buyPrice = Math.min(pA, pB);
    const sellPrice = Math.max(pA, pB);
    const buyVenue = pA <= pB ? 'A' : 'B';
    const sellVenue = pA <= pB ? 'B' : 'A';

    // Apply fees and slippage to effective execution price.
    // Buy: price increases by slippage, plus taker fee.
    const effBuy = buyPrice * (1 + slip) * (1 + (buyVenue === 'A' ? feeA : feeB));
    // Sell: price decreases by slippage, minus taker fee impact.
    const effSell = sellPrice * (1 - slip) * (1 - (sellVenue === 'A' ? feeA : feeB));

    const unitsBought = size / effBuy; // quantity of base asset acquired
    const grossProceeds = unitsBought * effSell; // sell proceeds in quote currency
    const pnl = grossProceeds - size - gas; // net after gas
    const spreadPct = (sellPrice - buyPrice) / buyPrice * 100;
    const netSpreadPct = (effSell - effBuy) / effBuy * 100;
    const roiPct = pnl / size * 100;

    // Breakeven spread approx including fees, slippage, gas impact per size
    const feeImpactPct = (buyVenue === 'A' ? feeA : feeB) + (sellVenue === 'A' ? feeA : feeB);
    const slipImpactPct = 2 * slip; // buy worse + sell worse
    const gasPct = gas / size;
    const breakevenPct = (feeImpactPct + slipImpactPct + gasPct) * 100;

    return {
      buyVenue,
      sellVenue,
      effBuy,
      effSell,
      unitsBought,
      pnl,
      spreadPct,
      netSpreadPct,
      roiPct,
      breakevenPct,
    };
  }, [priceA, priceB, tradeSize, feeBpsA, feeBpsB, slippagePct, gasCost]);

  return (
    <section id="calculator" className="rounded-xl border border-white/10 bg-white/5 p-4 sm:p-6 backdrop-blur">
      <div className="mb-4 flex items-center gap-3">
        <div className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-white/10">
          <Calculator className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Arbitrage calculator</h2>
          <p className="text-sm text-white/70">Estimate net PnL after fees, slippage, and gas for {pair} across {dexA} and {dexB}.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-3">
          <Field label={`${dexA} price (${pair.split('/')[1]})`} value={priceA} onChange={setPriceA} />
          <Field label={`${dexB} price (${pair.split('/')[1]})`} value={priceB} onChange={setPriceB} />
          <Field label={`Trade size (${pair.split('/')[1]})`} value={tradeSize} onChange={setTradeSize} />
        </div>
        <div className="space-y-3">
          <Field label={`${dexA} taker fee (bps)`} value={feeBpsA} onChange={setFeeBpsA} />
          <Field label={`${dexB} taker fee (bps)`} value={feeBpsB} onChange={setFeeBpsB} />
          <Field label="Slippage (%)" value={slippagePct} onChange={setSlippagePct} />
          <Field label="Gas/network cost (USD)" value={gasCost} onChange={setGasCost} />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Stat title="Gross spread" value={metrics ? `${metrics.spreadPct.toFixed(3)}%` : '-'} />
        <Stat title="Net spread (est.)" value={metrics ? `${metrics.netSpreadPct.toFixed(3)}%` : '-'} />
        <Stat title="Breakeven spread (est.)" value={metrics ? `${metrics.breakevenPct.toFixed(3)}%` : '-'} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Stat title="Effective buy" value={metrics ? formatUSD(metrics.effBuy) : '-'} subtitle={metrics ? (metrics.buyVenue === 'A' ? `${dexA}` : `${dexB}`) : ''} />
        <Stat title="Effective sell" value={metrics ? formatUSD(metrics.effSell) : '-'} subtitle={metrics ? (metrics.sellVenue === 'A' ? `${dexA}` : `${dexB}`) : ''} />
        <Stat title="Units traded" value={metrics ? metrics.unitsBought.toFixed(6) : '-'} subtitle={pair.split('/')[0]} />
      </div>

      <div className="mt-6 rounded-lg border border-white/10 bg-black/30 p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-white/70">Estimated net PnL</div>
            <div className={`mt-1 text-2xl font-semibold ${metrics && metrics.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {metrics ? formatUSD(metrics.pnl) : '-'}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-white/70">ROI</div>
            <div className="mt-1 text-2xl font-semibold">{metrics ? `${metrics.roiPct.toFixed(2)}%` : '-'}</div>
          </div>
        </div>
        <div className="mt-3 flex items-start gap-2 text-xs text-white/70">
          <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-300" />
          <p>
            Estimates assume immediate execution and constant prices. Real outcomes vary due to MEV, partial fills, price impact, and failed transactions.
          </p>
        </div>
      </div>
    </section>
  );
}

function Field({ label, value, onChange }) {
  return (
    <label className="block">
      <div className="text-sm text-white/70">{label}</div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 outline-none ring-0 focus:border-white/30"
      />
    </label>
  );
}

function Stat({ title, value, subtitle }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/30 p-4">
      <div className="text-sm text-white/70">{title}</div>
      <div className="mt-1 text-xl font-semibold">{value}</div>
      {subtitle ? <div className="text-xs text-white/50">{subtitle}</div> : null}
    </div>
  );
}
