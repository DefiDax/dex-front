import { useEffect, useState, useMemo } from 'react'
import { Interface } from '@ethersproject/abi'
import { Token } from '../uniswap-sdk'
import { abi as IUniswapV2PairABI } from '@uniswap/v2-core/build/IUniswapV2Pair.json'
import { useFactoryContract } from './useContract'
import { useSingleContractMultipleData, useMultipleContractSingleData } from '../state/multicall/hooks'
import { UniswapV2Factory } from '../data/assets'
import { useTokens } from './Tokens'

const PAIR_INTERFACE = new Interface(IUniswapV2PairABI)

export function useAllPairsLength(): number | undefined {
  const [length, setLength] = useState<number>()
  const factory = useFactoryContract(UniswapV2Factory)
  useEffect(() => {
    ;(async () => {
      if (factory) {
        const result = await factory.allPairsLength()
        if (result) {
          setLength(result.toNumber())
        }
      }
    })()
  }, [setLength, factory])
  return length
}

export function useAllPairs(): [string[], boolean] {
  const factory = useFactoryContract(UniswapV2Factory)
  const pairsLength = useAllPairsLength()
  const args: number[] = useMemo(() => {
    if (pairsLength) {
      return Array.from({ length: pairsLength }).map((_, i) => i)
    }
    return []
  }, [pairsLength])
  const results = useSingleContractMultipleData(
    factory,
    'allPairs',
    args.map(arg => [arg])
  )
  const anyLoading: boolean = useMemo(() => {
    if (pairsLength === undefined) {
      return true
    }
    return results.some(callState => callState.loading)
  }, [pairsLength, results])
  return [
    useMemo(() => {
      return results.map(result => result.result?.[0])
    }, [results]),
    anyLoading
  ]
}

// export function usePair(pairAddress: string) {

// }


export function usePairTokens(pairAddresses: string [], methodName: string): [{ [address: string]: Token }, boolean] {
  const tokens = useMultipleContractSingleData(pairAddresses, PAIR_INTERFACE, methodName)
  const isLoading = useMemo(() => tokens.some(callState => callState.loading), [tokens])
  const tokenAddresses = useMemo(() => {
    if (isLoading) return [];
    return tokens.map(token => token.result?.[0])
  }, [tokens, isLoading])
  const tokenMap = useTokens(tokenAddresses)

  const anyLoading: boolean = useMemo(() => {
    if (!pairAddresses.length) return false
    if (isLoading) return true
    if (!Object.keys(tokenMap).length) return true;
    return false;
  }, [isLoading, tokenMap, pairAddresses])
  return [
    tokenMap,
    anyLoading
  ]
}

export function usePairs(pairAddresses: string[]) {
  const [token0Map, isToken0Loading] = usePairTokens(pairAddresses, 'token0')
  const [token1Map, isToken1Loading] = usePairTokens(pairAddresses, 'token1')
  const reserves = useMultipleContractSingleData(pairAddresses, PAIR_INTERFACE, 'getReserves') // 储备

  // const tokenAAddress = useMemo(() => {
  //   const isLoading = tokenAs.some(callState => callState.loading);
  //   if (isLoading) return [];
  //   return tokenAs.map(tokenA => tokenA.result?.[0])
  // }, [tokenAs])
  // const tokenAMap = useTokens(tokenAAddress)
  console.log('isLoading', isToken0Loading, isToken1Loading)
  console.log('pairs', reserves, token0Map, token1Map)
  return []
  // return useMemo(() => {
  //   return results.map((result, i) => {
  //     const { result: reserves, loading } = result
  //     const tokenA = tokens[i][0]
  //     const tokenB = tokens[i][1]

  //     if (loading) return [PairState.LOADING, null]
  //     if (!tokenA || !tokenB || tokenA.equals(tokenB)) return [PairState.INVALID, null]
  //     if (!reserves) return [PairState.NOT_EXISTS, null]
  //     const { reserve0, reserve1 } = reserves
  //     const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]
  //     return [
  //       PairState.EXISTS,
  //       new Pair(new TokenAmount(token0, reserve0.toString()), new TokenAmount(token1, reserve1.toString()))
  //     ]
  //   })
  // }, [results, tokens])
}
