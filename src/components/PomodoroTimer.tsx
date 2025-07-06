
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
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
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

      {/* Enhanced Timer Display */}
      <div className="mb-8">
        <div className="relative">
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
              strokeWidth="3"
              fill="transparent"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - getProgress() / 100)}`}
              className="transition-all duration-1000 ease-linear drop-shadow-lg"
              style={{ filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.3))' }}
            />
          </svg>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-7xl font-light text-white mb-2 tracking-wider drop-shadow-lg">
                {formatTime(timer.minutes, timer.seconds)}
              </div>
              <div className="text-white/70 text-lg mb-2">
                {sessionLabels[timer.sessionType]}
              </div>
              {timer.technique === 'flowmodoro' && timer.flowSkippedBreaks > 0 && (
                <div className="text-yellow-300 text-sm">
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
