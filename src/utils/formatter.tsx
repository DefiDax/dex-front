import React from 'react';
import { Text } from 'rebass'
// import Numeral from 'numeral'

// using a currency library here in case we want to add more in future
var priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
})

export const toK = (num: any) => {
    return num;
    // return Numeral(num).format('0.[00]a')
}

export const formattedNum = (number: any, usd = false, acceptNegatives = false) => {
  if (isNaN(number) || number === '' || number === undefined) {
    return usd ? '0' : 0
  }
  let num = parseFloat(number)

  if (num > 500000000) {
    return (usd ? '' : '') + toK(num.toFixed(0))
  }

  if (num === 0) {
    if (usd) {
      return '0'
    }
    return 0
  }

  if (num < 0.0001 && num > 0) {
    return usd ? '< 0.0001' : '< 0.0001'
  }

  if (num > 1000) {
    return usd
      ? '' + Number(parseFloat(`${num}`).toFixed(0)).toLocaleString()
      : '' + Number(parseFloat(`${num}`).toFixed(0)).toLocaleString()
  }

  if (usd) {
    if (num < 0.1) {
      return '' + Number(parseFloat(`${num}`).toFixed(4))
    } else {
      let usdString = priceFormatter.format(num)
      return '' + usdString.slice(1, usdString.length)
    }
  }

  return Number(parseFloat(`${num}`).toFixed(5))
}

export function formattedPercent(percent_str: string, useBrackets = false) {
  let percent = parseFloat(percent_str)
  if (!percent || percent === 0) {
    return <Text fontWeight={500}>0%</Text>
  }

  if (percent < 0.0001 && percent > 0) {
    return (
      <Text fontWeight={500} color="#C02464">
        {'< 0.0001%'}
      </Text>
    )
  }

  if (percent < 0 && percent > -0.0001) {
    return (
      <Text fontWeight={500} color="#88A640">
        {'< 0.0001%'}
      </Text>
    )
  }

  let fixedPercent = percent.toFixed(2)
  if (fixedPercent === '0.00') {
    return '0%'
  }
  if (+fixedPercent > 0) {
    if (+fixedPercent > 100) {
      return <Text fontWeight={500} color="#C02464">{`+${percent?.toFixed(0).toLocaleString()}%`}</Text>
    } else {
      return <Text fontWeight={500} color="#C02464">{`+${fixedPercent}%`}</Text>
    }
  } else {
    return <Text fontWeight={500} color="#88A640">{`${fixedPercent}%`}</Text>
  }
}
