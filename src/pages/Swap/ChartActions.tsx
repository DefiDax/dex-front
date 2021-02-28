import React from 'react'
import styled from 'styled-components'

const periods = [
  {
    slug: 'Time',
    resolution: '1',
    key: 'realtime',
    realtime: 1,
    chartType: 3
  },
  // { slug: '1min', key: '1min', resolution: '1' },
  // { slug: '5min', key: '5min', resolution: '5' },
  // { slug: '15min', key: '15min', resolution: '15' },
  // { slug: '30min', key: '30min', resolution: '30' },
  { slug: '1hour', key: '60min', resolution: '60' },
  // { slug: '4hour', key: '4hour', resolution: '240' },
  { slug: '1day', key: '1day', resolution: 'D' },
  // { slug: '1week', key: '1week', resolution: '1W' },
  // { slug: '1mon', key: '1mon', resolution: '1M' }
]

const ChartActionsWrapper = styled.div`
    height: 24px;
    border-bottom: 1px solid;
    border-color: ${({ theme }) => theme.primary1}
    display: flex;
    font-size: 12px;
    user-select: none;
    margin-bottom: 10px;
`

const ActionButton = styled.button<{ cur?: boolean }>`
  background: transparent;
  border: none;
  outline: none;
  transition: all 0.15s;
  padding: 0 6px;
  height: 23px;
  border-right: 1px solid;
  cursor: pointer;
  border-color: ${({ cur }) => (cur ? '#111217' : 'transparent')};
  background-color: ${({ cur }) => (cur ? 'rgba(37, 42, 68, .5)' : 'transparent')};
  color: ${({ cur, theme }) => cur ? '#2483ff' : theme.text2}
`

export default function ChartActions({ setPeriod, period }: { setPeriod: (period: string) => void, period: string}) {
    // const p = localStorage.getItem('HBG-period')
    // const [period, setPeriod] = useState(p || '15min')
    //
    // useEffect(() => {
    //   localStorage.setItem('HBG-period', period)
    // }, [period])

  return (
    <ChartActionsWrapper>
      {periods.map(item => (
        <ActionButton cur={period === item.resolution} key={item.key} onClick={() => setPeriod(item.resolution)}>
          {item.slug}
        </ActionButton>
      ))}
    </ChartActionsWrapper>
  )
}
