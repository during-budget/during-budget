class Transaction {
    private _id: string;
    private _budgetId: string;
    private _linkId: string | undefined;
    private _isCurrent: boolean;
    private _isExpense: boolean;
    private _icon: string;
    private _titles: string[];
    private _date: Date;
    private _amount: number;
    private _categoryId: string;
    private _tags: string[];
    private _memo: string;
    private _overAmount: number;

    constructor(transaction: {
        id: string;
        budgetId: string;
        linkId?: string;
        isCurrent: boolean;
        isExpense: boolean;
        titles: string[];
        date: Date;
        amount: number;
        categoryId: string;
        tags?: string[];
        icon?: string;
        memo?: string;
        overAmount?: number;
    }) {
        this._id = transaction.id;
        this._budgetId = transaction.budgetId;
        this._linkId = transaction.linkId;
        this._isCurrent = transaction.isCurrent;
        this._isExpense = transaction.isExpense;
        this._icon = transaction.icon || '';
        this._titles = transaction.titles;
        this._date = transaction.date;
        this._amount = transaction.amount;
        this._categoryId = transaction.categoryId;
        this._tags = transaction.tags || [];
        this._memo = transaction.memo || '';
        this._overAmount = transaction.overAmount || 0;
    }

    get id() {
        return this._id;
    }

    get budgetId() {
        return this._budgetId;
    }

    get linkId() {
        return this._linkId;
    }

    get isCurrent() {
        return this._isCurrent;
    }

    get isExpense() {
        return this._isExpense;
    }

    get icon() {
        return this._icon;
    }

    get titles() {
        return this._titles;
    }

    get date() {
        return this._date;
    }

    get amount() {
        return this._amount;
    }

    get categoryId() {
        return this._categoryId;
    }

    get tags() {
        return this._tags;
    }

    get memo() {
        return this._memo;
    }

    get overAmount() {
        return this._overAmount;
    }

    set linkId(id: string | undefined) {
        this._linkId = id;
    }

    set overAmount(amount: number) {
        this._overAmount = amount;
    }

    static getTransactionFromData = (item: {
        _id: string;
        budgetId: string;
        linkId?: string;
        isCurrent: boolean;
        isExpense: boolean;
        title: string[];
        date: string;
        amount: number;
        category: any;
        tags?: string[];
        icon?: string;
        memo?: string;
        overAmount?: number;
    }) => {
        return new Transaction({
            id: item._id,
            budgetId: item.budgetId,
            linkId: item.linkId,
            isCurrent: item.isCurrent,
            isExpense: item.isExpense,
            titles: item.title,
            date: new Date(item.date),
            amount: item.amount,
            categoryId: item.category.categoryId,
            icon: item.icon,
            tags: item.tags,
            memo: item.memo,
            overAmount: item.overAmount,
        });
    };

    static getTransacitonsFilteredByDate = (data: {
        transactions: Transaction[];
        isCurrent: boolean;
    }) => {
        const filteredTransactions = data.transactions.filter(
            (item: Transaction) =>
                data.isCurrent ? item.isCurrent : !item.isCurrent
        );

        const dateTransactions: {
            date: string;
            transactions: Transaction[];
        }[] = [];

        filteredTransactions.forEach((transaction: Transaction) => {
            const date = transaction.date.toLocaleDateString(
                navigator.language
            );

            const target = dateTransactions.find((item) => item.date === date);

            if (target) {
                target.transactions.push(transaction);
            } else {
                dateTransactions.push({ date, transactions: [transaction] });
            }
        });

        return dateTransactions;
    };
}

export default Transaction;
