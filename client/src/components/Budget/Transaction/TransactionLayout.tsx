import { useState } from 'react';
import Transaction from '../../../models/Transaction';
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';
import TransactionNav from './TransactionNav';

function TransactionLayout(props: {
    budgetId: string;
    transactions: Transaction[];
}) {
    const [isCurrent, setIsCurrent] = useState(false);

    return (
        <section>
            <TransactionNav
                id="layout"
                isCurrent={isCurrent}
                setIsCurrent={setIsCurrent}
                isLine={true}
            />
            <TransactionList
                transactions={props.transactions}
                isCurrent={isCurrent}
            />
            <TransactionForm budgetId={props.budgetId} />
        </section>
    );
}

export default TransactionLayout;
