import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import fetch from 'unfetch'
import { AppDispatch } from '../state'
import { fetchSymbols } from '../state/symbols/actions';


interface Response {
    error_code: number;
    error_message: string;
    data: { [key: string]: Array<any> }
}


const fetcher = (url:string) => fetch(url).then(r => r.json())

function getSymbols(): Promise<Response> {
    
    return fetcher('/v1/cryptocurrency')
}

export function useFetchSymbolsCallback(): () => Promise<any> {
    const dispatch = useDispatch<AppDispatch>()
    return useCallback(
        async () => {
            // dispatch(fetchSymbols.pending({}))
            return getSymbols().then(res => {
                dispatch(fetchSymbols.fulfilled({ symbols: res.data }))
                return res.data
            }).catch(error => {
                dispatch(fetchSymbols.rejected({ errorMessage: error.message }))
                throw error
            })
        },
        [dispatch]
    )
}
