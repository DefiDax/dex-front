import React from 'react'
import styled from 'styled-components'

const Silder = styled.div`
    box-sizing: border-box;
    color: rgba(0,0,0,.85);
    font-size: 14px;
    font-variant: tabular-nums;
    line-height: 1.5715;
    list-style: none;
    font-feature-settings: "tnum";
    position: relative;
    height: 12px;
    margin: 10px 6px;
    padding: 4px 0;
    cursor: pointer;
    touch-action: none;
`
const SliderRail =  styled.div`
    width: 100%;
    background-color: #464659;
    position: absolute;
    height: 4px;
    border-radius: 2px;
    transition: background-color .3s;
`
const SliderTrack =  styled.div`
    position: absolute;
    height: 4px;
    border-radius: 2px;
    transition: background-color .3s;
`
interface InputSliderProps {
  value: number
  onChange: (value: number) => void
  step?: number
  min?: number
  max?: number
  size?: number
  style?: React.CSSProperties;
}

export default function MarkSlider({ value, onChange, min = 0, step = 1, max = 100, size = 28, style={} }: InputSliderProps) {
//   const changeCallback = useCallback(
//     e => {
//       onChange(parseInt(e.target.value))
//     },
//     [onChange]
//   )

  return (
        <Silder style={style}>
            <SliderRail/>
            <SliderTrack style={{left: "0%", right: "auto", width: "60%"}}/>
            <div className="ant-slider-step">
                <span className="ant-slider-dot ant-slider-dot-active" style={{left: "0%;"}}></span>
                <span className="ant-slider-dot ant-slider-dot-active" style={{left: "26%"}}></span>
                <span className="ant-slider-dot ant-slider-dot-active" style={{left: "37%"}}></span>
                <span className="ant-slider-dot" style={{left: "100%"}}></span>
            </div>
            <div className="ant-slider-handle" role="slider" style={{left: "60%", right: "auto", transform: "translateX(-50%)"}}></div>
            <div>

            </div>
        </Silder>
  )
}
