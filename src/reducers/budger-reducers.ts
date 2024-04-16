export type BudgetActions = 
    {type: 'define-budget', payload: {budget: number}}

export type BudgetState = {
    budget: number
}

export const initialState : BudgetState = {
    budget: 0
}

export const BudgetReducer = (
    state: BudgetState = initialState,
    actions: BudgetActions
) => {

    if(actions.type === 'define-budget') {
        return {
            ...state,
            budget: actions.payload.budget
        }
    }

    return state
}