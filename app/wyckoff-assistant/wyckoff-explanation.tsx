import { Info } from "lucide-react"

interface WyckoffExplanationProps {
  chartType: string
}

export function WyckoffExplanation({ chartType }: WyckoffExplanationProps) {
  return (
    <div className="text-sm text-slate-700">
      <h4 className="font-medium text-slate-900 mb-2">Chart Explanation</h4>
      {getExplanationContent(chartType)}
    </div>
  )
}

function getExplanationContent(chartType: string) {
  switch (chartType) {
    case "wyckoff-overview":
      return (
        <div className="space-y-2">
          <p>The Wyckoff Market Cycle consists of four major phases that repeat over time:</p>
          <ol className="list-decimal pl-5 space-y-1">
            <li>
              <strong>Markdown:</strong> A period of declining prices where institutions sell positions.
            </li>
            <li>
              <strong>Accumulation:</strong> A sideways trading range where institutions buy from retail investors.
            </li>
            <li>
              <strong>Markup:</strong> A period of rising prices where institutions profit from long positions.
            </li>
            <li>
              <strong>Distribution:</strong> A sideways trading range where institutions sell to retail investors.
            </li>
          </ol>
          <p className="flex items-start gap-2 pt-1">
            <Info className="h-4 w-4 text-indigo-500 mt-0.5 flex-shrink-0" />
            <span>
              Wyckoff traders aim to identify these phases to align their positions with institutional traders, buying
              during accumulation and selling during distribution.
            </span>
          </p>
        </div>
      )

    case "accumulation":
      return (
        <div className="space-y-2">
          <p>
            The Accumulation phase occurs after a prolonged downtrend and represents a period where smart money is
            buying from retail traders who are selling after losses or out of frustration. Key elements include:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Selling Climax (SC):</strong> High volume sell-off marking potential end of downtrend.
            </li>
            <li>
              <strong>Automatic Rally (AR):</strong> A relief bounce after the selling climax.
            </li>
            <li>
              <strong>Secondary Test (ST):</strong> A retest of the SC low with lower volume.
            </li>
            <li>
              <strong>Spring:</strong> A final shakeout below support before the uptrend begins.
            </li>
            <li>
              <strong>Sign of Strength (SOS):</strong> A strong price move up with increased volume.
            </li>
            <li>
              <strong>Last Point of Support (LPS):</strong> The final pullback before sustained markup.
            </li>
          </ul>
          <p className="flex items-start gap-2 pt-1">
            <Info className="h-4 w-4 text-indigo-500 mt-0.5 flex-shrink-0" />
            <span>
              Successful identification of accumulation can provide excellent risk/reward entry opportunities, as you're
              buying when institutional investors have created a price floor.
            </span>
          </p>
        </div>
      )

    case "distribution":
      return (
        <div className="space-y-2">
          <p>
            The Distribution phase occurs after a prolonged uptrend and represents a period where smart money is selling
            to retail traders who are buying based on optimism and FOMO. Key elements include:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Buying Climax (BC):</strong> High volume rally marking potential end of uptrend.
            </li>
            <li>
              <strong>Automatic Reaction (AR):</strong> A quick sell-off after the buying climax.
            </li>
            <li>
              <strong>Secondary Test (ST):</strong> A retest of the BC high with lower volume.
            </li>
            <li>
              <strong>Upthrust:</strong> A false breakout above resistance to trap buyers.
            </li>
            <li>
              <strong>Sign of Weakness (SOW):</strong> A strong price move down with increased volume.
            </li>
            <li>
              <strong>Last Point of Supply (LPSY):</strong> The final rally before sustained markdown.
            </li>
          </ul>
          <p className="flex items-start gap-2 pt-1">
            <Info className="h-4 w-4 text-indigo-500 mt-0.5 flex-shrink-0" />
            <span>
              Recognizing distribution enables traders to exit long positions early and potentially enter short
              positions before the broader market recognizes the change in trend.
            </span>
          </p>
        </div>
      )

    case "spring":
      return (
        <div className="space-y-2">
          <p>
            A Spring is a specific price action event that occurs during an accumulation phase where price briefly
            penetrates a support level before quickly reversing higher.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Purpose:</strong> To shake out weak holders and trigger stop losses before a markup phase.
            </li>
            <li>
              <strong>Volume characteristics:</strong> Often occurs on relatively low volume, showing lack of selling
              pressure.
            </li>
            <li>
              <strong>Confirmation:</strong> Rapid price recovery back into the trading range with increasing volume.
            </li>
            <li>
              <strong>Secondary Test:</strong> A higher low that confirms support after the spring.
            </li>
          </ul>
          <p className="flex items-start gap-2 pt-1">
            <Info className="h-4 w-4 text-indigo-500 mt-0.5 flex-shrink-0" />
            <span>
              Springs provide excellent entry opportunities with a clear stop loss level. The ideal spring has lower
              volume on the breakdown and higher volume on the recovery.
            </span>
          </p>
        </div>
      )

    case "upthrust":
      return (
        <div className="space-y-2">
          <p>
            An Upthrust is a specific price action event that occurs during a distribution phase where price briefly
            penetrates a resistance level before quickly reversing lower.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Purpose:</strong> To trap buyers and allow institutions to distribute shares at higher prices.
            </li>
            <li>
              <strong>Volume characteristics:</strong> Often occurs on higher volume initially, showing supply coming
              in.
            </li>
            <li>
              <strong>Confirmation:</strong> Quick price rejection back below resistance with increasing selling
              pressure.
            </li>
            <li>
              <strong>Secondary Test:</strong> A lower high that confirms resistance after the upthrust.
            </li>
          </ul>
          <p className="flex items-start gap-2 pt-1">
            <Info className="h-4 w-4 text-indigo-500 mt-0.5 flex-shrink-0" />
            <span>
              Upthrusts provide excellent short entry opportunities with a clear stop loss level. Look for price
              rejection from important resistance levels with declining momentum.
            </span>
          </p>
        </div>
      )

    case "wyckoff-range":
      return (
        <div className="space-y-2">
          <p>
            A Wyckoff Trading Range is a sideways price structure that forms after a trend ends. It can represent either
            accumulation (after downtrend) or distribution (after uptrend).
          </p>
          <p>Key phases of an accumulation range (as shown in this chart):</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Phase A:</strong> Stopping of the prior downtrend, including the PS (Preliminary Support), SC
              (Selling Climax), AR (Automatic Rally), and ST (Secondary Test).
            </li>
            <li>
              <strong>Phase B:</strong> Building of the cause, with tests of support and resistance establishing the
              trading range.
            </li>
            <li>
              <strong>Phase C:</strong> Testing of the range with a Spring (false breakdown that shakes out weak
              holders).
            </li>
            <li>
              <strong>Phase D:</strong> Final consolidation with SOS (Sign of Strength) and LPS (Last Point of Support).
            </li>
            <li>
              <strong>Phase E:</strong> Start of markup phase as price breaks out of the range.
            </li>
          </ul>
          <p className="flex items-start gap-2 pt-1">
            <Info className="h-4 w-4 text-indigo-500 mt-0.5 flex-shrink-0" />
            <span>
              In this chart, note how abbreviations are used to mark key points: PS (Preliminary Support), SC (Selling
              Climax), AR (Automatic Rally), ST (Secondary Test), SOS (Sign of Strength), and LPS (Last Point of
              Support).
            </span>
          </p>
        </div>
      )

    default:
      return (
        <div>
          <p>Select a specific chart type to see detailed explanations of Wyckoff concepts and patterns.</p>
        </div>
      )
  }
}
