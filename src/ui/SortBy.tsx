import { ChangeEvent } from 'react';
import { LabelValue } from '../utils/general.types';
import Select from './Select';
import { useSearchParams } from 'react-router-dom';

function SortBy({ options }: { options: LabelValue[] }) {
    const [searchParams, setSearchParams] = useSearchParams();
    const currentSort = searchParams.get('sortBy') || '';

    function handleChange(e: ChangeEvent<HTMLSelectElement>) {
        searchParams.set('sortBy', e.target.value);
        setSearchParams(searchParams);
    }

    return (
        <Select
            options={options}
            onChange={handleChange}
            value={currentSort}
            type="white"
        />
    );
}

export default SortBy;
