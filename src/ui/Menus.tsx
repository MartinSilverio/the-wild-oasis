import {
    MouseEvent,
    ReactNode,
    createContext,
    useContext,
    useState,
} from 'react';
import { createPortal } from 'react-dom';
import { HiEllipsisVertical } from 'react-icons/hi2';
import styled from 'styled-components';
import { useOutsideClick } from '../hooks/useOutsideClick';

const Menu = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
`;

const StyledToggle = styled.button`
    background: none;
    border: none;
    padding: 0.4rem;
    border-radius: var(--border-radius-sm);
    transform: translateX(0.8rem);
    transition: all 0.2s;

    &:hover {
        background-color: var(--color-grey-100);
    }

    & svg {
        width: 2.4rem;
        height: 2.4rem;
        color: var(--color-grey-700);
    }
`;

const StyledList = styled.ul<{ position: { x: number; y: number } }>`
    position: fixed;

    background-color: var(--color-grey-0);
    box-shadow: var(--shadow-md);
    border-radius: var(--border-radius-md);

    right: ${(props) => props.position.x}px;
    top: ${(props) => props.position.y}px;
`;

const StyledButton = styled.button`
    width: 100%;
    text-align: left;
    background: none;
    border: none;
    padding: 1.2rem 2.4rem;
    font-size: 1.4rem;
    transition: all 0.2s;

    display: flex;
    align-items: center;
    gap: 1.6rem;

    &:hover {
        background-color: var(--color-grey-50);
    }

    & svg {
        width: 1.6rem;
        height: 1.6rem;
        color: var(--color-grey-400);
        transition: all 0.3s;
    }
`;

interface MenusPosition {
    x: number;
    y: number;
}

interface MenusType {
    openId: number;
    open: (n: number) => void;
    close: () => void;
    position: MenusPosition | null;
    setPosition: (p: MenusPosition) => void;
}

const MenusContext = createContext<MenusType | undefined>(undefined);

function useMenusContext() {
    const context = useContext(MenusContext);

    if (context === undefined) {
        throw new Error('useMenuContext must be used within Menus Context');
    }

    return context;
}

function Menus({ children }: { children: ReactNode }) {
    const [openId, setOpenId] = useState(-1);
    const [position, setPosition] = useState<MenusPosition | null>(null);

    const close = () => setOpenId(-1);
    const open = setOpenId;

    return (
        <MenusContext.Provider
            value={{
                openId,
                position,
                open,
                close,
                setPosition,
            }}
        >
            {children}
        </MenusContext.Provider>
    );
}

function Toggle({ id }: { id: number }) {
    const { open, close, openId, setPosition } = useMenusContext();

    function handleClick(e: MouseEvent<HTMLButtonElement>) {
        if (e.target instanceof Element) {
            const rect = e.target.closest('button')?.getBoundingClientRect();
            if (rect) {
                setPosition({
                    x: window.innerWidth - rect.width - rect.x,
                    y: rect.y + rect.height + 8,
                });
                openId === -1 || openId !== id ? open(id) : close();
            }
        }
    }

    return (
        <StyledToggle onClick={handleClick}>
            <HiEllipsisVertical />
        </StyledToggle>
    );
}

function List({ id, children }: { id: number; children: ReactNode }) {
    const { openId, position, close } = useMenusContext();
    const ref = useOutsideClick<HTMLUListElement>(close, true);

    if (openId !== id) return null;
    if (position === null) return null;

    return createPortal(
        <StyledList ref={ref} position={{ x: position.x, y: position.y }}>
            {children}
        </StyledList>,
        document.body
    );
}

function Button({
    children,
    icon,
    disabled = false,
    onClick,
}: {
    children: ReactNode;
    icon: ReactNode;
    disabled?: boolean;
    onClick?: () => void;
}) {
    const { close } = useMenusContext();

    function handleClick() {
        onClick?.();
        close();
    }

    return (
        <li>
            <StyledButton onClick={handleClick} disabled={disabled}>
                {icon}
                <span>{children}</span>
            </StyledButton>
        </li>
    );
}

Menus.Menu = Menu;
Menus.Toggle = Toggle;
Menus.List = List;
Menus.Button = Button;

export default Menus;
