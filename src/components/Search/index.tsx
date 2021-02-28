import React, { useState } from 'react';
// import React, { useState, useEffect, useMemo, useRef } from 'react'
import styled from 'styled-components'
import _ from 'lodash'
// import Row from '../Row'
// import TokenLogo from '../TokenLogo'
import { Search as SearchIcon, X } from 'react-feather'

import { useTranslation } from 'react-i18next'
// import { BasicLink } from '../Link'

// import { useAllTokenData, useTokenData } from '../../contexts/TokenData'
// import { useAllPairData, usePairData } from '../../contexts/PairData'
// import DoubleTokenLogo from '../DoubleLogo'
// import { useMedia } from 'react-use'
// import { useAllPairsInUniswap, useAllTokensInUniswap } from '../../contexts/GlobalData'
// import { OVERVIEW_TOKEN_BLACKLIST, PAIR_BLACKLIST } from '../../constants'

// import { transparentize } from 'polished'
// import { client } from '../../apollo/client'
// import { PAIR_SEARCH, TOKEN_SEARCH } from '../../apollo/queries'
// import FormattedName from '../FormattedName'
// import { TYPE } from '../../Theme'

import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../state'
import { fetchSymbols } from '../../state/symbols/actions';
import { useSymbolList } from '../../state/symbols/hooks'
//useSymbolList
const Container = styled.div`
  height: 38px;
  z-index: 30;
  position: relative;
  margin:0 16px;

  @media screen and (max-width: 600px) {
    width: 100%;
  }
`

const Wrapper = styled.div`
  display: flex;
  position: relative;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  z-index: 9999;
  width: 100%;
  min-width: 300px;
  box-sizing: border-box;
  border: 1px solid #383F66;
  border-radius: 2px;
  background-color: ${({ theme }) => theme.bg1};
`
const Input = styled.input`
  display: flex;
  align-items: center;
  white-space: nowrap;
  padding: 11px 16px;
  padding-left: 36.8px;
  background: none;
  border: none;
  outline: none;
  width: 100%;
  color: ${({ theme }) => theme.text1};

  ::placeholder {
    color: ${({ theme }) => theme.text3};
    font-size: 14px;
  }

  @media screen and (max-width: 640px) {
    ::placeholder {
      font-size: 1rem;
    }
  }
`

const SearchIconLarge = styled(SearchIcon)`
  height: 15px;
  width: 15px;
  margin-right: 0.5rem;
  position: absolute;
  left: 10px;
  pointer-events: none;
  color: ${({ theme }) => theme.text3};
`

const CloseIcon = styled(X)`
  height: 15px;
  width: 15px;
  margin-right: 0.5rem;
  position: absolute;
  right: 10px;
  color: ${({ theme }) => theme.text3};
  :hover {
    cursor: pointer;
  }
`
// eslint-disable-next-line react/prop-types
export const Search = () => {
  // let allTokens = useAllTokensInUniswap()
  // const allTokenData = useAllTokenData()

  // let allPairs = useAllPairsInUniswap()
  // const allPairData = useAllPairData()
  const { t } = useTranslation()

  const [showMenu, toggleMenu] = useState(false)
  const [value, setValue] = useState('')
  // const [, toggleShadow] = useState(false)
  // const [, toggleBottomShadow] = useState(false)

  // // fetch new data on tokens and pairs if needed
  // useTokenData(value)
  // usePairData(value)

  // const below700 = useMedia('(max-width: 700px)')
  // const below470 = useMedia('(max-width: 470px)')
  // const below410 = useMedia('(max-width: 410px)')

  // useEffect(() => {
  //   if (value !== '') {
  //     toggleMenu(true)
  //   } else {
  //     toggleMenu(false)
  //   }
  // }, [value])

  // const [searchedTokens, setSearchedTokens] = useState([])
  // const [searchedPairs, setSearchedPairs] = useState([])

  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       if (value?.length > 0) {
  //         let tokens = await client.query({
  //           variables: {
  //             value: value ? value.toUpperCase() : '',
  //             id: value
  //           },
  //           query: TOKEN_SEARCH
  //         })

  //         let pairs = await client.query({
  //           query: PAIR_SEARCH,
  //           variables: {
  //             tokens: tokens.data.asSymbol?.map(t => t.id),
  //             id: value
  //           }
  //         })
  //         setSearchedPairs(pairs.data.as0.concat(pairs.data.as1).concat(pairs.data.asAddress))
  //         let foundTokens = tokens.data.asSymbol.concat(tokens.data.asAddress).concat(tokens.data.asName)
  //         setSearchedTokens(foundTokens)
  //       }
  //     } catch (e) {
  //       console.log(e)
  //     }
  //   }
  //   fetchData()
  // }, [value])

  // function escapeRegExp(string) {
  //   return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
  // }

  // // add the searched tokens to the list if now found yet
  // allTokens = allTokens.concat(
  //   searchedTokens.filter(searchedToken => {
  //     let included = false
  //     allTokens.map(token => {
  //       if (token.id === searchedToken.id) {
  //         included = true
  //       }
  //       return true
  //     })
  //     return !included
  //   })
  // )

  // let uniqueTokens = []
  // let found = {}
  // allTokens &&
  //   allTokens.map(token => {
  //     if (!found[token.id]) {
  //       found[token.id] = true
  //       uniqueTokens.push(token)
  //     }
  //     return true
  //   })

  // allPairs = allPairs.concat(
  //   searchedPairs.filter(searchedPair => {
  //     let included = false
  //     allPairs.map(pair => {
  //       if (pair.id === searchedPair.id) {
  //         included = true
  //       }
  //       return true
  //     })
  //     return !included
  //   })
  // )

  // let uniquePairs = []
  // let pairsFound = {}
  // allPairs &&
  //   allPairs.map(pair => {
  //     if (!pairsFound[pair.id]) {
  //       pairsFound[pair.id] = true
  //       uniquePairs.push(pair)
  //     }
  //     return true
  //   })

  // const filteredTokenList = useMemo(() => {
  //   return uniqueTokens
  //     ? uniqueTokens
  //         .sort((a, b) => {
  //           if (OVERVIEW_TOKEN_BLACKLIST.includes(a.id)) {
  //             return 1
  //           }
  //           if (OVERVIEW_TOKEN_BLACKLIST.includes(b.id)) {
  //             return -1
  //           }
  //           const tokenA = allTokenData[a.id]
  //           const tokenB = allTokenData[b.id]
  //           if (tokenA?.oneDayVolumeUSD && tokenB?.oneDayVolumeUSD) {
  //             return tokenA.oneDayVolumeUSD > tokenB.oneDayVolumeUSD ? -1 : 1
  //           }
  //           if (tokenA?.oneDayVolumeUSD && !tokenB?.oneDayVolumeUSD) {
  //             return -1
  //           }
  //           if (!tokenA?.oneDayVolumeUSD && tokenB?.oneDayVolumeUSD) {
  //             return tokenA?.totalLiquidity > tokenB?.totalLiquidity ? -1 : 1
  //           }
  //           return 1
  //         })
  //         .filter(token => {
  //           if (OVERVIEW_TOKEN_BLACKLIST.includes(token.id)) {
  //             return false
  //           }
  //           const regexMatches = Object.keys(token).map(tokenEntryKey => {
  //             const isAddress = value.slice(0, 2) === '0x'
  //             if (tokenEntryKey === 'id' && isAddress) {
  //               return token[tokenEntryKey].match(new RegExp(escapeRegExp(value), 'i'))
  //             }
  //             if (tokenEntryKey === 'symbol' && !isAddress) {
  //               return token[tokenEntryKey].match(new RegExp(escapeRegExp(value), 'i'))
  //             }
  //             if (tokenEntryKey === 'name' && !isAddress) {
  //               return token[tokenEntryKey].match(new RegExp(escapeRegExp(value), 'i'))
  //             }
  //             return false
  //           })
  //           return regexMatches.some(m => m)
  //         })
  //     : []
  // }, [allTokenData, uniqueTokens, value])

  // const filteredPairList = useMemo(() => {
  //   return uniquePairs
  //     ? uniquePairs
  //         .sort((a, b) => {
  //           const pairA = allPairData[a.id]
  //           const pairB = allPairData[b.id]
  //           if (pairA?.trackedReserveETH && pairB?.trackedReserveETH) {
  //             return parseFloat(pairA.trackedReserveETH) > parseFloat(pairB.trackedReserveETH) ? -1 : 1
  //           }
  //           if (pairA?.trackedReserveETH && !pairB?.trackedReserveETH) {
  //             return -1
  //           }
  //           if (!pairA?.trackedReserveETH && pairB?.trackedReserveETH) {
  //             return 1
  //           }
  //           return 0
  //         })
  //         .filter(pair => {
  //           if (PAIR_BLACKLIST.includes(pair.id)) {
  //             return false
  //           }
  //           if (value && value.includes(' ')) {
  //             const pairA = value.split(' ')[0]?.toUpperCase()
  //             const pairB = value.split(' ')[1]?.toUpperCase()
  //             return (
  //               (pair.token0.symbol.includes(pairA) || pair.token0.symbol.includes(pairB)) &&
  //               (pair.token1.symbol.includes(pairA) || pair.token1.symbol.includes(pairB))
  //             )
  //           }
  //           if (value && value.includes('-')) {
  //             const pairA = value.split('-')[0]?.toUpperCase()
  //             const pairB = value.split('-')[1]?.toUpperCase()
  //             return (
  //               (pair.token0.symbol.includes(pairA) || pair.token0.symbol.includes(pairB)) &&
  //               (pair.token1.symbol.includes(pairA) || pair.token1.symbol.includes(pairB))
  //             )
  //           }
  //           const regexMatches = Object.keys(pair).map(field => {
  //             const isAddress = value.slice(0, 2) === '0x'
  //             if (field === 'id' && isAddress) {
  //               return pair[field].match(new RegExp(escapeRegExp(value), 'i'))
  //             }
  //             if (field === 'token0') {
  //               return (
  //                 pair[field].symbol.match(new RegExp(escapeRegExp(value), 'i')) ||
  //                 pair[field].name.match(new RegExp(escapeRegExp(value), 'i'))
  //               )
  //             }
  //             if (field === 'token1') {
  //               return (
  //                 pair[field].symbol.match(new RegExp(escapeRegExp(value), 'i')) ||
  //                 pair[field].name.match(new RegExp(escapeRegExp(value), 'i'))
  //               )
  //             }
  //             return false
  //           })
  //           return regexMatches.some(m => m)
  //         })
  //     : []
  // }, [allPairData, uniquePairs, value])

  // useEffect(() => {
  //   if (Object.keys(filteredTokenList).length > 2) {
  //     toggleShadow(true)
  //   } else {
  //     toggleShadow(false)
  //   }
  // }, [filteredTokenList])

  // useEffect(() => {
  //   if (Object.keys(filteredPairList).length > 2) {
  //     toggleBottomShadow(true)
  //   } else {
  //     toggleBottomShadow(false)
  //   }
  // }, [filteredPairList])

  // const [tokensShown, setTokensShown] = useState(3)
  // const [pairsShown, setPairsShown] = useState(3)

  // function onDismiss() {
  //   setPairsShown(3)
  //   setTokensShown(3)
  //   toggleMenu(false)
  //   setValue('')
  // }

  // // refs to detect clicks outside modal
  // const wrapperRef = useRef()
  // const menuRef = useRef()

  const symbolList = useSymbolList()
  const dispatch = useDispatch<AppDispatch>()

  const handleChange = (e:React.ChangeEvent<HTMLInputElement>):void => {

    let list = symbolList;
    _.forEach(symbolList, function(value, key) {
    list = { ...list, [key]: _.filter(value, function(word) { 
      return word.symbol.toLowerCase().indexOf(e.target.value.toLowerCase()) != -1; 
    })}
  });

   dispatch(fetchSymbols.pending({ symbols: list }));
   setValue(e.target.value)

  }

  // useEffect(() => {
  //   document.addEventListener('click', handleClick)
  //   return () => {
  //     document.removeEventListener('click', handleClick)
  //   }
  // })

  return (
    <Container>
      <Wrapper>
        <Input
          type={'text'}
          placeholder={t('search')}
          value={value}
          onChange={handleChange}
        />
        {!showMenu ? <SearchIconLarge /> : <CloseIcon onClick={() => toggleMenu(false)} />}
      </Wrapper>
    </Container>
  )
}

export default Search
