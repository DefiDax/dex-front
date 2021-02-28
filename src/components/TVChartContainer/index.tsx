import React, { useState, useEffect, useRef } from 'react'
import {
  widget,
  ChartingLibraryWidgetOptions,
  // LanguageCode,
  IChartingLibraryWidget,
  ResolutionString
} from '../../charting_library/charting_library.min'
import Datafeed from './api/'

export interface ChartContainerProps {
  symbol?: ChartingLibraryWidgetOptions['symbol']
  interval?: ChartingLibraryWidgetOptions['interval']

  // BEWARE: no trailing slash is expected in feed URL
  datafeedUrl?: ChartingLibraryWidgetOptions['datafeed']
  libraryPath?: ChartingLibraryWidgetOptions['library_path']
  chartsStorageUrl?: ChartingLibraryWidgetOptions['charts_storage_url']
  chartsStorageApiVersion?: ChartingLibraryWidgetOptions['charts_storage_api_version']
  clientId?: ChartingLibraryWidgetOptions['client_id']
  userId?: ChartingLibraryWidgetOptions['user_id']
  fullscreen?: ChartingLibraryWidgetOptions['fullscreen']
  autosize?: ChartingLibraryWidgetOptions['autosize']
  studiesOverrides?: ChartingLibraryWidgetOptions['studies_overrides']
  containerId?: ChartingLibraryWidgetOptions['container_id']
  theme?: ChartingLibraryWidgetOptions['theme']
  period?: string
}

export interface ChartContainerState {}

// function getLanguageFromURL(): LanguageCode | null {
//     const regex = new RegExp('[\\?&]lang=([^&#]*)')
//     const results = regex.exec(location.search)
//     return results === null ? null : (decodeURIComponent(results[1].replace(/\+/g, ' ')) as LanguageCode)
// }


export default function TVChartContainer({
  symbol = 'USDT-ETH',
  //@ts-ignore
  interval = 'D',
  containerId = 'tv_chart_container',
  datafeedUrl = Datafeed, //'https://demo_feed.tradingview.com',
  libraryPath = '/charting_library/',
  chartsStorageUrl = 'https://saveload.tradingview.com',
  chartsStorageApiVersion = '1.1',
  clientId = 'tradingview.com',
  userId = 'public_user_id',
  fullscreen = false,
  autosize = true,
  studiesOverrides = {},
  theme = 'Dark',
  period = 'D',
}: ChartContainerProps) {
  const ref = useRef<HTMLDivElement>()

  const widgetOptions: ChartingLibraryWidgetOptions = {
    symbol: symbol as string,
    // BEWARE: no trailing slash is expected in feed URL
    // tslint:disable-next-line:no-any
    datafeed: datafeedUrl,
    interval: interval as ChartingLibraryWidgetOptions['interval'],
    container_id: containerId as ChartingLibraryWidgetOptions['container_id'],
    library_path: libraryPath as string,
    locale: 'en',
    disabled_features: [
      'use_localstorage_for_settings',
      'left_toolbar',
      'header_widget',
      'control_bar',
      "timeframes_toolbar",

      "main_series_scale_menu",
      
      "volume_force_overlay"
    ],
    enabled_features: [
      
      'border_around_the_chart',
      //'study_templates',
      "hide_last_na_study_output",
    ],
    overrides:{
      "volumePaneSize": "small",// 支持的值: large, medium, small, tiny
      "paneProperties.background": "#2C2C37",
      "paneProperties.vertGridProperties.color": "transparent",
      "paneProperties.vertGridProperties.style": 0
    },
    charts_storage_url: chartsStorageUrl,
    charts_storage_api_version: chartsStorageApiVersion,
    client_id: clientId,
    user_id: userId,
    fullscreen: fullscreen,
    autosize: autosize,
    studies_overrides: studiesOverrides,
    theme
  }

  const [chartCreated, setChartCreated] = useState(false)
  const [myPeriod, setMyPeriod] = useState(period)
  const [myWidget , setMyWidget] =useState<IChartingLibraryWidget | null>()

  useEffect(()=>{
    if(myWidget && myPeriod != period){
      myWidget?.activeChart().setChartType(1)
      myWidget?.activeChart().setResolution(period as ResolutionString, function onReadyCallback() { })
      setMyPeriod(period)
    }
  },[myPeriod, period])
  useEffect(() => {
    let tvWidget: IChartingLibraryWidget | null
    if (!chartCreated && ref.current) {
      console.log('---------------here', document.getElementById(`${containerId}`), ref.current)
      tvWidget = new widget(widgetOptions)
      tvWidget.onChartReady(() => {
        if(tvWidget){
          tvWidget.chart().executeActionById("hideAllMarks");
          tvWidget.chart().createStudy("Moving Average", false, false, [5], {'Plot.color': '#34a9ff'})
          tvWidget.chart().createStudy("Moving Average", false, false, [10])
          tvWidget.chart().createStudy("Moving Average", false, false, [30])
        }
        
      });
      setChartCreated(true)
      setMyWidget(tvWidget)
    }
    // NOTE 如何只创建一次！！！
    return () => {
      if (tvWidget) {
        console.log('destroy', tvWidget)
        // tvWidget.remove()
        // tvWidget = null
        // setChartCreated(false)
      }
    }
  }, [widgetOptions, ref])
  return <div ref={ref as any} id={containerId} style={{ height: '100%' }} />
}

// export class TVChartContainer extends React.PureComponent<Partial<ChartContainerProps>, ChartContainerState> {
//   public static defaultProps: ChartContainerProps = {
//     symbol: 'AAPL',
//     //@ts-ignore
//     interval: 'D',
//     containerId: 'tv_chart_container',
//     datafeedUrl: 'https://demo_feed.tradingview.com',
//     libraryPath: '/charting_library/',
//     chartsStorageUrl: 'https://saveload.tradingview.com',
//     chartsStorageApiVersion: '1.1',
//     clientId: 'tradingview.com',
//     userId: 'public_user_id',
//     fullscreen: false,
//     autosize: true,
//     studiesOverrides: {}
//   }
//
//   private tvWidget: IChartingLibraryWidget | null = null
//
//     public componentDidMount(): void {
//         const widgetOptions: ChartingLibraryWidgetOptions = {
//             symbol: this.props.symbol as string,
//             // BEWARE: no trailing slash is expected in feed URL
//             // tslint:disable-next-line:no-any
//             datafeed: new (window as any).Datafeeds.UDFCompatibleDatafeed(this.props.datafeedUrl),
//             interval: this.props.interval as ChartingLibraryWidgetOptions['interval'],
//             container_id: this.props.containerId as ChartingLibraryWidgetOptions['container_id'],
//             library_path: this.props.libraryPath as string,
//
//             locale: 'en',
//             disabled_features: ['use_localstorage_for_settings'],
//             enabled_features: ['study_templates'],
//             charts_storage_url: this.props.chartsStorageUrl,
//             charts_storage_api_version: this.props.chartsStorageApiVersion,
//             client_id: this.props.clientId,
//             user_id: this.props.userId,
//             fullscreen: this.props.fullscreen,
//             autosize: this.props.autosize,
//             studies_overrides: this.props.studiesOverrides
//         }
//
//         const tvWidget = new widget(widgetOptions)
//         this.tvWidget = tvWidget
//
//         // tvWidget.onChartReady(() => {
//         //   tvWidget.headerReady().then(() => {
//         //     const button = tvWidget.createButton()
//         //     button.setAttribute('title', 'Click to show a notification popup')
//         //     button.classList.add('apply-common-tooltip')
//         //     button.addEventListener('click', () =>
//         //       tvWidget.showNoticeDialog({
//         //         title: 'Notification',
//         //         body: 'TradingView Charting Library API works correctly',
//         //         callback: () => {
//         //           console.log('Noticed!')
//         //         }
//         //       })
//         //     )
//         //     button.innerHTML = 'Check API'
//         //   })
//         // })
//     }
//
//   public componentWillUnmount(): void {
//     if (this.tvWidget !== null) {
//       this.tvWidget.remove()
//       this.tvWidget = null
//     }
//   }
//
//   public render(): JSX.Element {
//     return <div id={this.props.containerId} className={'TVChartContainer'} />
//   }
// }
