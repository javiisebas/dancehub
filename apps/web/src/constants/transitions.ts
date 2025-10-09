export const TRANSITION_EASINGS = {
    ease: [0.36, 0.66, 0.4, 1],
    easeIn: [0.4, 0, 1, 1],
    easeOut: [0, 0, 0.2, 1],
    easeInOut: [0.4, 0, 0.2, 1],
    spring: [0.155, 1.105, 0.295, 1.12],
    springOut: [0.57, -0.15, 0.62, 0.07],
    softSpring: [0.16, 1.11, 0.3, 1.02],
};

export const TRANSITION_DEFAULTS = {
    enter: {
        duration: 0.2,
        ease: [0, 0, 0.2, 1],
    },
    exit: {
        duration: 0.1,
        ease: [0.4, 0, 1, 1],
    },
};
