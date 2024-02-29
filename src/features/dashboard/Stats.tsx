import {
    HiOutlineBanknotes,
    HiOutlineBriefcase,
    HiOutlineCalendarDays,
    HiOutlineChartBar,
} from 'react-icons/hi2';
import {
    BookingsAfterDateType,
    StaysAfterDateType,
} from '../../services/apiBookings';
import Stat from './Stat';
import { formatCurrency } from '../../utils/helpers';

function Stats({
    bookings,
    confirmedStays,
    numDays,
    cabinCount,
}: {
    bookings: BookingsAfterDateType;
    confirmedStays: StaysAfterDateType;
    numDays: number;
    cabinCount: number;
}) {
    //1.
    const numBookings = bookings.length;

    //2.
    const sales = bookings.reduce((acc, curr) => {
        return acc + curr.totalPrice;
    }, 0);

    //3.
    const checkIns = confirmedStays.length;

    //4.
    // num days * num cabins
    const occupation =
        confirmedStays.reduce((acc, stay) => stay.numNights + acc, 0) /
        (numDays * cabinCount);

    return (
        <>
            <Stat
                title="Bookings"
                color="blue"
                icon={<HiOutlineBriefcase />}
                value={numBookings}
            />
            <Stat
                title="Sales"
                color="green"
                icon={<HiOutlineBanknotes />}
                value={formatCurrency(sales)}
            />
            <Stat
                title="Check ins"
                color="indigo"
                icon={<HiOutlineCalendarDays />}
                value={checkIns}
            />
            <Stat
                title="Occupancy rate"
                color="yellow"
                icon={<HiOutlineChartBar />}
                value={Math.round(occupation * 100) + '%'}
            />
        </>
    );
}

export default Stats;
