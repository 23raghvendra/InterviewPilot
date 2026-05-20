import { useState, useRef, useCallback, useEffect } from 'react';

export function useTimer({ duration = 120, onExpire } = {}) {
    const [timeLeft, setTimeLeft] = useState(duration);
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef(null);
    const onExpireRef = useRef(onExpire);

    useEffect(() => {
        onExpireRef.current = onExpire;
    }, [onExpire]);

    const tick = useCallback(() => {
        setTimeLeft(prev => {
            if (prev <= 1) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
                setIsRunning(false);
                onExpireRef.current?.();
                return 0;
            }
            return prev - 1;
        });
    }, []);

    const startTimer = useCallback(() => {
        if (intervalRef.current) return;
        setIsRunning(true);
        intervalRef.current = setInterval(tick, 1000);
    }, [tick]);

    const stopTimer = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setIsRunning(false);
    }, []);

    const resetTimer = useCallback((newDuration) => {
        stopTimer();
        setTimeLeft(newDuration || duration);
    }, [duration, stopTimer]);

    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    const percentage = (timeLeft / duration) * 100;

    return { timeLeft, isRunning, startTimer, stopTimer, resetTimer, percentage };
}
