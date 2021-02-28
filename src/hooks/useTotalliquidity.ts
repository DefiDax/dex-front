import { useMemo, useEffect, useState } from 'react'
import _ from 'lodash'
import Big from 'big.js'
import { useSymbolList } from '../state/symbols/hooks'
import { 
    useTrades
  } from '../state/swap/hooks'
import { useCurrency } from './Tokens'
import { Currency} from '../uniswap-sdk'
import { ETH } from '../data/assets'

const TARGET_SYMBOL = "ETH"

export function useTotalliquidity(
    CurrencyA: Currency, 
    CurrencyB: Currency, //本位币
    quantityA:any, 
    quantityB:any,
    token10Rate:any,
    token11Rate:any,
): [number, number, number] {

    const [ratio , setRatio]= useState<string|undefined>("0")
    const [baseToken , setBaseToken]= useState<Currency>()
    const symbolList = useSymbolList()
    const TARGET_PRICE =  useMemo(() => {
        let TARGET_ITEM = _.find(symbolList['USDT'], { 'symbol': TARGET_SYMBOL})
        return TARGET_ITEM ? TARGET_ITEM.price : 0;
    }, [symbolList])
    const { bestTradeExactIn } = useTrades(useCurrency(ETH) ?? undefined, baseToken ?? undefined);


    useEffect(()=>{
        setBaseToken(CurrencyB)
    },[CurrencyB])
    useEffect(()=>{
        const price = bestTradeExactIn?.executionPrice
        const show = Boolean(price?.baseCurrency && price?.quoteCurrency)
        let token00Rate : string|undefined  = "0"
        if (show) {
            //token00Rate = price?.toSignificant(6)
            token00Rate = price?.invert()?.toSignificant(6)
        }
        setRatio(token00Rate)
        console.log('bestTradeExactIn', bestTradeExactIn)
    }, [bestTradeExactIn])

    
    // const STANDARD_RATIO =  useMemo(() => {
    //     console.log("bestTradeExactIn", bestTradeExactIn)
    //     const price = bestTradeExactIn?.executionPrice
    //     const show = Boolean(price?.baseCurrency && price?.quoteCurrency)
    //     if (show) {
    //         const token00Rate = price?.toSignificant(6)
    //         //const token11Rate = price?.invert()?.toSignificant(6)
    //         return token00Rate;
    //     }
    //     return 0
    // }, [bestTradeExactIn])

    
    return useMemo(() => {
        let tokenA = CurrencyA?.symbol ?? '';
        let tokenB = CurrencyB?.symbol ?? '';
        let total = 0;
        if(tokenA && tokenA && TARGET_PRICE && token11Rate && token10Rate){
            
            if(tokenA == TARGET_SYMBOL){
                let price1 = new Big(token11Rate).times(TARGET_PRICE).toNumber()
                let x = new Big(TARGET_PRICE).times(quantityA);
                let y = new Big(price1).times(quantityB);
                total = y.plus(x).round(0).toNumber()
                return [total,TARGET_PRICE, price1]
            }else if(tokenB == TARGET_SYMBOL){
                let price1 = new Big(token10Rate).times(TARGET_PRICE).toNumber()
                let x = new Big(price1).times(quantityA);
                let y = new Big(TARGET_PRICE).times(quantityB);
                total = y.plus(x).round(0).toNumber()
                return [total,price1,TARGET_PRICE]
            }else if(ratio){
                console.log('ratio', ratio)
                let price1 = new Big(ratio).times(TARGET_PRICE).toNumber()//本位币法币价格
                let price2 = new Big(price1).times(token10Rate).toNumber()
                let x = new Big(price2).times(quantityA);
                let y = new Big(price1).times(quantityB);
                total = y.plus(x).round(0).toNumber()
                return [total,price2,price1]
            }
        }
        

        return [total,0,0]
        
      }, [ratio, TARGET_PRICE, CurrencyA, CurrencyB, token10Rate, token11Rate])
    
}

// interface Response {
//     error_code: number;
//     error_message: string;
//     data: { [key: string]: Array<any> }
// }

// const fetcher = (url:string) => fetch(url).then(r => r.json())

// function getCryptoCurrency(): Promise<Response> {
    
//     return fetcher('/v1/cryptocurrency')
// }

// export function useTotalliquidity(tokenA: string | undefined , tokenB: string | undefined, quantityA:any, quantityB:any ): [Number, Number] {
//     const [reserve0, setReserve0] = useState<any>()
//     if(tokenA && tokenB){
        
//         getCryptoCurrency().then(res => {
//             setReserve0(res.data)
            
//             const symbol =  _.find(res.data[tokenA], { 'symbol': tokenB});
//             console.log(symbol)
//         }).catch(error => {
            
//             throw error
//         })

//         // const symbol = _.find(symbolData, { 'symbol': tokenB});
//         console.log(reserve0)
        
//         //console.log(symbol)

//     }
//     console.log(quantityA)
//     console.log(quantityB)

//     return  [0, 0]
//   }