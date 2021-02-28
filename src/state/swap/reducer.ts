import { createReducer } from '@reduxjs/toolkit'
import { Field, replaceSwapState, selectCurrency, setRecipient, switchCurrencies, typeInput } from './actions'

export interface SwapState {
  readonly independentField: Field
  readonly typedValue: string
  readonly anotherTypedValue: string
  readonly [Field.INPUT]: {
    readonly currencyId: string | undefined
  }
  readonly [Field.OUTPUT]: {
    readonly currencyId: string | undefined
  }
  // the typed recipient address or ENS name, or null if swap should go to sender
  readonly recipient: string | null
}

const initialState: SwapState = {
  independentField: Field.INPUT,
  typedValue: '', // 只允许一方输入，另一方是计算出来的
  anotherTypedValue: '',
  [Field.INPUT]: {
    currencyId: ''
  },
  [Field.OUTPUT]: {
    currencyId: ''
  },
  recipient: null
}

export default createReducer<SwapState>(initialState, builder =>
  builder
    .addCase(
      replaceSwapState,
      (state, { payload: { typedValue, recipient, field, inputCurrencyId, outputCurrencyId } }) => {
        return {
          [Field.INPUT]: {
            currencyId: inputCurrencyId
          },
          [Field.OUTPUT]: {
            currencyId: outputCurrencyId
          },
          independentField: field,
          typedValue: typedValue,
          anotherTypedValue: '',
          recipient
        }
      }
    )
    .addCase(selectCurrency, (state, { payload: { currencyId, field } }) => {
      // 这里选择的时候就确认了交易 ID
      const otherField = field === Field.INPUT ? Field.OUTPUT : Field.INPUT
      if (currencyId === state[otherField].currencyId) { // 如果新选择的和已选择的另一项相同，则交换顺序？？也就是记录历史状态，如果新选择和另一个相同了，则记录新选择的，并将相同的那一项替换成新选择的这项之前的数据
        // the case where we have to swap the order
        return {
          ...state,
          independentField: state.independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT, // 选择时决定
          [field]: { currencyId: currencyId },
          [otherField]: { currencyId: state[field].currencyId }
        }
      } else {
        // the normal case
        return {
          ...state,
          [field]: { currencyId: currencyId }
        }
      }
    })
    .addCase(switchCurrencies, state => {
      // 切换交易双方，只需要交换这几个字段即可
      return {
        ...state,
        independentField: state.independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT,
        [Field.INPUT]: { currencyId: state[Field.OUTPUT].currencyId },
        [Field.OUTPUT]: { currencyId: state[Field.INPUT].currencyId }
      }
    })
    .addCase(typeInput, (state, { payload: { field, typedValue } }) => {
      // 当前正在输入的是独立字段，另一个是依赖它的依赖字段
      if (field === Field.OUTPUT) {
        return {
          ...state,
          independentField: Field.INPUT,
          anotherTypedValue: typedValue,
        }
      } else {
        return {
          ...state,
          independentField: field, // 独立字段和依赖字段？决定了两者谁主谁副？
          typedValue,
        }
      }
    })
    .addCase(setRecipient, (state, { payload: { recipient } }) => {
      state.recipient = recipient
    })
)
