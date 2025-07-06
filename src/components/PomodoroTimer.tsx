
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type SessionType = 'pomodoro' | 'short-break' | 'long-break';

interface TimerState {
  minutes: number;
  seconds: number;
  isRunning: boolean;
  sessionType: SessionType;
  totalSessions: number;
  streak: number;
}

export const PomodoroTimer = () => {
  const { toast } = useToast();
  const [timer, setTimer] = useState<TimerState>({
    minutes: 25,
    seconds: 0,
    isRunning: false,
    sessionType: 'pomodoro',
    totalSessions: 0,
    streak: 0
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const sessionDurations = {
    'pomodoro': 25,
    'short-break': 5,
    'long-break': 15
  };

  const sessionLabels = {
    'pomodoro': 'Focus Time',
    'short-break': 'Short Break',
    'long-break': 'Long Break'
  };

  useEffect(() => {
    // Create audio element for notifications
    audioRef.current = new Audio('/notification.mp3');
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (timer.isRunning) {
      intervalRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev.seconds === 0 && prev.minutes === 0) {
            // Timer finished
            handleTimerComplete();
            return {
              ...prev,
              isRunning: false
            };
          }

          if (prev.seconds === 0) {
            return {
              ...prev,
              minutes: prev.minutes - 1,
              seconds: 59
            };
          }

          return {
            ...prev,
            seconds: prev.seconds - 1
          };
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timer.isRunning]);

  const handleTimerComplete = () => {
    // Play notification sound
    try {
      audioRef.current?.play();
    } catch (error) {
      console.log('Could not play notification sound');
    }

    // Show browser notification
    if (Notification.permission === 'granted') {
      new Notification('Focus Session Complete!', {
        body: `${sessionLabels[timer.sessionType]} finished. Great work!`,
        icon: '/favicon.ico'
      });
    }

    // Show toast notification
    toast({
      title: "Session Complete! 🎉",
      description: `${sessionLabels[timer.sessionType]} finished. Time for ${getNextSession()}!`,
    });

    // Update statistics
    setTimer(prev => ({
      ...prev,
      totalSessions: prev.totalSessions + 1,
      streak: prev.sessionType === 'pomodoro' ? prev.streak + 1 : prev.streak
    }));

    // Auto-switch to next session
    setTimeout(() => {
      switchSession(getNextSessionType());
    }, 2000);
  };

  const getNextSessionType = (): SessionType => {
    if (timer.sessionType === 'pomodoro') {
      return timer.totalSessions % 4 === 3 ? 'long-break' : 'short-break';
    }
    return 'pomodoro';
  };

  const getNextSession = () => {
    const next = getNextSessionType();
    return sessionLabels[next];
  };

  const switchSession = (type: SessionType) => {
    setTimer(prev => ({
      ...prev,
      sessionType: type,
      minutes: sessionDurations[type],
      seconds: 0,
      isRunning: false
    }));
  };

  const toggleTimer = () => {
    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }

    setTimer(prev => ({
      ...prev,
      isRunning: !prev.isRunning
    }));
  };

  const resetTimer = () => {
    setTimer(prev => ({
      ...prev,
      minutes: sessionDurations[prev.sessionType],
      seconds: 0,
      isRunning: false
    }));
  };

  const formatTime = (minutes: number, seconds: number) => {
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const totalSeconds = sessionDurations[timer.sessionType] * 60;
    const currentSeconds = timer.minutes * 60 + timer.seconds;
    return ((totalSeconds - currentSeconds) / totalSeconds) * 100;
  };

  return (
    <div className="text-center">
      {/* Session Type Selector */}
      <div className="flex justify-center gap-4 mb-8">
        {Object.entries(sessionLabels).map(([type, label]) => (
          <Button
            key={type}
            variant={timer.sessionType === type ? "default" : "ghost"}
            onClick={() => switchSession(type as SessionType)}
            className={`px-6 py-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
              timer.sessionType === type 
                ? 'bg-white text-gray-900 shadow-lg' 
                : 'text-white hover:bg-white/10 border border-white/20'
            }`}
            disabled={timer.isRunning}
          >
            {label}
          </Button>
        ))}
      </div>

      {/* Timer Display */}
      <div className="mb-8">
        <div className="relative">
          {/* Progress Ring */}
          <svg className="w-80 h-80 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="2"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="white"
              strokeWidth="2"
              fill="transparent"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - getProgress() / 100)}`}
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          
          {/* Timer Text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-7xl font-light text-white mb-2 tracking-wider">
                {formatTime(timer.minutes, timer.seconds)}
              </div>
              <div className="text-white/70 text-lg">
                {sessionLabels[timer.sessionType]}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex justify-center gap-4 mb-8">
        <Button
          onClick={toggleTimer}
          size="lg"
          className="px-8 py-4 bg-white text-gray-900 hover:bg-white/90 rounded-full font-medium text-lg shadow-lg transition-all duration-300 hover:scale-105"
        >
          {timer.isRunning ? (
            <>
              <Pause className="mr-2 h-5 w-5" />
              Pause
            </>
          ) : (
            <>
              <Play className="mr-2 h-5 w-5" />
              Start
            </>
          )}
        </Button>
        
        <Button
          onClick={resetTimer}
          variant="ghost"
          size="lg"
          className="px-6 py-4 text-white hover:bg-white/10 backdrop-blur-sm rounded-full transition-all duration-300"
        >
          <RotateCcw className="h-5 w-5" />
        </Button>
      </div>

      {/* Stats Display */}
      <div className="flex justify-center gap-8 text-white/80">
        <div className="text-center">
          <div className="text-2xl font-bold">{timer.totalSessions}</div>
          <div className="text-sm">Sessions</div>
        </div>
        <div className="text-center flex items-center gap-1">
          <TrendingUp className="h-4 w-4" />
          <div>
            <div className="text-2xl font-bold">{timer.streak}</div>
            <div className="text-sm">Streak</div>
          </div>
        </div>
      </div>
    </div>
  );
};
