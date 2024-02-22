import { useSearchParams } from 'react-router-dom';

import Spinner from '../../ui/Spinner';
import CabinRow from './CabinRow';
import { useCabins } from './useCabins';
import Table from '../../ui/Table';
import { CabinType } from '../../services/apiCabins';
import Menus from '../../ui/Menus';
import { CabinSortTypes } from './CabinTableOperations';
import Empty from '../../ui/Empty';

function CabinTable() {
    const { cabins, isPending } = useCabins();
    const [searchParams] = useSearchParams();

    if (isPending) return <Spinner />;

    let filteredCabins: CabinType[] = [];

    if (!cabins || !cabins.length) return <Empty resource="cabins" />;

    //Filter
    const filterValue = searchParams.get('discount') ?? 'all';

    if (filterValue === 'all' && cabins) filteredCabins = cabins;
    if (filterValue === 'no-discount' && cabins)
        filteredCabins = cabins?.filter((cabin) => cabin.discount === 0);
    if (filterValue === 'with-discount' && cabins)
        filteredCabins = cabins?.filter((cabin) => cabin.discount > 0);

    //Sort
    const sortBy = searchParams.get('sortBy') ?? 'startDate-asc';
    const [field, direction]: [CabinSortTypes, 'asc' | 'desc'] = sortBy.split(
        '-'
    ) as [CabinSortTypes, 'asc' | 'desc'];

    const modifier = direction === 'asc' ? 1 : -1;
    const sortedCabins = filteredCabins.sort((a, b) => {
        return modifier * (+a[field] - +b[field]);
    });

    return (
        <Menus>
            <Table columns="0.6fr 1.8fr 2.2fr 1fr 1fr 1fr">
                <Table.Header>
                    <div></div>
                    <div>Cabin</div>
                    <div>Capacity</div>
                    <div>Price</div>
                    <div>Discount</div>
                    <div></div>
                </Table.Header>
                <Table.Body<CabinType>
                    data={sortedCabins}
                    render={(cabin) => (
                        <CabinRow cabin={cabin} key={cabin.id} />
                    )}
                />
            </Table>
        </Menus>
    );
}

export default CabinTable;
