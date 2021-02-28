import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { AppState } from '..'

export function useQuoteList(): any {
  const list = useSelector((state: AppState) => state.symbols.quoteList)
  return list
}

export function useSymbolList(): any {
  const list = useSelector((state: AppState) => state.symbols.originSymbolsList)
  return list
}

// function getEtp(t: any, e: any) {
//   var r = Math.abs(e)
//   return 1 === t ? `${r}倍做多` : `${r}倍做空`
// }

export function useSymbolObj(curQuote: string): any {
  const symbolData = useSelector((state: AppState) => state.symbols.symbolsObj)
  return useMemo(() => {
    return symbolData && symbolData[curQuote]
      // const filteredList = symbolData.filter(item => {
      //     return item.quote_currency === curQuote;
      // }).map(item => {
      //     return {
      //         symbol: item.base_currency_display_name,
      //         priceUSD: 11354.39,
      //         priceChangeUSD: 0.02
      //     };
      // });
      // return filteredList;
  }, [symbolData, curQuote])
  // symbolData.reduce((prev, curr) => {
  //   const {
  //     symbol_partition,
  //     base_currency,
  //     base_currency_display_name,
  //     trade_price_precision,
  //     quote_currency,
  //     quote_currency_display_name,
  //     symbol_code,
  //     // state,
  //     leverage_ratio,
  //     // super_margin_leverage_ratio,
  //     // funding_leverage_ratio,
  //     // country_disabled,
  //     trade_open_at,
  //     tags,
  //     direction,
  //     etp_leverage_ratio
  //   } = curr
  //   const symbolName = ''.concat(base_currency_display_name, '/').concat(quote_currency_display_name)
  //   const precision = 1 * trade_price_precision || 0
  //   const tagsArr = (tags || '').split(',')
  //   const isST = tagsArr.includes('st')
  //   const isETP = tagsArr.includes('etp')
  //   const url = ''
  //   const etpText = (isETP && direction && etp_leverage_ratio && getEtp(direction, etp_leverage_ratio)) || ''
  //   const obj = {
  //     base: base_currency,
  //     quote: quote_currency,
  //     BASE: base_currency_display_name,
  //     QUOTE: quote_currency_display_name,
  //     symbol: symbol_code,
  //     // state:
  //     //   (trade_open_at < +new Date() && 'pre-online' === state) || symbol_code === primaryInfo.symbolCode
  //     //     ? 'online'
  //     //     : state,
  //     lr: leverage_ratio,
  //     isST,
  //     isETP,
  //     precision,
  //     markCluss: 'marked',
  //     symbolName,
  //     estimate: {},
  //     trade_open_at,
  //     url,
  //     tagsArr,
  //     etpText
  //   }
  //   let f = ''
  //   prev.noPart = prev.noPart || []
  //   if (curQuote !== quote_currency || tagsArr.includes('alts')) {
  //     // if (curQuote === 'fav') {
  //     //   ;(inputData && !symbol_code.includes(inputData)) || (favList.has(symbol_code) && (f = f || 'noPart'))
  //     // } else if (curQuote === 'alts') {
  //     //   ;(inputData && !symbol_code.includes(inputData)) || (tagsArr.includes('alts') && (f = f || 'noPart'))
  //     // }
  //   } else {
  //     // 符合过滤提交
  //     if (!inputData || base_currency.includes(inputData)) {
  //       if (symbol_partition === 'hadax') {
  //         f = f || 'noPart'
  //       } else {
  //         ;(prev[symbol_partition] = prev[symbol_partition] || []), (f = f || symbol_partition)
  //       }
  //     }
  //   }
  //   // curQuote !== quote_currency || tagsArr.includes('alts')
  //   //   ? curQuote === 'fav'
  //   //     ? (inputData && !symbol_code.includes(inputData)) || (favList.has(symbol_code) && (f = f || 'noPart'))
  //   //     : curQuote === 'alts' &&
  //   //       ((inputData && !symbol_code.includes(inputData)) || (tagsArr.includes('alts') && (f = f || 'noPart')))
  //   //   : (inputData && !base_currency(inputData)) ||
  //   //     (sortBy || symbol_partition === 'hadax'
  //   //       ? (f = f || 'noPart')
  //   //       : ((prev[symbol_partition] = prev[symbol_partition] || []), (f = f || symbol_partition)))
  //   if (isETP) {
  //     return prev
  //   }
  //   f && prev[f].push(obj)
  //   return prev
  // }, {})
}
