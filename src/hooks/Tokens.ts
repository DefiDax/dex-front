import { parseBytes32String } from '@ethersproject/strings'
import { Currency, ETHER, Token, currencyEquals } from '../uniswap-sdk'
import { useMemo } from 'react'
import { useSelectedTokenList } from '../state/lists/hooks'
import { useSingleCallResult } from '../state/multicall/hooks'
import { useUserAddedTokens } from '../state/user/hooks'
import { isAddress } from '../utils'

import { useActiveHPBWeb3React } from './index'
import { useBytes32TokenContract, useTokenContract } from './useContract'
import { useMultipleContractSingleData } from '../state/multicall/hooks'
import ERC20_INTERFACE, { ERC20_BYTES32_INTERFACE } from '../constants/abis/erc20'

export function useTokens(addresses: string[]): { [address: string]: Token } {
  const { chainId } = useActiveHPBWeb3React()
  const tokenNames = useMultipleContractSingleData(addresses, ERC20_INTERFACE, 'name')
  const tokenNameBytes32s = useMultipleContractSingleData(addresses, ERC20_BYTES32_INTERFACE, 'name')
  const symbols = useMultipleContractSingleData(addresses, ERC20_INTERFACE, 'symbol')
  const symbolBytes32s = useMultipleContractSingleData(addresses, ERC20_BYTES32_INTERFACE, 'symbol')
  const decimals = useMultipleContractSingleData(addresses, ERC20_INTERFACE, 'decimals')

  return useMemo(() => {
    if (!chainId || !addresses || !addresses.length) return {}
    const isTokenNameLoading = tokenNames.some(tokenName => tokenName.loading)
    const isTokenNameBytes32sLoading = tokenNameBytes32s.some(tokenName => tokenName.loading)
    const isSymbolLoading = symbols.some(tokenName => tokenName.loading)
    const isDecimalLoading = decimals.some(tokenName => tokenName.loading)
    if (isTokenNameLoading || isTokenNameBytes32sLoading || isSymbolLoading || isDecimalLoading) return {}
    const isTokenNameResultExist = tokenNames.every(item => item.result)
    const isTokenNameBytes32sResultExist = tokenNameBytes32s.every(item => item.result)
    const isSymbolResultExist = symbols.every(item => item.result)
    const isDecimalResultExist = decimals.every(item => item.result)
    if (isTokenNameBytes32sResultExist && isTokenNameResultExist && isSymbolResultExist && isDecimalResultExist) {
      return addresses.reduce<{ [address: string]: Token }>((tokenMap, address: string, idx) => {
        tokenMap[address] = new Token(
          chainId,
          address,
          decimals[idx].result?.[0],
          parseStringOrBytes32(symbols[idx].result?.[0], symbolBytes32s[idx].result?.[0], 'UNKNOWN'),
          parseStringOrBytes32(tokenNames[idx].result?.[0], tokenNameBytes32s[idx].result?.[0], 'Unknown Token')
        )
        return tokenMap
      }, {})
    } else {
      return {}
    }
  }, [tokenNames, tokenNameBytes32s, symbols, decimals])
}

export function useAllTokens(): { [address: string]: Token } {
  const { chainId } = useActiveHPBWeb3React()
  const userAddedTokens = useUserAddedTokens()
  const allTokens = useSelectedTokenList()

  return useMemo(() => {
    if (!chainId) return {}
    return (
      userAddedTokens
        // reduce into all ALL_TOKENS filtered by the current chain
        .reduce<{ [address: string]: Token }>(
          (tokenMap, token) => {
            tokenMap[token.address] = token
            return tokenMap
          },
          // must make a copy because reduce modifies the map, and we do not
          // want to make a copy in every iteration
          { ...allTokens[chainId] }
        )
    )
  }, [chainId, userAddedTokens, allTokens])
}

// Check if currency is included in custom list from user storage
export function useIsUserAddedToken(currency: Currency): boolean {
  const userAddedTokens = useUserAddedTokens()
  return !!userAddedTokens.find(token => currencyEquals(currency, token))
}

// parse a name or symbol from a token response
const BYTES32_REGEX = /^0x[a-fA-F0-9]{64}$/
function parseStringOrBytes32(str: string | undefined, bytes32: string | undefined, defaultValue: string): string {
  return str && str.length > 0
    ? str
    : bytes32 && BYTES32_REGEX.test(bytes32)
    ? parseBytes32String(bytes32)
    : defaultValue
}

// undefined if invalid or does not exist
// null if loading
// otherwise returns the token
export function useToken(tokenAddress?: string): Token | undefined | null {
  const { chainId } = useActiveHPBWeb3React()
  // const tokens = useAllTokens()

  const address = isAddress(tokenAddress)

  const tokenContract = useTokenContract(address ? address : undefined, false)
  const tokenContractBytes32 = useBytes32TokenContract(address ? address : undefined, false)
  // const token: Token | undefined = address ? tokens[address] : undefined

  const tokenName = useSingleCallResult(tokenContract, 'name', undefined)
  const tokenNameBytes32 = useSingleCallResult(tokenContractBytes32, 'name', undefined)
  const symbol = useSingleCallResult(tokenContract, 'symbol', undefined)
  const symbolBytes32 = useSingleCallResult(tokenContractBytes32, 'symbol', undefined)
  const decimals = useSingleCallResult(tokenContract, 'decimals', undefined)

  return useMemo(() => {
    if (!chainId || !address) return undefined
    if (decimals.loading || symbol.loading || tokenName.loading) return null
    if (decimals.result) {
      return new Token(
        chainId,
        address,
        decimals.result[0],
        parseStringOrBytes32(symbol.result?.[0], symbolBytes32.result?.[0], 'UNKNOWN'),
        parseStringOrBytes32(tokenName.result?.[0], tokenNameBytes32.result?.[0], 'Unknown Token')
      )
    }
    return undefined
  }, [
    address,
    chainId,
    decimals.loading,
    decimals.result,
    symbol.loading,
    symbol.result,
    symbolBytes32.result,
    tokenName.loading,
    tokenName.result,
    tokenNameBytes32.result
  ])
}

export function useCurrency(currencyId: string | undefined): Currency | null | undefined {
  const isETH = currencyId?.toUpperCase() === 'ETH'
  const token = useToken(isETH ? undefined : currencyId) // 根据 currencyId 来获取 token
  return isETH ? ETHER : token
}
