import { TokenAmount, Pair, Currency, Token, ChainId } from '../uniswap-sdk'
import { useMemo } from 'react'
import { abi as IUniswapV2PairABI } from '@uniswap/v2-core/build/IUniswapV2Pair.json'
import { Interface } from '@ethersproject/abi'
import { useActiveHPBWeb3React } from '../hooks'

import { useMultipleContractSingleData, useSingleContractMultipleData } from '../state/multicall/hooks'
import { wrappedCurrency } from '../utils/wrappedCurrency'
import { useFactoryContract } from '../hooks/useContract'
import { UniswapV2Factory } from './assets'

const PAIR_INTERFACE = new Interface(IUniswapV2PairABI)

export enum PairState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID
}

export function usePairAddresses(tokens: (Token | undefined)[][]) {
  const factory = useFactoryContract(UniswapV2Factory);
  const args = useMemo(() => tokens.filter(([tokenA, tokenB]) => tokenA && tokenB && !tokenA.equals(tokenB)).map(([tokenA, tokenB]) => [tokenA?.address, tokenB?.address]), [tokens]);
  const results = useSingleContractMultipleData(
    factory,
    'getPair',
    args
  )
  return useMemo(() => {
    return results.map(({ result }) => {
      return result?.pair ?? undefined
    })
  }, [results])
}

// TODO 迁移到 pair.ts 文件
export function usePairAddress(currencyA?: Currency, currencyB?: Currency) {
  const { chainId } = useActiveHPBWeb3React()
  const tokenA = wrappedCurrency(currencyA, chainId)
  const tokenB = wrappedCurrency(currencyB, chainId)
  return usePairAddresses([[tokenA, tokenB]])[0]
}

export function usePairs(currencies: [Currency | undefined, Currency | undefined][]): [PairState, Pair | null][] {
  const { chainId } = useActiveHPBWeb3React()

  const tokens = useMemo(
    () =>
      currencies.map(([currencyA, currencyB]) => [
        wrappedCurrency(currencyA, chainId),
        wrappedCurrency(currencyB, chainId)
      ]),
    [chainId, currencies]
  )

  // const pairAddresses = useMemo(
  //   () =>
  //     tokens.map(([tokenA, tokenB]) => {
  //       return tokenA && tokenB && !tokenA.equals(tokenB) ? Pair.getAddress(tokenA, tokenB) : undefined
  //     }),
  //   [tokens]
  // )
  let pairAddresses = usePairAddresses(tokens);
  // FIXME 直接返回空数组 AddLiquidity 组件直接刷新会报错
  if (!pairAddresses.length) {
    tokens.forEach(() => pairAddresses.push(undefined))
  }
  // console.log('test=====================', pairAddresses)
  const results = useMultipleContractSingleData(pairAddresses, PAIR_INTERFACE, 'getReserves') // 储备
  // console.log('results', results) // TODO 获取到的储备为空
  return useMemo(() => {
    return results.map((result, i) => {
      const { result: reserves, loading } = result
      const tokenA = tokens[i][0]
      const tokenB = tokens[i][1]

      if (loading) return [PairState.LOADING, null]
      if (!tokenA || !tokenB || tokenA.equals(tokenB)) return [PairState.INVALID, null]
      if (!reserves) return [PairState.NOT_EXISTS, null]
      const { reserve0, reserve1 } = reserves
      const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]

      // NOTE 由于 uniswap-sdk 中获取 pairAddress 是通过算法 getCreate2Address 计算得到的，但是 HPB 目前不支持，所以计算出来的结果有误，
        // 因此，这里我们手动创建 liquidityToken 变量，并替换 pair 实例上的同名属性，保证依赖该字段的后续计算正确
      const liquidityToken = new Token(chainId || ChainId.HPB, pairAddresses[i], 18, 'UNI-V2', 'Uniswap V2')
      const pair = new Pair(new TokenAmount(token0, reserve0.toString()), new TokenAmount(token1, reserve1.toString()));
      pair.liquidityToken = liquidityToken;
      return [
        PairState.EXISTS,
        pair
      ]
    })
  }, [results, tokens])
}

export function usePair(tokenA?: Currency, tokenB?: Currency): [PairState, Pair | null] {
  return usePairs([[tokenA, tokenB]])[0]
}
