import { ScrollRestoration, useNavigate } from 'react-router-dom';
import Amount from '../../models/Amount';
import Category from '../../models/Category';
import classes from './TransactionDetail.module.css';
import TransactionList from '../../components/Transaction/TransactionList';
import Transaction from '../../models/Transaction';

function TransactionDetail() {
    const navigation = useNavigate();
    const data = {
        title: ['제목 1', '부제목 1'],
        amount: new Amount(100000, 0, 0),
        icon: '',
        isCurrent: true,
        isExpense: true,
        category: new Category({
            id: 'c1',
            title: '기본',
            budget: 100000,
            icon: '💰',
        }),
        date: new Date(),
        memo: '',
        tags: [''],
        transactions: [
            {
                date: new Date(2022, 11, 7),
                items: [
                    new Transaction({
                        id: 'dd',
                        isCurrent: true,
                        isExpense: true,
                        title: ['제목 1', '부제목 1'],
                        date: new Date(2022, 11, 7),
                        amount: 100000,
                        category: new Category({
                            id: 'c1',
                            title: '기본',
                            budget: 100000,
                            icon: '💰',
                        }),
                        tags: ['태그명'],
                    }),
                ],
            },
        ],
    };

    return (
        <>
            <div className={classes.container}>
                <ScrollRestoration />
                <div className={`page ${classes.detail}`}>
                    <button
                        className={classes.back}
                        onClick={() => {
                            navigation(-1);
                        }}
                    >
                        <i className="fa-solid fa-chevron-left"></i>
                    </button>
                    <div className={classes.header}>
                        <span className={classes.icon}>
                            {data.icon
                                ? data.icon
                                : data.category
                                ? data.category.icon
                                : ''}
                        </span>
                        <h2>{data.title.join(' | ')}</h2>
                    </div>
                    <p className={classes.amount}>
                        {data.amount.getCurrentStr()}
                    </p>
                    <div className={classes.tabs}>
                        <ul className="nav-tab">
                            <li>
                                <input
                                    id="transaction-detail-scheduled"
                                    type="radio"
                                    name="transaction-detail-isCurrent"
                                    defaultChecked={true}
                                ></input>
                                <label htmlFor="transaction-detail-scheduled">
                                    예정 내역
                                </label>
                            </li>
                            <li>
                                <input
                                    id="transaction-detail-current"
                                    type="radio"
                                    name="transaction-detail-isCurrent"
                                ></input>
                                <label htmlFor="transaction-detail-current">
                                    거래 내역
                                </label>
                            </li>
                        </ul>
                        <span className={classes.divider}>|</span>
                        <ul className="nav-tab">
                            <li>
                                <input
                                    id="transaction-detail-expense"
                                    type="radio"
                                    name="transaction-detail-isExpense"
                                    defaultChecked={true}
                                ></input>
                                <label htmlFor="transaction-detail-expense">
                                    지출
                                </label>
                            </li>
                            <li>
                                <input
                                    id="transaction-detail-income"
                                    type="radio"
                                    name="transaction-detail-isExpense"
                                ></input>
                                <label htmlFor="transaction-detail-income">
                                    수입
                                </label>
                            </li>
                        </ul>
                    </div>
                    <form className={classes.form}>
                        <div className="input-field">
                            <label>분류</label>
                            <input type="text"></input>
                        </div>
                        <div className="input-field">
                            <label>날짜</label>
                            <input type="date"></input>
                        </div>
                        <div className="input-field">
                            <label>메모</label>
                            <textarea></textarea>
                        </div>
                        <div className="input-field">
                            <label>태그</label>
                            <input></input>
                        </div>
                    </form>
                </div>
                <hr />
                <div>
                    <ul className={`nav-tab ${classes.nav}`}>
                        <li>
                            <input
                                id="transaction-detail-title1"
                                type="radio"
                                name="transaction-detail-list-tab"
                                defaultChecked={true}
                            ></input>
                            <label htmlFor="transaction-detail-titl1">
                                제목1
                            </label>
                        </li>
                    </ul>
                    <TransactionList transactions={data.transactions} />
                </div>
            </div>
        </>
    );
}

export default TransactionDetail;
