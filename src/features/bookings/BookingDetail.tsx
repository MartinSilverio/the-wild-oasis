import styled from 'styled-components';

import BookingDataBox from './BookingDataBox';
import Row from '../../ui/Row';
import Heading from '../../ui/Heading';
import Tag from '../../ui/Tag';
import ButtonGroup from '../../ui/ButtonGroup';
import Button from '../../ui/Button';
import ButtonText from '../../ui/ButtonText';

import { useMoveBack } from '../../hooks/useMoveBack';
import { useBooking } from './useBooking';
import Spinner from '../../ui/Spinner';
import Empty from '../../ui/Empty';
import { useNavigate } from 'react-router-dom';
import { useCheckOut } from '../check-in-out/useCheckOut';
import Modal from '../../ui/Modal';
import ConfirmDelete from '../../ui/ConfirmDelete';
import { useDeleteBooking } from './useDeleteBooking';

const HeadingGroup = styled.div`
    display: flex;
    gap: 2.4rem;
    align-items: center;
`;

function BookingDetail() {
    const { booking, error, isPending } = useBooking();
    const { checkOut, isCheckingOut } = useCheckOut();
    const { deleteBooking, isDeletingBooking } = useDeleteBooking();
    const navigate = useNavigate();
    const moveBack = useMoveBack();

    if (isPending) return <Spinner />;
    if (error || booking === undefined) return <Empty resource="booking" />;

    const statusToTagName = {
        unconfirmed: 'blue',
        'checked-in': 'green',
        'checked-out': 'silver',
    };

    const { status, id: bookingId } = booking;

    return (
        <>
            <Row type="horizontal">
                <HeadingGroup>
                    <Heading as="h1">Booking #{bookingId}</Heading>
                    <Tag type={statusToTagName[status]}>
                        {status.replace('-', ' ')}
                    </Tag>
                </HeadingGroup>
                <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
            </Row>

            <BookingDataBox booking={booking} />

            <ButtonGroup>
                <Modal>
                    <Modal.Open opens="delete">
                        <Button $variation="danger">Delete booking</Button>
                    </Modal.Open>

                    <Modal.Window name="delete">
                        <ConfirmDelete
                            resourceName="booking"
                            disabled={isDeletingBooking}
                            onConfirm={() => {
                                deleteBooking(bookingId, {
                                    onSettled: () => {
                                        navigate(-1);
                                    },
                                });
                            }}
                        />
                    </Modal.Window>
                </Modal>

                {status === 'unconfirmed' && (
                    <Button onClick={() => navigate(`/checkin/${bookingId}`)}>
                        Check in
                    </Button>
                )}
                {status === 'checked-in' && (
                    <Button
                        onClick={() => checkOut(bookingId)}
                        disabled={isCheckingOut}
                    >
                        Check out
                    </Button>
                )}

                <Button $variation="secondary" onClick={moveBack}>
                    Back
                </Button>
            </ButtonGroup>
        </>
    );
}

export default BookingDetail;
