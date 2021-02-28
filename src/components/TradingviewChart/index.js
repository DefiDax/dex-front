import React, { useState, useEffect, useRef } from 'react'
import { createChart } from 'lightweight-charts'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { formattedNum } from '../../utils/formatter'
import styled from 'styled-components'
import { usePrevious } from 'react-use'
import { Play } from 'react-feather'
import { useDarkModeManager } from '../../contexts/LocalStorage'
// import { IconWrapper } from '..'

const IconWrapper = styled.div`
  position: absolute;
  right: 0;
  border-radius: 3px;
  height: 16px;
  width: 16px;
  padding: 0px;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.text1};

  :hover {
    cursor: pointer;
    opacity: 0.7;
  }
`

dayjs.extend(utc)

export const CHART_TYPES = {
  BAR: 'BAR',
  AREA: 'AREA',
  COMPOSE: 'COMPOSE'
}

const Wrapper = styled.div`
  position: relative;
`

// constant height for charts
const HEIGHT = 500

const TradingViewChart = ({
  type = CHART_TYPES.BAR,
  data,
  base,
  baseChange,
  field,
  title,
  width,
  useWeekly = false
}) => {
  // reference for DOM element to create with chart
  const ref = useRef()

  // pointer to the chart object
  const [chartCreated, setChartCreated] = useState(false)
  const dataPrev = usePrevious(data)

  useEffect(() => {
    if (data !== dataPrev && chartCreated && type === CHART_TYPES.BAR) {
      // remove the tooltip element
      let tooltip = document.getElementById('tooltip-id' + type)
      let node = document.getElementById('test-id' + type)
      node.removeChild(tooltip)
      chartCreated.resize(0, 0)
      setChartCreated()
    }
  }, [chartCreated, data, dataPrev, type])

  // parese the data and format for tardingview consumption
  const formattedData = data?.map(entry => {
    return {
      time: dayjs
        .unix(entry.date)
        .utc()
        .format('YYYY-MM-DD'),
      value: parseFloat(entry[field])
    }
  })

  // adjust the scale based on the type of chart
  const topScale = type === CHART_TYPES.AREA ? 0.32 : 0.2

  const [darkMode] = useDarkModeManager()
  const textColor = darkMode ? 'white' : 'black'
  const previousTheme = usePrevious(darkMode)

  // reset the chart if them switches
  useEffect(() => {
    if (chartCreated && previousTheme !== darkMode) {
      // remove the tooltip element
      let tooltip = document.getElementById('tooltip-id' + type)
      let node = document.getElementById('test-id' + type)
      node.removeChild(tooltip)
      chartCreated.resize(0, 0)
      setChartCreated()
    }
  }, [chartCreated, darkMode, previousTheme, type])

  // if no chart created yet, create one with options and add to DOM manually
  useEffect(() => {
    if (!chartCreated && formattedData) {
      var chart = createChart(ref.current, {
        width: width,
        height: HEIGHT,
        layout: {
          backgroundColor: 'transparent',
          textColor: textColor
        },
        rightPriceScale: {
          scaleMargins: {
            top: topScale,
            bottom: 0
          },
          borderVisible: false
        },
        timeScale: {
          borderVisible: false
        },
        grid: {
          horzLines: {
            color: 'rgba(197, 203, 206, 0.5)',
            visible: false
          },
          vertLines: {
            color: 'rgba(197, 203, 206, 0.5)',
            visible: false
          }
        },
        crosshair: {
          horzLine: {
            visible: false,
            labelVisible: false
          },
          vertLine: {
            visible: true,
            style: 0,
            width: 2,
            color: 'rgba(32, 38, 46, 0.1)',
            labelVisible: false
          }
        },
        localization: {
          priceFormatter: val => formattedNum(val, true)
        }
      })
      if (type === CHART_TYPES.BAR) {
        const series = chart.addHistogramSeries({
          color: '#ff007a',
          priceFormat: {
            type: 'volume'
          },
          scaleMargins: {
            top: 0.32,
            bottom: 0
          },
          lineColor: '#ff007a',
          lineWidth: 3
        })
        series.setData(formattedData)
      } else if (type === CHART_TYPES.AREA) {
        const series = chart.addAreaSeries({
          topColor: '#ff007a',
          bottomColor: 'rgba(255, 0, 122, 0)',
          lineColor: '#ff007a',
          lineWidth: 3
        })
        series.setData(formattedData)
      } else {
        console.log('here')
        const candleSeries = chart.addCandlestickSeries()
        candleSeries.setData([
          { time: '2018-10-19', open: 54.62, high: 55.5, low: 54.52, close: 54.9 },
          { time: '2018-10-22', open: 55.08, high: 55.27, low: 54.61, close: 54.98 },
          { time: '2018-10-23', open: 56.09, high: 57.47, low: 56.09, close: 57.21 },
          { time: '2018-10-24', open: 57.0, high: 58.44, low: 56.41, close: 57.42 },
          { time: '2018-10-25', open: 57.46, high: 57.63, low: 56.17, close: 56.43 },
          { time: '2018-10-26', open: 56.26, high: 56.62, low: 55.19, close: 55.51 },
          { time: '2018-10-29', open: 55.81, high: 57.15, low: 55.72, close: 56.48 },
          { time: '2018-10-30', open: 56.92, high: 58.8, low: 56.92, close: 58.18 },
          { time: '2018-10-31', open: 58.32, high: 58.32, low: 56.76, close: 57.09 },
          { time: '2018-11-01', open: 56.98, high: 57.28, low: 55.55, close: 56.05 },
          { time: '2018-11-02', open: 56.34, high: 57.08, low: 55.92, close: 56.63 },
          { time: '2018-11-05', open: 56.51, high: 57.45, low: 56.51, close: 57.21 },
          { time: '2018-11-06', open: 57.02, high: 57.35, low: 56.65, close: 57.21 },
          { time: '2018-11-07', open: 57.55, high: 57.78, low: 57.03, close: 57.65 },
          { time: '2018-11-08', open: 57.7, high: 58.44, low: 57.66, close: 58.27 },
          { time: '2018-11-09', open: 58.32, high: 59.2, low: 57.94, close: 58.46 },
          { time: '2018-11-12', open: 58.84, high: 59.4, low: 58.54, close: 58.72 },
          { time: '2018-11-13', open: 59.09, high: 59.14, low: 58.32, close: 58.66 },
          { time: '2018-11-14', open: 59.13, high: 59.32, low: 58.41, close: 58.94 },
          { time: '2018-11-15', open: 58.85, high: 59.09, low: 58.45, close: 59.08 },
          { time: '2018-11-16', open: 59.06, high: 60.39, low: 58.91, close: 60.21 },
          { time: '2018-11-19', open: 60.25, high: 61.32, low: 60.18, close: 60.62 },
          { time: '2018-11-20', open: 61.03, high: 61.58, low: 59.17, close: 59.46 },
          { time: '2018-11-21', open: 59.26, high: 59.9, low: 58.88, close: 59.16 },
          { time: '2018-11-23', open: 58.86, high: 59.0, low: 58.29, close: 58.64 },
          { time: '2018-11-26', open: 58.64, high: 59.51, low: 58.31, close: 59.17 },
          { time: '2018-11-27', open: 59.21, high: 60.7, low: 59.18, close: 60.65 },
          { time: '2018-11-28', open: 60.7, high: 60.73, low: 59.64, close: 60.06 },
          { time: '2018-11-29', open: 59.42, high: 59.79, low: 59.26, close: 59.45 },
          { time: '2018-11-30', open: 59.57, high: 60.37, low: 59.48, close: 60.3 },
          { time: '2018-12-03', open: 59.5, high: 59.75, low: 57.69, close: 58.16 },
          { time: '2018-12-04', open: 58.1, high: 59.4, low: 57.96, close: 58.09 },
          { time: '2018-12-06', open: 58.18, high: 58.64, low: 57.16, close: 58.08 },
          { time: '2018-12-07', open: 57.91, high: 58.43, low: 57.34, close: 57.68 },
          { time: '2018-12-10', open: 57.8, high: 58.37, low: 56.87, close: 58.27 },
          { time: '2018-12-11', open: 58.77, high: 59.4, low: 58.63, close: 58.85 },
          { time: '2018-12-12', open: 57.79, high: 58.19, low: 57.23, close: 57.25 },
          { time: '2018-12-13', open: 57.0, high: 57.5, low: 56.81, close: 57.09 },
          { time: '2018-12-14', open: 56.95, high: 57.5, low: 56.75, close: 57.08 },
          { time: '2018-12-17', open: 57.06, high: 57.31, low: 55.53, close: 55.95 },
          { time: '2018-12-18', open: 55.94, high: 56.69, low: 55.31, close: 55.65 },
          { time: '2018-12-19', open: 55.72, high: 56.92, low: 55.5, close: 55.86 },
          { time: '2018-12-20', open: 55.92, high: 56.01, low: 54.26, close: 55.07 },
          { time: '2018-12-21', open: 54.84, high: 56.53, low: 54.24, close: 54.92 },
          { time: '2018-12-24', open: 54.68, high: 55.04, low: 52.94, close: 53.05 },
          { time: '2018-12-26', open: 53.23, high: 54.47, low: 52.4, close: 54.44 },
          { time: '2018-12-27', open: 54.31, high: 55.17, low: 53.35, close: 55.15 },
          { time: '2018-12-28', open: 55.37, high: 55.86, low: 54.9, close: 55.27 },
          { time: '2018-12-31', open: 55.53, high: 56.23, low: 55.07, close: 56.22 },
          { time: '2019-01-02', open: 56.16, high: 56.16, low: 55.28, close: 56.02 },
          { time: '2019-01-03', open: 56.3, high: 56.99, low: 56.06, close: 56.22 },
          { time: '2019-01-04', open: 56.49, high: 56.89, low: 55.95, close: 56.36 },
          { time: '2019-01-07', open: 56.76, high: 57.26, low: 56.55, close: 56.72 },
          { time: '2019-01-08', open: 57.27, high: 58.69, low: 57.05, close: 58.38 },
          { time: '2019-01-09', open: 57.68, high: 57.72, low: 56.85, close: 57.05 },
          { time: '2019-01-10', open: 57.29, high: 57.7, low: 56.87, close: 57.6 },
          { time: '2019-01-11', open: 57.84, high: 58.26, low: 57.42, close: 58.02 },
          { time: '2019-01-14', open: 57.83, high: 58.15, low: 57.67, close: 58.03 },
          { time: '2019-01-15', open: 57.74, high: 58.29, low: 57.58, close: 58.1 },
          { time: '2019-01-16', open: 57.93, high: 57.93, low: 57.0, close: 57.08 },
          { time: '2019-01-17', open: 57.16, high: 57.4, low: 56.21, close: 56.83 },
          { time: '2019-01-18', open: 56.92, high: 57.47, low: 56.84, close: 57.09 },
          { time: '2019-01-22', open: 57.23, high: 57.39, low: 56.4, close: 56.99 },
          { time: '2019-01-23', open: 56.98, high: 57.87, low: 56.93, close: 57.76 },
          { time: '2019-01-24', open: 57.61, high: 57.65, low: 56.5, close: 57.07 },
          { time: '2019-01-25', open: 57.18, high: 57.47, low: 56.23, close: 56.4 },
          { time: '2019-01-28', open: 56.12, high: 56.22, low: 54.8, close: 55.07 },
          { time: '2019-01-29', open: 53.62, high: 54.3, low: 52.97, close: 53.28 },
          { time: '2019-01-30', open: 53.1, high: 54.02, low: 52.28, close: 54.0 },
          { time: '2019-01-31', open: 54.05, high: 55.19, low: 53.53, close: 55.06 },
          { time: '2019-02-01', open: 55.21, high: 55.3, low: 54.47, close: 54.55 },
          { time: '2019-02-04', open: 54.6, high: 54.69, low: 53.67, close: 54.04 },
          { time: '2019-02-05', open: 54.1, high: 54.34, low: 53.61, close: 54.14 },
          { time: '2019-02-06', open: 54.11, high: 54.37, low: 53.68, close: 53.79 },
          { time: '2019-02-07', open: 53.61, high: 53.73, low: 53.02, close: 53.57 },
          { time: '2019-02-08', open: 53.36, high: 53.96, low: 53.3, close: 53.95 },
          { time: '2019-02-11', open: 54.13, high: 54.37, low: 53.86, close: 54.05 },
          { time: '2019-02-12', open: 54.45, high: 54.77, low: 54.19, close: 54.42 },
          { time: '2019-02-13', open: 54.35, high: 54.77, low: 54.28, close: 54.48 },
          { time: '2019-02-14', open: 54.38, high: 54.52, low: 53.95, close: 54.03 },
          { time: '2019-02-15', open: 54.48, high: 55.19, low: 54.32, close: 55.16 },
          { time: '2019-02-19', open: 55.06, high: 55.66, low: 54.82, close: 55.44 },
          { time: '2019-02-20', open: 55.37, high: 55.91, low: 55.24, close: 55.76 },
          { time: '2019-02-21', open: 55.55, high: 56.72, low: 55.46, close: 56.15 },
          { time: '2019-02-22', open: 56.43, high: 57.13, low: 56.4, close: 56.92 },
          { time: '2019-02-25', open: 57.0, high: 57.27, low: 56.55, close: 56.78 },
          { time: '2019-02-26', open: 56.82, high: 57.09, low: 56.46, close: 56.64 },
          { time: '2019-02-27', open: 56.55, high: 56.73, low: 56.35, close: 56.72 },
          { time: '2019-02-28', open: 56.74, high: 57.61, low: 56.72, close: 56.92 },
          { time: '2019-03-01', open: 57.02, high: 57.15, low: 56.35, close: 56.96 },
          { time: '2019-03-04', open: 57.15, high: 57.34, low: 55.66, close: 56.24 },
          { time: '2019-03-05', open: 56.09, high: 56.17, low: 55.51, close: 56.08 },
          { time: '2019-03-06', open: 56.19, high: 56.42, low: 55.45, close: 55.68 },
          { time: '2019-03-07', open: 55.76, high: 56.4, low: 55.72, close: 56.3 },
          { time: '2019-03-08', open: 56.36, high: 56.68, low: 56.0, close: 56.53 },
          { time: '2019-03-11', open: 56.76, high: 57.62, low: 56.75, close: 57.58 },
          { time: '2019-03-12', open: 57.63, high: 58.11, low: 57.36, close: 57.43 },
          { time: '2019-03-13', open: 57.37, high: 57.74, low: 57.34, close: 57.66 },
          { time: '2019-03-14', open: 57.71, high: 58.09, low: 57.51, close: 57.95 },
          { time: '2019-03-15', open: 58.04, high: 58.51, low: 57.93, close: 58.39 },
          { time: '2019-03-18', open: 58.27, high: 58.32, low: 57.56, close: 58.07 },
          { time: '2019-03-19', open: 58.1, high: 58.2, low: 57.31, close: 57.5 },
          { time: '2019-03-20', open: 57.51, high: 58.05, low: 57.11, close: 57.67 },
          { time: '2019-03-21', open: 57.58, high: 58.49, low: 57.57, close: 58.29 },
          { time: '2019-03-22', open: 58.16, high: 60.0, low: 58.13, close: 59.76 },
          { time: '2019-03-25', open: 59.63, high: 60.19, low: 59.53, close: 60.08 },
          { time: '2019-03-26', open: 60.3, high: 60.69, low: 60.17, close: 60.63 },
          { time: '2019-03-27', open: 60.56, high: 61.19, low: 60.48, close: 60.88 },
          { time: '2019-03-28', open: 60.88, high: 60.89, low: 58.44, close: 59.08 },
          { time: '2019-03-29', open: 59.2, high: 59.27, low: 58.32, close: 59.13 },
          { time: '2019-04-01', open: 59.39, high: 59.41, low: 58.79, close: 59.09 },
          { time: '2019-04-02', open: 59.22, high: 59.23, low: 58.34, close: 58.53 },
          { time: '2019-04-03', open: 58.78, high: 59.07, low: 58.41, close: 58.87 },
          { time: '2019-04-04', open: 58.84, high: 59.1, low: 58.77, close: 58.99 },
          { time: '2019-04-05', open: 59.02, high: 59.09, low: 58.82, close: 59.09 },
          { time: '2019-04-08', open: 59.02, high: 59.13, low: 58.72, close: 59.13 },
          { time: '2019-04-09', open: 58.37, high: 58.56, low: 58.04, close: 58.4 },
          { time: '2019-04-10', open: 58.4, high: 58.7, low: 58.36, close: 58.61 },
          { time: '2019-04-11', open: 58.65, high: 58.73, low: 58.2, close: 58.56 },
          { time: '2019-04-12', open: 58.75, high: 58.79, low: 58.52, close: 58.74 },
          { time: '2019-04-15', open: 58.91, high: 58.95, low: 58.59, close: 58.71 },
          { time: '2019-04-16', open: 58.79, high: 58.98, low: 58.66, close: 58.79 },
          { time: '2019-04-17', open: 58.4, high: 58.46, low: 57.64, close: 57.78 },
          { time: '2019-04-18', open: 57.51, high: 58.2, low: 57.28, close: 58.04 },
          { time: '2019-04-22', open: 58.14, high: 58.49, low: 57.89, close: 58.37 },
          { time: '2019-04-23', open: 57.62, high: 57.72, low: 56.3, close: 57.15 },
          { time: '2019-04-24', open: 57.34, high: 57.57, low: 56.73, close: 57.08 },
          { time: '2019-04-25', open: 56.82, high: 56.9, low: 55.75, close: 55.85 },
          { time: '2019-04-26', open: 56.06, high: 56.81, low: 55.83, close: 56.58 },
          { time: '2019-04-29', open: 56.75, high: 57.17, low: 56.71, close: 56.84 },
          { time: '2019-04-30', open: 56.99, high: 57.45, low: 56.76, close: 57.19 },
          { time: '2019-05-01', open: 57.23, high: 57.3, low: 56.52, close: 56.52 },
          { time: '2019-05-02', open: 56.81, high: 58.23, low: 56.68, close: 56.99 },
          { time: '2019-05-03', open: 57.15, high: 57.36, low: 56.87, close: 57.24 },
          { time: '2019-05-06', open: 56.83, high: 57.09, low: 56.74, close: 56.91 },
          { time: '2019-05-07', open: 56.69, high: 56.81, low: 56.33, close: 56.63 },
          { time: '2019-05-08', open: 56.66, high: 56.7, low: 56.25, close: 56.38 },
          { time: '2019-05-09', open: 56.12, high: 56.56, low: 55.93, close: 56.48 },
          { time: '2019-05-10', open: 56.49, high: 57.04, low: 56.26, close: 56.91 },
          { time: '2019-05-13', open: 56.72, high: 57.34, low: 56.66, close: 56.75 },
          { time: '2019-05-14', open: 56.76, high: 57.19, low: 56.5, close: 56.55 },
          { time: '2019-05-15', open: 56.51, high: 56.84, low: 56.17, close: 56.81 },
          { time: '2019-05-16', open: 57.0, high: 57.8, low: 56.82, close: 57.38 },
          { time: '2019-05-17', open: 57.06, high: 58.48, low: 57.01, close: 58.09 },
          { time: '2019-05-20', open: 59.15, high: 60.54, low: 58.0, close: 59.01 },
          { time: '2019-05-21', open: 59.1, high: 59.63, low: 58.76, close: 59.5 },
          { time: '2019-05-22', open: 59.09, high: 59.37, low: 58.96, close: 59.25 },
          { time: '2019-05-23', open: 59.0, high: 59.27, low: 58.54, close: 58.87 },
          { time: '2019-05-24', open: 59.07, high: 59.36, low: 58.67, close: 59.32 },
          { time: '2019-05-28', open: 59.21, high: 59.66, low: 59.02, close: 59.57 }
        ])
        const volumeSeries = chart.addHistogramSeries({
          priceFormat: {
            type: 'volume'
          },
          priceLineVisible: false,
          color: 'rgba(76, 175, 80, 0.5)',
          priceScaleId: '',
          scaleMargins: {
            top: 0.85,
            bottom: 0
          }
        })
        volumeSeries.setData([
          { time: '2018-10-19', value: 33078726.0 },
          { time: '2018-10-22', value: 28792082.0 },
          { time: '2018-10-23', value: 38767846.0 },
          { time: '2018-10-24', value: 40925163.0 },
          { time: '2018-10-25', value: 29855768.0 },
          { time: '2018-10-26', value: 47258375.0 },
          { time: '2018-10-29', value: 45935520.0 },
          { time: '2018-10-30', value: 36659990.0 },
          { time: '2018-10-31', value: 38358933.0 },
          { time: '2018-11-01', value: 58323180.0 },
          { time: '2018-11-02', value: 91328654.0 },
          { time: '2018-11-05', value: 66163669.0 },
          { time: '2018-11-06', value: 31882881.0 },
          { time: '2018-11-07', value: 33424434.0 },
          { time: '2018-11-08', value: 25362636.0 },
          { time: '2018-11-09', value: 34365750.0 },
          { time: '2018-11-12', value: 51135518.0 },
          { time: '2018-11-13', value: 46882936.0 },
          { time: '2018-11-14', value: 60800957.0 },
          { time: '2018-11-15', value: 46478801.0 },
          { time: '2018-11-16', value: 36928253.0 },
          { time: '2018-11-19', value: 41920872.0 },
          { time: '2018-11-20', value: 67825247.0 },
          { time: '2018-11-21', value: 31124210.0 },
          { time: '2018-11-23', value: 23623972.0 },
          { time: '2018-11-26', value: 44998520.0 },
          { time: '2018-11-27', value: 41387377.0 },
          { time: '2018-11-28', value: 46062539.0 },
          { time: '2018-11-29', value: 41769992.0 },
          { time: '2018-11-30', value: 39531549.0 },
          { time: '2018-12-03', value: 40798002.0 },
          { time: '2018-12-04', value: 41344282.0 },
          { time: '2018-12-06', value: 43098410.0 },
          { time: '2018-12-07', value: 42281631.0 },
          { time: '2018-12-10', value: 62025994.0 },
          { time: '2018-12-11', value: 47281665.0 },
          { time: '2018-12-12', value: 35627674.0 },
          { time: '2018-12-13', value: 31897827.0 },
          { time: '2018-12-14', value: 40703710.0 },
          { time: '2018-12-17', value: 44287922.0 },
          { time: '2018-12-18', value: 33841518.0 },
          { time: '2018-12-19', value: 49047297.0 },
          { time: '2018-12-20', value: 64772960.0 },
          { time: '2018-12-21', value: 95744384.0 },
          { time: '2018-12-24', value: 37169232.0 },
          { time: '2018-12-26', value: 58582544.0 },
          { time: '2018-12-27', value: 53117065.0 },
          { time: '2018-12-28', value: 42291424.0 },
          { time: '2018-12-31', value: 35003466.0 },
          { time: '2019-01-02', value: 37039737.0 },
          { time: '2019-01-03', value: 91312195.0 },
          { time: '2019-01-04', value: 58607070.0 },
          { time: '2019-01-07', value: 54777764.0 },
          { time: '2019-01-08', value: 41025314.0 },
          { time: '2019-01-09', value: 45099081.0 },
          { time: '2019-01-10', value: 35780670.0 },
          { time: '2019-01-11', value: 27023241.0 },
          { time: '2019-01-14', value: 32439186.0 },
          { time: '2019-01-15', value: 28710324.0 },
          { time: '2019-01-16', value: 30569706.0 },
          { time: '2019-01-17', value: 29821160.0 },
          { time: '2019-01-18', value: 33751023.0 },
          { time: '2019-01-22', value: 30393970.0 },
          { time: '2019-01-23', value: 23130570.0 },
          { time: '2019-01-24', value: 25441549.0 },
          { time: '2019-01-25', value: 33547893.0 },
          { time: '2019-01-28', value: 26192058.0 },
          { time: '2019-01-29', value: 41587239.0 },
          { time: '2019-01-30', value: 61109780.0 },
          { time: '2019-01-31', value: 40739649.0 },
          { time: '2019-02-01', value: 32668138.0 },
          { time: '2019-02-04', value: 31495582.0 },
          { time: '2019-02-05', value: 36101628.0 },
          { time: '2019-02-06', value: 28239591.0 },
          { time: '2019-02-07', value: 31741690.0 },
          { time: '2019-02-08', value: 23819966.0 },
          { time: '2019-02-11', value: 20993425.0 },
          { time: '2019-02-12', value: 22283523.0 },
          { time: '2019-02-13', value: 22490233.0 },
          { time: '2019-02-14', value: 21835747.0 },
          { time: '2019-02-15', value: 24626814.0 },
          { time: '2019-02-19', value: 18972826.0 },
          { time: '2019-02-20', value: 26114362.0 },
          { time: '2019-02-21', value: 17249670.0 },
          { time: '2019-02-22', value: 18913154.0 },
          { time: '2019-02-25', value: 21873358.0 },
          { time: '2019-02-26', value: 17070211.0 },
          { time: '2019-02-27', value: 27835389.0 },
          { time: '2019-02-28', value: 28215416.0 },
          { time: '2019-03-01', value: 25886167.0 },
          { time: '2019-03-04', value: 27436203.0 },
          { time: '2019-03-05', value: 19737419.0 },
          { time: '2019-03-06', value: 20810384.0 },
          { time: '2019-03-07', value: 24796374.0 },
          { time: '2019-03-08', value: 23999358.0 },
          { time: '2019-03-11', value: 32011034.0 },
          { time: '2019-03-12', value: 32467584.0 },
          { time: '2019-03-13', value: 31032524.0 },
          { time: '2019-03-14', value: 23579508.0 },
          { time: '2019-03-15', value: 39042912.0 },
          { time: '2019-03-18', value: 26219832.0 },
          { time: '2019-03-19', value: 31646369.0 },
          { time: '2019-03-20', value: 31035231.0 },
          { time: '2019-03-21', value: 51034237.0 },
          { time: '2019-03-22', value: 42407666.0 },
          { time: '2019-03-25', value: 43845293.0 },
          { time: '2019-03-26', value: 49800538.0 },
          { time: '2019-03-27', value: 29848427.0 },
          { time: '2019-03-28', value: 20780363.0 },
          { time: '2019-03-29', value: 23563961.0 },
          { time: '2019-04-01', value: 27861964.0 },
          { time: '2019-04-02', value: 22765732.0 },
          { time: '2019-04-03', value: 23271830.0 },
          { time: '2019-04-04', value: 19114275.0 },
          { time: '2019-04-05', value: 18526644.0 },
          { time: '2019-04-08', value: 25881697.0 },
          { time: '2019-04-09', value: 35768237.0 },
          { time: '2019-04-10', value: 21695288.0 },
          { time: '2019-04-11', value: 20900808.0 },
          { time: '2019-04-12', value: 27760668.0 },
          { time: '2019-04-15', value: 17536646.0 },
          { time: '2019-04-16', value: 25696385.0 },
          { time: '2019-04-17', value: 28906780.0 },
          { time: '2019-04-18', value: 24195766.0 },
          { time: '2019-04-22', value: 19439545.0 },
          { time: '2019-04-23', value: 23322991.0 },
          { time: '2019-04-24', value: 17540609.0 },
          { time: '2019-04-25', value: 18543206.0 },
          { time: '2019-04-26', value: 18649102.0 },
          { time: '2019-04-29', value: 22204716.0 },
          { time: '2019-04-30', value: 46534923.0 },
          { time: '2019-05-01', value: 64827328.0 },
          { time: '2019-05-02', value: 31996324.0 },
          { time: '2019-05-03', value: 20892378.0 },
          { time: '2019-05-06', value: 32443113.0 },
          { time: '2019-05-07', value: 38763698.0 },
          { time: '2019-05-08', value: 26339504.0 },
          { time: '2019-05-09', value: 34908607.0 },
          { time: '2019-05-10', value: 41208712.0 },
          { time: '2019-05-13', value: 57430623.0 },
          { time: '2019-05-14', value: 36529677.0 },
          { time: '2019-05-15', value: 26544718.0 },
          { time: '2019-05-16', value: 33031364.0 },
          { time: '2019-05-17', value: 32879090.0 },
          { time: '2019-05-20', value: 38690198.0 },
          { time: '2019-05-21', value: 28364848.0 },
          { time: '2019-05-22', value: 29748556.0 },
          { time: '2019-05-23', value: 36217464.0 },
          { time: '2019-05-24', value: 23714686.0 },
          { time: '2019-05-28', value: 9264013.0 }
        ])
      }

      var toolTip = document.createElement('div')
      toolTip.setAttribute('id', 'tooltip-id' + type)
      toolTip.className = darkMode ? 'three-line-legend-dark' : 'three-line-legend'
      ref.current.appendChild(toolTip)
      toolTip.style.display = 'block'
      toolTip.style.fontWeight = '500'
      toolTip.style.left = -4 + 'px'
      toolTip.style.top = '-' + 8 + 'px'
      toolTip.style.backgroundColor = 'transparent'

      // format numbers
      let percentChange = baseChange?.toFixed(2)
      let formattedPercentChange = (percentChange > 0 ? '+' : '') + percentChange + '%'
      let color = percentChange >= 0 ? 'green' : 'red'

      // get the title of the chart
      function setLastBarText() {
        toolTip.innerHTML =
          `<div style="font-size: 16px; margin: 4px 0px; color: ${textColor};">${title} ${
            type === CHART_TYPES.BAR && !useWeekly ? '(24hr)' : ''
          }</div>` +
          `<div style="font-size: 22px; margin: 4px 0px; color:${textColor}" >` +
          formattedNum(base ?? 0, true) +
          `<span style="margin-left: 10px; font-size: 16px; color: ${color};">${formattedPercentChange}</span>` +
          '</div>'
      }
      // setLastBarText()

      // update the title when hovering on the chart
      // chart.subscribeCrosshairMove(function(param) {
      //   if (
      //     param === undefined ||
      //     param.time === undefined ||
      //     param.point.x < 0 ||
      //     param.point.x > width ||
      //     param.point.y < 0 ||
      //     param.point.y > HEIGHT
      //   ) {
      //     setLastBarText()
      //   } else {
      //     let dateStr = useWeekly
      //       ? dayjs(param.time.year + '-' + param.time.month + '-' + param.time.day)
      //           .startOf('week')
      //           .format('MMMM D, YYYY') +
      //         '-' +
      //         dayjs(param.time.year + '-' + param.time.month + '-' + param.time.day)
      //           .endOf('week')
      //           .format('MMMM D, YYYY')
      //       : dayjs(param.time.year + '-' + param.time.month + '-' + param.time.day).format('MMMM D, YYYY')
      //     var price = param.seriesPrices.get(series)

      //     toolTip.innerHTML =
      //       `<div style="font-size: 16px; margin: 4px 0px; color: ${textColor};">${title}</div>` +
      //       `<div style="font-size: 22px; margin: 4px 0px; color: ${textColor}">` +
      //       formattedNum(price, true) +
      //       '</div>' +
      //       '<div>' +
      //       dateStr +
      //       '</div>'
      //   }
      // })

      chart.timeScale().fitContent()

      setChartCreated(chart)
    }
  }, [
    base,
    baseChange,
    chartCreated,
    darkMode,
    data,
    formattedData,
    textColor,
    title,
    topScale,
    type,
    useWeekly,
    width
  ])

  // responsiveness
  useEffect(() => {
    if (width) {
      chartCreated && chartCreated.resize(width, HEIGHT)
      chartCreated && chartCreated.timeScale().scrollToPosition(0)
    }
  }, [chartCreated, width])

  return (
    <Wrapper>
      <div ref={ref} id={'test-id' + type} />
      <IconWrapper>
        <Play
          onClick={() => {
            chartCreated && chartCreated.timeScale().fitContent()
          }}
        />
      </IconWrapper>
    </Wrapper>
  )
}

export default TradingViewChart
