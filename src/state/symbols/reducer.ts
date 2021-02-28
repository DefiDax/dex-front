import { createReducer } from '@reduxjs/toolkit'
// import { setSymbols, fetch } from './actions'
import { fetchSymbols } from './actions'

export interface SymbolsState {
  originSymbolsList: { [key: string]: Array<any> }
  symbols: { [key: string]: Array<any> }
  quoteList: Array<string>
  symbolsObj: any
  error: string | null
}

const initialState: SymbolsState = {
  originSymbolsList: {},
  symbols: {},
  quoteList: [],
  symbolsObj: {},
  error: null
}

export default createReducer(initialState, builder =>
  builder
    // .addCase(setSymbols, (state, action) => {
    //   const { symbols }: { symbols: Array<any> } = action.payload
    //   symbols.sort((a: any, b: any) => 1 * b.weight - 1 * a.weight)
    //   // TODO localStorage ?
    //   state.originSymbolsList = [...symbols]

    //   const quoteList = new Set()
    //   let flag = false

    //   state.symbolsObj = symbols.reduce((prev, curr) => {
    //     prev[curr.symbol_code] = curr
    //     if (curr.white_enabled || (curr.state !== 'offline' && !curr.country_disabled)) {
    //       if ((curr.tags || '').includes('alts') && !(curr.tags || '').includes('hidden')) {
    //         flag = true
    //       } else {
    //         quoteList.add(curr.quote_currency)
    //       }
    //     }
    //     return prev
    //   }, {})
    //   flag && quoteList.add('alts')
    //   state.quoteList = quoteList
    // })
    .addCase(fetchSymbols.pending, (state, { payload: { symbols }}) => {
      state.symbolsObj = symbols
    })
    .addCase(fetchSymbols.fulfilled, (state, { payload: { symbols } }) => {
      // symbols.sort((a: any, b: any) => 1 * b.weight - 1 * a.weight)
      // TODO localStorage ?
      state.originSymbolsList = {...symbols}

      const quoteList: Array<string> = Object.keys(symbols || {})
      state.symbolsObj = symbols
      // state.symbolsObj = symbols.reduce((prev, curr) => {
      //   prev[curr.symbol_code] = curr
      //   if (curr.white_enabled || (curr.state !== 'offline' && !curr.country_disabled)) {
      //     if ((curr.tags || '').includes('alts') && !(curr.tags || '').includes('hidden')) {
      //       flag = true
      //     } else {
      //       !quoteList.includes(curr.quoteList) && quoteList.push(curr.quote_currency)
      //     }
      //   }
      //   return prev
      // }, {})
      state.quoteList = quoteList
    })
    .addCase(fetchSymbols.rejected, (state, { payload: { errorMessage } }) => {
      state.error = errorMessage
      state.symbols = {}
    })
)
