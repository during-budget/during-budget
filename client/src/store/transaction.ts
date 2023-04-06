import { createSlice } from '@reduxjs/toolkit';
import Transaction from '../models/Transaction';

const initialState: { data: Transaction[]; form: any; detail: any } = {
    data: [],
    form: {
        mode: {
            isExpand: false,
            isEdit: false,
            isDone: false,
        },
        default: {
            id: '',
            linkId: '',
            isCurrent: true,
            isExpense: true,
            amount: '',
            overAmount: 0,
            categoryId: '',
            date: null,
            icon: '',
            titles: [''],
            tags: [],
            memo: '',
        },
    },
    detail: {
        isOpen: false,
        transaction: null,
        category: '',
    },
};

const transactionSlice = createSlice({
    initialState,
    name: 'transaction',
    reducers: {
        clearForm(state) {
            state.form = initialState.form;
        },
        setForm(state, action) {
            const setData = action.payload;
            const form = state.form;
            form.mode = { ...form.mode, ...setData.mode };
            form.default = { ...form.default, ...setData.default };
        },
        setTransaction(state, action) {
            const transactions = action.payload;
            transactions.sort((prev: any, next: any) =>
                new Date(prev.createdAt) < new Date(next.createdAt) ? 1 : -1
            );
            state.data = transactions.map((item: any) =>
                Transaction.getTransactionFromData(item)
            );

            state.data.sort((prev, next) => +next.date - +prev.date); // sort by date (desc)
        },
        setBudgetTransactions(state, action) {
            const { budgetId, transactions: transactionData } = action.payload;
            const otherTransactions = state.data.filter(
                (item) => item.budgetId !== budgetId
            );
            const transactions = transactionData.map((item: any) => {
                if (item instanceof Transaction) {
                    return item;
                } else {
                    return Transaction.getTransactionFromData(item);
                }
            });
            state.data = [...transactions, ...otherTransactions];
        },
        addTransaction(state, action) {
            const data = state.data;
            const transaction = action.payload;

            const idx = data.findIndex((item) => item.id === transaction.id);

            if (idx === -1) {
                data.unshift(transaction);
            } else {
                data[idx] = transaction;
            }

            data.sort((prev, next) => +next.date - +prev.date); // sort by date (desc)
        },
        removeTransaction(state, action) {
            const data = state.data;
            const id = action.payload;
            const idx = data.findIndex((item: any) => item.id === id);
            data.splice(idx, 1);
        },
        addLink(state, action) {
            const { targetId, linkId } = action.payload;
            const idx = state.data.findIndex((item) => item.id === targetId);

            const target = state.data[idx];

            if (target) {
                target.linkId = linkId;
                state.data[idx] = target;
            }
        },
        removeLink(state, action) {
            const linkId = action.payload;
            const idx = state.data.findIndex((item: any) => item.id === linkId);

            const target = state.data[idx];

            if (target) {
                target.linkId = undefined;
                state.data[idx] = target;
            }
        },
        updateOverAmount(state, action) {
            const { id, amount } = action.payload;
            const idx = state.data.findIndex((item: any) => item.id === id);

            const target = state.data[idx];

            if (target) {
                target.overAmount += amount;
                state.data[idx] = target;
            }
        },
        openDetail(state, action) {
            const { transaction, category } = action.payload;
            state.detail = { isOpen: true, transaction, category };
        },
        openLink(state, action) {
            const { id, category } = action.payload;
            const transaction = state.data.find((item) => item.id === id);
            state.detail = { isOpen: true, transaction, category };
        },
        closeDetail(state) {
            state.detail.isOpen = false;
        },
    },
});

export const transactionActions = transactionSlice.actions;
export default transactionSlice.reducer;
