import { useEffect, useRef } from 'react';

export function useOutsideClick<T extends HTMLElement>(
    callbackFunction: () => void,
    listenCapturing: boolean
) {
    const ref = useRef<T>(null);

    useEffect(
        function () {
            function handleClick(e: Event) {
                if (
                    e.target instanceof Node &&
                    ref.current &&
                    !ref.current.contains(e.target)
                )
                    callbackFunction();
            }

            document.addEventListener('click', handleClick, listenCapturing);

            return () => {
                document.removeEventListener(
                    'click',
                    handleClick,
                    listenCapturing
                );
            };
        },
        [callbackFunction, listenCapturing]
    );

    return ref;
}
