import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { Value, DraftExpense } from '../types/index';
import { categories } from '../data/categories'
import DatePicker from 'react-date-picker';
import 'react-calendar/dist/Calendar.css'
import 'react-date-picker/dist/DatePicker.css'
import ErrorMessage from './ErrorMessage';
import { useBudget } from '../hooks/useBudget';

export default function ExpenseForm() {

    const [expense, setExpense] = useState<DraftExpense>({
        amount: 0,
        expenseName: '',
        category: '',
        date: new Date()
    })

    const [error, setError] = useState('')
    const [previousAmout, setPreviousAmout] = useState(0)

    const {dispatch, state, remainingBudget} = useBudget()

    useEffect(() => {
        if(state.editingId){
            const editingExpense = state.expenses.filter(currentExpense => currentExpense.id === state.editingId)[0]
            setExpense(editingExpense)
            setPreviousAmout(editingExpense.amount)
        }

    },[state.editingId])

    const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
        const {name, value} = e.target
        const isAmountField = ['amount'].includes(name)
        setExpense({
            ...expense,
            [name]: isAmountField ? +value : value
        })
        
    }

    const handleChangeDate = (value : Value) => {
        setExpense({
            ...expense,
            date: value
        })
    }

    const handleSubmit = (e : FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        // Validacion
        if(Object.values(expense).includes('')) {
            setError('Todos los campos son obligatorios')
            return
        }
        //Validar de no sobregirar el limite
        if((expense.amount - previousAmout )> remainingBudget) {
            setError('El gasto se pasa del presupuesto')
            return
        }
        // Agregando o  actualizando el gasto
        if(state.editingId){
            dispatch({type: 'update-expense', payload: {expense: {id: state.editingId, ...expense}}})
        } else {
            dispatch({type: 'add-expense', payload: {expense}})
        }

        // reinicio
        setExpense({
            amount: 0,
            expenseName: '',
            category: '',
            date: new Date()
        })
        setPreviousAmout(0)
    }
    return (
        <form className='space-y-5' onSubmit={handleSubmit}>
            <legend 
                className='uppercase text-center text-2xl font-black border-b-4 border-blue-500 py-2'
            >{state.editingId ? 'Guardar cambios' : 'Nuevo Gasto'}</legend>
            {error && <ErrorMessage>{error}</ErrorMessage>}

            <div className='flex flex-col gap-2'>
                <label 
                    htmlFor="expenseName"
                    className='text-xl'
                >Nombre Gasto:</label>
                <input 
                    id='expenseName' 
                    type="text"
                    className='bg-slate-200 p-2'
                    placeholder='Añade el nombre del gasto'
                    name='expenseName' 
                    onChange={handleChange}
                    value={expense.expenseName}
                />
            </div>

            <div className='flex flex-col gap-2'>
                <label 
                    htmlFor="amount"
                    className='text-xl'
                >Cantidad:</label>
                <input 
                    id='amount' 
                    type="text"
                    className='bg-slate-200 p-2'
                    placeholder='Añade la cantidad del gasto'
                    name='amount' 
                    onChange={handleChange}
                    value={expense.amount}
                />
            </div>

            <div className='flex flex-col gap-2'>
                <label 
                    htmlFor="category"
                    className='text-xl'
                >Categoria:</label>
                <select 
                    id='category' 
                    className='bg-slate-200 p-2'
                    name='category' 
                    onChange={handleChange}
                    value={expense.category}
                >
                    <option value="">--- Seleccione ---</option>
                    {
                        categories.map(category => (
                            <option 
                                key={category.id}
                                value={category.id}
                            >{category.name}
                            </option>
                        ))
                    }
                </select>
            </div>

            <div className='flex flex-col gap-2'>
                <label 
                    htmlFor="amount"
                    className='text-xl'
                >Fecha Gasto:</label>
                <DatePicker 
                    className="bg-slate-100 p-2 border-0"
                    value={expense.date}
                    onChange={handleChangeDate}
                />
            </div>

            <input 
                type="submit"
                className='bg-blue-600 cursor-pointer w-full p-2 text-white uppercase font-bold rounded-lg'
                value={state.editingId ? 'Guardar cambios' : 'Nuevo Gasto'}
            />
        </form>
    )
}
