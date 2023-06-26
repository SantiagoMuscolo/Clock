import { useState, useEffect } from 'react';
import './style.css';

export const Clock: React.FC = () => {
    const [breakLength, setBreakLength] = useState<number>(5);
    const [sessionLength, setSessionLength] = useState<number>(25);
    const [timerLabel, setTimerLabel] = useState<string>('Session');
    const [timeLeft, setTimeLeft] = useState<any>(sessionLength * 60);
    const [isRunning, setIsRunning] = useState<boolean>(false);

    const handleBreakDecrement = ():void => {
        if (breakLength > 1 && !isRunning) {
            setBreakLength(breakLength - 1);
        }
    };

    const handleBreakIncrement = ():void => {
        if (breakLength < 60 && !isRunning) {
            setBreakLength(breakLength + 1);
        }
    };

    const handleSessionDecrement = ():void => {
        if (sessionLength > 1 && !isRunning) {
            setSessionLength(sessionLength - 1);
            setTimeLeft((sessionLength - 1) * 60);
        }
    };

    const handleSessionIncrement = ():void => {
        if (sessionLength < 60 && !isRunning) {
            setSessionLength(sessionLength + 1);
            setTimeLeft((sessionLength + 1) * 60);
        }
    };

    const handleStartStop = ():void => {
        setIsRunning(!isRunning);
    };

    const handleReset = ():void => {
        setBreakLength(5);
        setSessionLength(25);
        setTimerLabel('Session');
        setTimeLeft(sessionLength * 60);
        setIsRunning(false);
    };

    useEffect(() => {
        let interval: ReturnType<typeof setTimeout>;
        if (isRunning) {
            interval = setInterval(() => {
                setTimeLeft((prevTime: number) => {
                    if (prevTime === 0) {
                        if (timerLabel === 'Session') {
                            setTimerLabel('Break');
                            return breakLength * 60;
                        } else {
                            setTimerLabel('Session');
                            return sessionLength * 60;
                        }
                    } else {
                        return prevTime - 1;
                    }
                });
            }, 1000);
        }

        return () => {
            clearInterval(interval);
        };
    }, [isRunning, breakLength, sessionLength, timerLabel]);

    useEffect(() => {
        if (timeLeft === 0) {
            const audioElement = document.getElementById('beep') as HTMLAudioElement;
            audioElement.play();
        }
    }, [timeLeft]);

    const formatTime = (time: number): string => {
        const minutes = Math.floor(time / 60)
            .toString()
            .padStart(2, '0');
        const seconds = (time % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    };

    return (
        <div className="container">
            <h1>25 + 5 Clock</h1>
            <div className="length-controls">
                <div className="control">
                    <div id="break-label">Break Length</div>
                    <button id="break-decrement" onClick={handleBreakDecrement}>
                        -
                    </button>
                    <div id="break-length">{breakLength}</div>
                    <button id="break-increment" onClick={handleBreakIncrement}>
                        +
                    </button>
                </div>
                <div className="control">
                    <div id="session-label">Session Length</div>
                    <button id="session-decrement" onClick={handleSessionDecrement}>
                        -
                    </button>
                    <div id="session-length">{sessionLength}</div>
                    <button id="session-increment" onClick={handleSessionIncrement}>
                        +
                    </button>
                </div>
            </div>
            <div id="timer">
                <div id="timer-label">{timerLabel}</div>
                <div id="time-left">{formatTime(timeLeft)}</div>
            </div>
            <div className="timer-controls">
                <button id="start_stop" onClick={handleStartStop}>
                    {isRunning ? 'Pause' : 'Start'}
                </button>
                <button id="reset" onClick={handleReset}>
                    Reset
                </button>
            </div>
            <audio id="beep" src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav" />
        </div>
    );
};
