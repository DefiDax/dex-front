import historyProvider from './historyProvider'
import {
  DatafeedConfiguration,
  ErrorCallback,
  GetMarksCallback,
  HistoryCallback,
  HistoryDepth,
  LibrarySymbolInfo,
  Mark,
  OnReadyCallback,
  ResolutionBackValues,
  ResolutionString,
  ResolveCallback,
  SearchSymbolsCallback,
  ServerTimeCallback,
  SubscribeBarsCallback,
  TimescaleMark,
} from '../../../charting_library/charting_library.min'

const supportedResolutions:ResolutionString[] = ["60" as ResolutionString, "D" as ResolutionString]

const config:DatafeedConfiguration= {
  supported_resolutions: supportedResolutions,
  supports_marks: false,
}; 



export default {
  onReady: (callback: OnReadyCallback):void => {
    console.log('=====onReady running')	
    setTimeout(() => callback(config), 0)
    
  },
  searchSymbols: (userInput:string, exchange:string, symbolType:string, onResultReadyCallback:SearchSymbolsCallback):void => {
    // for (var i = 0; i < data.length; ++i) {
    //   if (!data[i].params) {
    //     data[i].params = [];
    //   }
    // }
    // if (typeof data.s == 'undefined' || data.s != 'error') {
    //   onResultReadyCallback(data);
    // } else {
    //   onResultReadyCallback([]);
    // }
    // console.log('====Search Symbols running')
  },
  resolveSymbol: (symbolName: string,
    onResolve: ResolveCallback,
    onError: ErrorCallback
    ) => {
      console.log('resolveSymbol')
      var split_data = symbolName.split(/[:/]/)
      console.log({split_data})
      var symbol_stub = {
        name: split_data[1],
        full_name: "",
        description: '',
        type: 'bitcoin',
        session: '24x7',
        format: 'price',
        timezone: 'Etc/UTC',
        ticker: split_data[0],
        exchange: "",
        listed_exchange: "",
        minmov: 1,
        pricescale: 10000000,
        has_intraday: true,
        intraday_multipliers: supportedResolutions,
        supported_resolutions:  supportedResolutions,
        volume_precision: 8,
      }

      // let symbol_stub = {
      //   name: 'BTC/USDT',
      //   full_name: 'EXCHANGE:BTC/USDT',
      //   description: 'BTC/USDT',
      //   type: 'btcusdt',
      //   session: '24x7',
      //   exchange: 'BTC',
      //   listed_exchange: 'BTC',
      //   timezone: 'Asia/Shanghai',
      //   format: 'price',
      //   pricescale: 100,
      //   minmov: 1,
      //   has_intraday: true,
      //   has_no_volume: true,
      //   has_daily: true,
      //   has_weekly_and_monthly: true,
      //   has_empty_bars: true,
      //   supported_resolutions: supportedResolutions,
      //   intraday_multipliers: ['60', '1440']
      // }
  
      setTimeout(function() {
        onResolve(symbol_stub as LibrarySymbolInfo)
        console.log('Resolving that symbol....', symbol_stub)
      }, 0)
    
    // onResolveErrorCallback('Not feeling it today')

  },
  getBars: function(
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    from: number,
    to: number,
    onResult: HistoryCallback,
    onError: ErrorCallback,
    firstDataRequest: boolean // 标识是否第一次调用此商品/周期的历史记录
  ) {
    // console.log('=====getBars running')
    console.log('function args',arguments)
    // console.log(`Requesting bars between ${new Date(from * 1000).toISOString()} and ${new Date(to * 1000).toISOString()}`)
    historyProvider.getBars(symbolInfo, resolution, from, to, firstDataRequest)
    .then((bars:any)=> {
      console.log("bars", bars)
      if (bars.length) {
        
        onResult(bars, {noData: false})
      } else {
        onResult(bars, {noData: true})
      }
    }).catch(onError)

  },
  subscribeBars: (
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    onTick: SubscribeBarsCallback,
    listenerGuid: string,
    onResetCacheNeededCallback: () => void
  ) => {
    // console.log('=====subscribeBars runnning')
    //stream.subscribeBars(symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback)
  },
  unsubscribeBars: (listenerGuid: string) => {
    // console.log('=====unsubscribeBars running')

   // stream.unsubscribeBars(subscriberUID)
  },
  calculateHistoryDepth: (
    resolution: ResolutionString,
    resolutionBack: ResolutionBackValues,
    intervalBack: number
  ) : HistoryDepth | undefined=> {
    //optional
    // console.log('=====calculateHistoryDepth running')
    // while optional, this makes sure we request 24 hours of minute data at a time
    // CryptoCompare's minute data endpoint will throw an error if we request data beyond 7 days in the past, and return no data
    return undefined
  },
  getMarks: (
    symbolInfo: LibrarySymbolInfo,
    from: number,
    to: number,
    onDataCallback: GetMarksCallback<Mark>,
    resolution: ResolutionString
  ) => {
    //optional
    console.log('=====getMarks running')
  },
  getTimeScaleMarks: (
    symbolInfo: LibrarySymbolInfo,
    from: number,
    to: number,
    onDataCallback: GetMarksCallback<TimescaleMark>,
    resolution: ResolutionString
  ) => {
    //optional
    console.log('=====getTimeScaleMarks running')
  },
  getServerTime: (callback: ServerTimeCallback) => {
    console.log('=====getServerTime running')
  },
}