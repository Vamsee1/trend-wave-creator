
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, TrendingUp, Minimize, Settings as SettingsIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type SessionType = 'pomodoro' | 'short-break' | 'long-break';
type TechniqueType = 'classic' | '52-17' | 'flowmodoro' | '90-30';

interface TimerState {
  minutes: number;
  seconds: number;
  isRunning: boolean;
  sessionType: SessionType;
  totalSessions: number;
  streak: number;
  technique: TechniqueType;
  flowSkippedBreaks: number;
}

interface PomodoroTimerProps {
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

export const PomodoroTimer = ({ isFullscreen, onToggleFullscreen }: PomodoroTimerProps) => {
  const { toast } = useToast();
  const [timer, setTimer] = useState<TimerState>({
    minutes: 25,
    seconds: 0,
    isRunning: false,
    sessionType: 'pomodoro',
    totalSessions: 0,
    streak: 0,
    technique: 'classic',
    flowSkippedBreaks: 0
  });

  const [showTechniques, setShowTechniques] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const techniques = {
    'classic': {
      name: 'Classic Pomodoro',
      description: '25 min work / 5 min break',
      durations: { 'pomodoro': 25, 'short-break': 5, 'long-break': 15 }
    },
    '52-17': {
      name: '52/17 Rule',
      description: 'Deep cognitive tasks',
      durations: { 'pomodoro': 52, 'short-break': 17, 'long-break': 30 }
    },
    'flowmodoro': {
      name: 'Flowmodoro',
      description: 'Skip breaks when in flow',
      durations: { 'pomodoro': 25, 'short-break': 5, 'long-break': 15 }
    },
    '90-30': {
      name: '90/30 Method',
      description: 'Ultradian rhythm cycles',
      durations: { 'pomodoro': 90, 'short-break': 30, 'long-break': 45 }
    }
  };

  const sessionLabels = {
    'pomodoro': 'Focus Time',
    'short-break': 'Short Break',
    'long-break': 'Long Break'
  };

  useEffect(() => {
    // Create audio for notifications
    audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvGILEUK2qJqFbL3TUj0oXGbIu6aMpQKEu2LKvGUaAz6P1vjJdCcEJ3XC7NmNOgkZbr/l4KBMAAp7NjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvGILEUK2qJqFbL3TUj0oXGbIu6aMpQKEu2LKvGUaAz6P1vjJdCcEJ3XC7NmNOgkZbr/l4KBMAAp7');
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
            handleTimerComplete();
            return { ...prev, isRunning: false };
          }

          if (prev.seconds === 0) {
            return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
          }

          return { ...prev, seconds: prev.seconds - 1 };
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

    // Browser notification
    if (Notification.permission === 'granted') {
      new Notification('🍅 Focus Session Complete!', {
        body: `${sessionLabels[timer.sessionType]} finished using ${techniques[timer.technique].name}!`,
        icon: '/favicon.ico'
      });
    }

    // Enhanced toast with technique info
    toast({
      title: "Session Complete! 🎉",
      description: `${sessionLabels[timer.sessionType]} finished with ${techniques[timer.technique].name}!`,
    });

    // Update statistics
    setTimer(prev => ({
      ...prev,
      totalSessions: prev.totalSessions + 1,
      streak: prev.sessionType === 'pomodoro' ? prev.streak + 1 : prev.streak
    }));

    // Handle technique-specific logic
    if (timer.technique === 'flowmodoro' && timer.sessionType === 'pomodoro') {
      // For flowmodoro, ask user if they want to skip break
      setTimeout(() => {
        const skipBreak = confirm('You\'re in the flow! Skip break and continue?');
        if (skipBreak) {
          setTimer(prev => ({
            ...prev,
            flowSkippedBreaks: prev.flowSkippedBreaks + 1,
            minutes: techniques[prev.technique].durations.pomodoro,
            seconds: 0
          }));
        } else {
          switchSession(getNextSessionType());
        }
      }, 1000);
    } else {
      setTimeout(() => {
        switchSession(getNextSessionType());
      }, 2000);
    }
  };

  const getNextSessionType = (): SessionType => {
    if (timer.sessionType === 'pomodoro') {
      return timer.totalSessions % 4 === 3 ? 'long-break' : 'short-break';
    }
    return 'pomodoro';
  };

  const switchSession = (type: SessionType) => {
    const durations = techniques[timer.technique].durations;
    setTimer(prev => ({
      ...prev,
      sessionType: type,
      minutes: durations[type],
      seconds: 0,
      isRunning: false
    }));
  };

  const switchTechnique = (technique: TechniqueType) => {
    const durations = techniques[technique].durations;
    setTimer(prev => ({
      ...prev,
      technique,
      minutes: durations[prev.sessionType],
      seconds: 0,
      isRunning: false,
      flowSkippedBreaks: 0
    }));
    setShowTechniques(false);
  };

  const toggleTimer = () => {
    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
    setTimer(prev => ({ ...prev, isRunning: !prev.isRunning }));
  };

  const resetTimer = () => {
    const durations = techniques[timer.technique].durations;
    setTimer(prev => ({
      ...prev,
      minutes: durations[prev.sessionType],
      seconds: 0,
      isRunning: false
    }));
  };

  const formatTime = (minutes: number, seconds: number) => {
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const totalSeconds = techniques[timer.technique].durations[timer.sessionType] * 60;
    const currentSeconds = timer.minutes * 60 + timer.seconds;
    return ((totalSeconds - currentSeconds) / totalSeconds) * 100;
  };

  return (
    <div className={`text-center ${isFullscreen ? 'min-h-screen flex flex-col justify-center' : ''}`}>
      {/* Fullscreen Controls */}
      {isFullscreen && (
        <div className="absolute top-6 right-6 flex gap-2">
          <Button
            onClick={() => setShowTechniques(!showTechniques)}
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10 backdrop-blur-sm rounded-full"
          >
            <SettingsIcon className="h-5 w-5" />
          </Button>
          <Button
            onClick={onToggleFullscreen}
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10 backdrop-blur-sm rounded-full"
          >
            <Minimize className="h-5 w-5" />
          </Button>
        </div>
      )}

      {/* Current Technique Display */}
      <div className="mb-6">
        <Button
          onClick={() => setShowTechniques(!showTechniques)}
          variant="ghost"
          className="text-white/80 hover:text-white hover:bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-4"
        >
          <TrendingUp className="mr-2 h-4 w-4" />
          {techniques[timer.technique].name}
        </Button>
        
        {showTechniques && (
          <div className="grid grid-cols-2 gap-3 max-w-2xl mx-auto mb-6">
            {Object.entries(techniques).map(([key, technique]) => (
              <Button
                key={key}
                onClick={() => switchTechnique(key as TechniqueType)}
                variant={timer.technique === key ? "default" : "ghost"}
                className={`p-4 h-auto text-left backdrop-blur-sm rounded-xl border transition-all duration-300 ${
                  timer.technique === key 
                    ? 'bg-white text-gray-900 shadow-lg' 
                    : 'text-white hover:bg-white/10 border-white/20'
                }`}
                disabled={timer.isRunning}
              >
                <div>
                  <div className="font-medium mb-1">{technique.name}</div>
                  <div className="text-sm opacity-70">{technique.description}</div>
                </div>
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Session Type Tabs */}
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

      {/* 3D Animated Timer Display */}
      <div className="mb-8 flex justify-center">
        <div className="relative timer-3d" style={{ width: 360, height: 360 }}>
          {/* Outer rotating glow ring */}
          <div className="absolute inset-0 rounded-full animate-spin-slower opacity-70"
               style={{
                 background: 'conic-gradient(from 0deg, transparent, rgba(168,85,247,0.6), transparent, rgba(236,72,153,0.6), transparent)',
                 filter: 'blur(20px)',
               }} />

          {/* Middle rotating dotted ring */}
          <div className="absolute inset-4 rounded-full animate-spin-slow border-2 border-dashed border-white/30" />

          {/* Pulsing aura */}
          <div className="absolute inset-8 rounded-full timer-ring-pulse"
               style={{
                 background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
               }} />

          {/* Progress SVG */}
          <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a78bfa" />
                <stop offset="50%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#fbbf24" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>
            <circle cx="50" cy="50" r="42" stroke="rgba(255,255,255,0.08)" strokeWidth="3" fill="rgba(0,0,0,0.25)" />
            <circle
              cx="50" cy="50" r="42"
              stroke="url(#progressGrad)"
              strokeWidth="4"
              strokeLinecap="round"
              fill="transparent"
              strokeDasharray={`${2 * Math.PI * 42}`}
              strokeDashoffset={`${2 * Math.PI * 42 * (1 - getProgress() / 100)}`}
              className="transition-all duration-1000 ease-linear"
              filter="url(#glow)"
            />
          </svg>

          {/* Center time text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-7xl font-extralight text-white tracking-wider drop-shadow-[0_0_25px_rgba(255,255,255,0.5)]">
                {formatTime(timer.minutes, timer.seconds)}
              </div>
              <div className="text-white/80 text-base mt-2 uppercase tracking-[0.3em]">
                {sessionLabels[timer.sessionType]}
              </div>
              {timer.technique === 'flowmodoro' && timer.flowSkippedBreaks > 0 && (
                <div className="text-yellow-300 text-sm mt-2">
                  🔥 Flow: {timer.flowSkippedBreaks} breaks skipped
                </div>
              )}
            </div>
          </div>
        </div>
      </div>


      {/* Enhanced Control Buttons */}
      <div className="flex justify-center gap-4 mb-8">
        <Button
          onClick={toggleTimer}
          size="lg"
          className="px-8 py-4 bg-white text-gray-900 hover:bg-white/90 rounded-full font-medium text-lg shadow-lg transition-all duration-300 hover:scale-105 backdrop-blur-sm"
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

      {/* Enhanced Stats Display */}
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
        {timer.technique === 'flowmodoro' && (
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-300">{timer.flowSkippedBreaks}</div>
            <div className="text-sm">Flow State</div>
          </div>
        )}
      </div>

      {isFullscreen && (
        <div className="mt-8 text-white/60 text-center">
          <p className="text-sm">Using {techniques[timer.technique].name} technique</p>
          <p className="text-xs mt-1">{techniques[timer.technique].description}</p>
        </div>
      )}
    </div>
  );
};
