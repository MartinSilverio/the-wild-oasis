import Button from '../../ui/Button';
import { useCheckOut } from './useCheckOut';

function CheckoutButton({ bookingId }: { bookingId: number }) {
    const { checkOut, isCheckingOut } = useCheckOut();

    return (
        <Button
            $variation="primary"
            size="small"
            onClick={() => checkOut(bookingId)}
            disabled={isCheckingOut}
        >
            Check out
        </Button>
    );
}

export default CheckoutButton;
