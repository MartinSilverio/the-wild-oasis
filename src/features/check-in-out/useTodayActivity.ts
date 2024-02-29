import { useQuery } from '@tanstack/react-query';
import { getStaysTodayActivity } from '../../services/apiBookings';

export function useTodayActivity() {
    const { data: todayActivities, isPending } = useQuery({
        queryKey: ['today-activity'],
        queryFn: getStaysTodayActivity,
    });

    return { todayActivities, isPending };
}
