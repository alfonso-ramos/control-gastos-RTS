import { useReducer, useMemo, createContext, Dispatch, ReactNode } from "react"
import { BudgetActions, BudgetReducer, BudgetState, initialState } from "../reducers/budger-reducers"

type BudgetContextProps = {
    state: BudgetState
    dispatch:Dispatch<BudgetActions>,
    totalExpenses: number,
    remainingBudget: number
}

type BudgetProviderProps = {
    children: ReactNode
}
export const BudgetContext = createContext<BudgetContextProps>(null!)

export const BudgetProvider = ({children} : BudgetProviderProps) => {

    const [state, dispatch] = useReducer(BudgetReducer, initialState)

    const totalExpenses = useMemo(() => state.expenses.reduce((total, expense) => expense.amount + total, 0),[state.expenses])

    const remainingBudget = state.budget - totalExpenses

    return( 
        <BudgetContext.Provider
            value={{
                state,
                dispatch,
                totalExpenses,
                remainingBudget
            }}
        >
            {children}
        </BudgetContext.Provider>
    )
}