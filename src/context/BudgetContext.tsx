import { useReducer, createContext, Dispatch, ReactNode } from "react"
import { BudgetActions, BudgetReducer, BudgetState, initialState } from "../reducers/budger-reducers"

type BudgetContextProps = {
    state: BudgetState
    dispatch:Dispatch<BudgetActions>
}

type BudgetProviderProps = {
    children: ReactNode
}
export const BudgetContext = createContext<BudgetContextProps>(null!)

export const BudgetProvider = ({children} : BudgetProviderProps) => {

    const [state, dispatch] = useReducer(BudgetReducer, initialState)

    return( 
        <BudgetContext.Provider
            value={{
                state,
                dispatch
            }}
        >
            {children}
        </BudgetContext.Provider>
    )
}