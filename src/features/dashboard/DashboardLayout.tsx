import styled from 'styled-components';
import { useRecentBookings } from './useRecentBookings';
import Spinner from '../../ui/Spinner';
import { useRecentStays } from './useRecentStays';
import Stats from './Stats';
import { assertIsDefined } from '../../utils/helpers';
import { useCabins } from '../cabins/useCabins';
import SalesChart from './SalesChart';
import DurationChart from './DurationChart';
import TodayActivity from '../check-in-out/TodayActivity';

const StyledDashboardLayout = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-template-rows: auto 34rem auto;
    gap: 2.4rem;
`;

function DashboardLayout() {
    const {
        bookings,
        isPending: isGettingBookings,
        numDays,
    } = useRecentBookings();
    const { confirmedStays, isPending: isGettingStays } = useRecentStays();
    const { cabins, isPending: isGettingCabins } = useCabins();

    if (isGettingStays || isGettingBookings || isGettingCabins)
        return <Spinner />;

    assertIsDefined<typeof bookings>(bookings);
    assertIsDefined<typeof confirmedStays>(confirmedStays);
    assertIsDefined<typeof cabins>(cabins);

    return (
        <StyledDashboardLayout>
            <Stats
                bookings={bookings}
                confirmedStays={confirmedStays}
                numDays={numDays}
                cabinCount={cabins.length}
            />
            <TodayActivity />
            <DurationChart confirmedStays={confirmedStays} />
            <SalesChart bookings={bookings} numDays={numDays} />
        </StyledDashboardLayout>
    );
}

export default DashboardLayout;
