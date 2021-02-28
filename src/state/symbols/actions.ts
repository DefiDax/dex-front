import { createAction, ActionCreatorWithPayload } from "@reduxjs/toolkit";

export const setSymbols = createAction<{ symbols: Array<any> }>('symbols/setSymbols')
export const fetchSymbols: Readonly<{
    pending: ActionCreatorWithPayload<{symbols: { [key: string]: Array<any> }}>
    fulfilled: ActionCreatorWithPayload<{ symbols: { [key: string]: Array<any> } }>
    rejected: ActionCreatorWithPayload<{ errorMessage: string; }>
}> = {
    pending: createAction('symbols/fetchSymbols/pending'),
    fulfilled: createAction('symbols/fetchSymbols/fulfilled'),
    rejected: createAction('symbols/fetchSymbols/rejected')
}
