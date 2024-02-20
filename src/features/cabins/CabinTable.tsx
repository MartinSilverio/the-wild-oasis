import Spinner from '../../ui/Spinner';
import CabinRow from './CabinRow';
import { useCabins } from './useCabins';
import Table from '../../ui/Table';
import { CabinType } from '../../services/apiCabins';

function CabinTable() {
    const { cabins, isPending } = useCabins();

    // console.log(cabins);

    if (isPending) return <Spinner />;

    return (
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
                data={cabins}
                render={(cabin) => <CabinRow cabin={cabin} key={cabin.id} />}
            />
        </Table>
    );
}

export default CabinTable;
