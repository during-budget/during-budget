import classes from './AmountBars.module.css';
import AmountBar from './AmountBar';
import Amount from '../../models/Amount';

const getLabel = (label: string, width: string) => (
    <span className={`${classes.label} ${getCenteringClass(width)}`}>
        {label}
    </span>
);

const getCenteringClass = (width: string) => {
    const w = +width.split('%')[0];
    if (w >= 8) {
        return '';
    } else if (w >= 7) {
        return classes.small;
    } else {
        return classes.tiny;
    }
};

function AmountBars(props: {
    amountData: {
        amount: Amount;
        label: string;
        isOver?: boolean;
        onClick?: (i: number) => void;
    }[];
    isTop?: boolean;
    isExpense?: boolean;
    className?: string;
}) {
    const plans = props.amountData.map((data) => data.amount.planned);
    const planTotal = plans.reduce((curr, next) => curr + next, 0);
    const widths = plans.map((plan) => (plan / planTotal) * 90 + '%');

    return (
        <ul className={`${classes.container} ${props.className}`}>
            {props.amountData.map((data, i) => {
                const width = widths[i];
                return (
                    <li
                        key={i}
                        className={classes.bar}
                        onClick={() => {
                            data.onClick && data.onClick(i);
                        }}
                        style={{ width }}
                    >
                        {/* over mark */}
                        {data.isOver && (
                            <i
                                className={`fa-solid fa-circle-exclamation ${
                                    classes.mark
                                } ${getCenteringClass(widths[i])}`}
                            ></i>
                        )}

                        {/* bar */}
                        {props.isTop && getLabel(data.label, width)}
                        <AmountBar amount={data.amount} />
                        {!props.isTop && getLabel(data.label, width)}
                    </li>
                );
            })}
        </ul>
    );
}

export default AmountBars;
