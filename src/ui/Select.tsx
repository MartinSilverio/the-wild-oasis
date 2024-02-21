import styled from 'styled-components';
import { LabelValue } from '../utils/general.types';
import { ChangeEvent } from 'react';

const StyledSelect = styled.select<{ type: string }>`
    font-size: 1.4rem;
    padding: 0.8rem 1.2rem;
    border: 1px solid
        ${(props) =>
            props.type === 'white'
                ? 'var(--color-grey-100)'
                : 'var(--color-grey-300)'};
    border-radius: var(--border-radius-sm);
    background-color: var(--color-grey-0);
    font-weight: 500;
    box-shadow: var(--shadow-sm);
`;

function Select({
    options,
    value,
    type,
    onChange,
}: {
    options: LabelValue[];
    value: string;
    type: string;
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}) {
    return (
        <StyledSelect value={value} type={type} onChange={onChange}>
            {options.map((option) => (
                <option value={option.value} key={option.value}>
                    {option.label}
                </option>
            ))}
        </StyledSelect>
    );
}

export default Select;
