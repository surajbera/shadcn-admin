import * as React from 'react'
import { Legend, ResponsiveContainer, Tooltip } from 'recharts'
import { cn } from '@/lib/utils'

type ChartColor = 'chart-1' | 'chart-2' | 'chart-3' | 'chart-4' | 'chart-5'

/**
 * One entry per series, keyed by the series' `dataKey`. Keys become CSS
 * variables (`--color-<key>`), so keep them to letters, digits and dashes.
 */
export type ChartConfig = Record<string, { label: string; color: ChartColor }>

const ChartContext = React.createContext<ChartConfig | null>(null)

function useChartConfig() {
  const config = React.useContext(ChartContext)
  if (!config)
    throw new Error('Chart parts must be used inside <ChartContainer>')
  return config
}

type ChartContainerProps = Omit<React.ComponentProps<'div'>, 'children'> & {
  config: ChartConfig
  /** One Recharts chart (`BarChart`, `LineChart`, `AreaChart`...). */
  children: React.ReactElement
}

/**
 * Wraps a Recharts chart so it reads the theme: series colors come from
 * `config` (fill or stroke with `var(--color-<key>)`), and axes, grid and
 * cursor use neutral tokens. Never pass hex colors to a chart.
 */
function ChartContainer({
  config,
  className,
  style,
  children,
  ...props
}: ChartContainerProps) {
  const colorVars = Object.fromEntries(
    Object.entries(config).map(([key, { color }]) => [
      `--color-${key}`,
      `var(--${color})`,
    ])
  ) as React.CSSProperties

  return (
    <ChartContext.Provider value={config}>
      <div
        data-slot='chart'
        className={cn(
          'h-60 w-full text-caption',
          '[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground',
          '[&_.recharts-cartesian-axis-line]:stroke-border [&_.recharts-cartesian-grid_line]:stroke-border',
          '[&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted',
          '[&_.recharts-surface]:outline-hidden',
          className
        )}
        style={{ ...colorVars, ...style }}
        {...props}
      >
        <ResponsiveContainer width='100%' height='100%'>
          {children}
        </ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
}

const ChartTooltip = Tooltip
const ChartLegend = Legend

type SeriesItem = { dataKey?: unknown; name?: unknown; value?: unknown }

function seriesKey(item: SeriesItem) {
  return String(item.dataKey ?? item.name ?? '')
}

type ChartTooltipContentProps = {
  active?: boolean
  payload?: ReadonlyArray<SeriesItem>
  label?: React.ReactNode
  hideLabel?: boolean
  labelFormatter?: (label: React.ReactNode) => React.ReactNode
  valueFormatter?: (value: number) => string
}

/** Use as `<ChartTooltip content={<ChartTooltipContent />} />`. */
function ChartTooltipContent({
  active,
  payload,
  label,
  hideLabel,
  labelFormatter,
  valueFormatter = (value) => value.toLocaleString(),
}: ChartTooltipContentProps) {
  const config = useChartConfig()
  if (!active || !payload?.length) return null

  return (
    <div className='grid min-w-32 gap-1.5 rounded-lg border bg-popover px-2.5 py-1.5 text-caption text-popover-foreground shadow-overlay'>
      {!hideLabel && (
        <div className='font-medium'>
          {labelFormatter ? labelFormatter(label) : label}
        </div>
      )}
      {payload.map((item) => {
        const key = seriesKey(item)
        return (
          <div key={key} className='flex items-center gap-2'>
            <span
              aria-hidden='true'
              className='size-2 shrink-0 rounded-xs'
              style={{ background: `var(--color-${key})` }}
            />
            <span className='text-muted-foreground'>
              {config[key]?.label ?? key}
            </span>
            <span className='ms-auto font-medium text-foreground tabular-nums'>
              {typeof item.value === 'number'
                ? valueFormatter(item.value)
                : String(item.value ?? '')}
            </span>
          </div>
        )
      })}
    </div>
  )
}

/** Use as `<ChartLegend content={<ChartLegendContent />} />`. */
function ChartLegendContent({
  payload,
}: {
  payload?: ReadonlyArray<SeriesItem>
}) {
  const config = useChartConfig()
  if (!payload?.length) return null

  return (
    <ul className='flex flex-wrap items-center justify-center gap-4 pt-3'>
      {payload.map((item) => {
        const key = seriesKey(item)
        return (
          <li key={key} className='flex items-center gap-1.5'>
            <span
              aria-hidden='true'
              className='size-2 shrink-0 rounded-xs'
              style={{ background: `var(--color-${key})` }}
            />
            {config[key]?.label ?? key}
          </li>
        )
      })}
    </ul>
  )
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
}
