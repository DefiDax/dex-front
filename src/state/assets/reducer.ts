import { createReducer } from '@reduxjs/toolkit'

type Assets = Array<{ id: string; name: string; value: number | string }>

export interface AssetsState {
    assets: Assets
}

const initalsState: AssetsState = {
    assets: []
}

export default createReducer(initalsState, () => {
   
});
