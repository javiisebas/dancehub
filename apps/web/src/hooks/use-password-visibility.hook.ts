'use client';

import { useState } from 'react';

export function usePasswordVisibility() {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        setIsVisible((prev) => !prev);
    };

    return {
        isVisible,
        toggleVisibility,
    };
}
