import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Youtube, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  VolumeX,
  Shuffle,
  Repeat,
  Music,
  Radio,
  Mic
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Slider } from './ui/slider';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  thumbnail?: string;
}

interface Playlist {
  id: string;
  name: string;
  tracks: Track[];
}

export function BikeYouTube() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(75);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'one' | 'all'>('off');
  const [isVoiceSearching, setIsVoiceSearching] = useState(false);
  const [voiceQuery, setVoiceQuery] = useState('');

  const [playlists] = useState<Playlist[]>([
    {
      id: 'rock',
      name: 'Rock Riding',
      tracks: [
        { id: '1', title: 'Highway to Hell', artist: 'AC/DC', duration: 208 },
        { id: '2', title: 'Born to be Wild', artist: 'Steppenwolf', duration: 215 },
        { id: '3', title: 'Thunderstruck', artist: 'AC/DC', duration: 293 }
      ]
    },
    {
      id: 'electronic',
      name: 'Electronic Beats',
      tracks: [
        { id: '4', title: 'Midnight City', artist: 'M83', duration: 244 },
        { id: '5', title: 'One More Time', artist: 'Daft Punk', duration: 320 },
        { id: '6', title: 'Levels', artist: 'Avicii', duration: 202 }
      ]
    },
    {
      id: 'chill',
      name: 'Chill Ride',
      tracks: [
        { id: '7', title: 'Weightless', artist: 'Marconi Union', duration: 485 },
        { id: '8', title: 'Kiara', artist: 'Bonobo', duration: 234 },
        { id: '9', title: 'Teardrop', artist: 'Massive Attack', duration: 329 }
      ]
    }
  ]);

  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist>(playlists[0]);

  const voiceCommands = [
    'Play rock music',
    'Play electronic beats',
    'Play chill music',
    'Skip this song',
    'Pause music',
    'Turn up volume',
    'Shuffle playlist'
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentTrack) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= currentTrack.duration) {
            // Handle next track
            const currentIndex = currentPlaylist.tracks.findIndex(t => t.id === currentTrack.id);
            let nextIndex;
            
            if (isShuffled) {
              nextIndex = Math.floor(Math.random() * currentPlaylist.tracks.length);
            } else {
              nextIndex = (currentIndex + 1) % currentPlaylist.tracks.length;
            }
            
            setCurrentTrack(currentPlaylist.tracks[nextIndex]);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTrack, currentPlaylist.tracks, isShuffled]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlay = () => {
    if (!currentTrack && currentPlaylist.tracks.length > 0) {
      setCurrentTrack(currentPlaylist.tracks[0]);
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (!currentTrack) return;
    
    const currentIndex = currentPlaylist.tracks.findIndex(t => t.id === currentTrack.id);
    let nextIndex;
    
    if (isShuffled) {
      nextIndex = Math.floor(Math.random() * currentPlaylist.tracks.length);
    } else {
      nextIndex = (currentIndex + 1) % currentPlaylist.tracks.length;
    }
    
    setCurrentTrack(currentPlaylist.tracks[nextIndex]);
    setCurrentTime(0);
  };

  const handlePrevious = () => {
    if (!currentTrack) return;
    
    if (currentTime > 10) {
      setCurrentTime(0);
      return;
    }
    
    const currentIndex = currentPlaylist.tracks.findIndex(t => t.id === currentTrack.id);
    const prevIndex = currentIndex === 0 ? currentPlaylist.tracks.length - 1 : currentIndex - 1;
    
    setCurrentTrack(currentPlaylist.tracks[prevIndex]);
    setCurrentTime(0);
  };

  const handleVoiceSearch = () => {
    if (isVoiceSearching) return; // Prevent multiple simultaneous calls
    
    setIsVoiceSearching(true);
    setVoiceQuery('');
    
    // Simulate voice recognition
    const timeout = setTimeout(() => {
      const randomCommand = voiceCommands[Math.floor(Math.random() * voiceCommands.length)];
      setVoiceQuery(randomCommand);
      processVoiceCommand(randomCommand);
      setIsVoiceSearching(false);
    }, 2000);
    
    // Cleanup function
    return () => clearTimeout(timeout);
  };

  const processVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes('rock')) {
      setCurrentPlaylist(playlists[0]);
      setCurrentTrack(playlists[0].tracks[0]);
      setIsPlaying(true);
    } else if (lowerCommand.includes('electronic')) {
      setCurrentPlaylist(playlists[1]);
      setCurrentTrack(playlists[1].tracks[0]);
      setIsPlaying(true);
    } else if (lowerCommand.includes('chill')) {
      setCurrentPlaylist(playlists[2]);
      setCurrentTrack(playlists[2].tracks[0]);
      setIsPlaying(true);
    } else if (lowerCommand.includes('skip') || lowerCommand.includes('next')) {
      handleNext();
    } else if (lowerCommand.includes('pause') || lowerCommand.includes('stop')) {
      setIsPlaying(false);
    } else if (lowerCommand.includes('play')) {
      setIsPlaying(true);
    } else if (lowerCommand.includes('volume up')) {
      setVolume(prev => Math.min(100, prev + 20));
    } else if (lowerCommand.includes('shuffle')) {
      setIsShuffled(!isShuffled);
    }
  };

  return (
    <Card className="bg-gray-900/40 border-blue-500/20 backdrop-blur-sm">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Youtube className="w-5 h-5 text-red-400" />
            <h3 className="text-blue-300">YouTube Music</h3>
          </div>
          
          <div className="flex items-center gap-2">
            {isPlaying && (
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                Playing
              </Badge>
            )}
            <Button
              onClick={handleVoiceSearch}
              disabled={isVoiceSearching}
              size="sm"
              className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30"
            >
              <motion.div
                animate={isVoiceSearching ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 1, repeat: isVoiceSearching ? Infinity : 0 }}
              >
                <Mic className="w-4 h-4" />
              </motion.div>
            </Button>
          </div>
        </div>

        {/* Voice Search Status */}
        <AnimatePresence>
          {isVoiceSearching && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20"
            >
              <div className="text-sm text-blue-300">🎤 Listening for music commands...</div>
              {voiceQuery && (
                <div className="text-xs text-gray-400 mt-1">"{voiceQuery}"</div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Now Playing */}
        {currentTrack && (
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-red-500/20 to-purple-500/20 flex items-center justify-center border border-red-500/30">
                <Music className="w-8 h-8 text-red-400" />
              </div>
              
              <div className="flex-1">
                <div className="text-white font-medium mb-1">{currentTrack.title}</div>
                <div className="text-sm text-gray-400">{currentTrack.artist}</div>
                <div className="text-xs text-blue-400 mt-1">
                  {currentPlaylist.name}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <Progress 
                value={(currentTime / currentTrack.duration) * 100} 
                className="h-2"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(currentTrack.duration)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <Button
            onClick={() => setIsShuffled(!isShuffled)}
            size="sm"
            className={`${isShuffled ? 'bg-blue-500/30 text-blue-300' : 'bg-gray-700/50 text-gray-400'} border-0`}
          >
            <Shuffle className="w-4 h-4" />
          </Button>

          <Button
            onClick={handlePrevious}
            size="sm"
            className="bg-gray-700/50 hover:bg-gray-600/50 text-white border-0"
          >
            <SkipBack className="w-4 h-4" />
          </Button>

          <Button
            onClick={handlePlay}
            className="w-12 h-12 rounded-full bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30"
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          </Button>

          <Button
            onClick={handleNext}
            size="sm"
            className="bg-gray-700/50 hover:bg-gray-600/50 text-white border-0"
          >
            <SkipForward className="w-4 h-4" />
          </Button>

          <Button
            onClick={() => {
              const modes: Array<'off' | 'one' | 'all'> = ['off', 'one', 'all'];
              const currentIndex = modes.indexOf(repeatMode);
              setRepeatMode(modes[(currentIndex + 1) % modes.length]);
            }}
            size="sm"
            className={`${repeatMode !== 'off' ? 'bg-blue-500/30 text-blue-300' : 'bg-gray-700/50 text-gray-400'} border-0`}
          >
            <Repeat className="w-4 h-4" />
            {repeatMode === 'one' && <span className="text-xs ml-1">1</span>}
          </Button>
        </div>

        {/* Volume Control */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setIsMuted(!isMuted)}
              size="sm"
              className="bg-gray-700/50 hover:bg-gray-600/50 text-white border-0"
            >
              {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
            
            <div className="flex-1">
              <Slider
                value={[isMuted ? 0 : volume]}
                onValueChange={(value) => {
                  setVolume(value[0]);
                  setIsMuted(false);
                }}
                max={100}
                step={5}
                className="w-full"
              />
            </div>
            
            <span className="text-xs text-gray-400 w-10">{isMuted ? 0 : volume}%</span>
          </div>
        </div>

        {/* Playlists */}
        <div className="space-y-2">
          <div className="text-sm text-gray-400 mb-2">Quick Playlists:</div>
          <div className="grid grid-cols-1 gap-2">
            {playlists.map((playlist) => (
              <Button
                key={playlist.id}
                onClick={() => {
                  setCurrentPlaylist(playlist);
                  setCurrentTrack(playlist.tracks[0]);
                  setCurrentTime(0);
                  setIsPlaying(true);
                }}
                variant="outline"
                size="sm"
                className={`bg-gray-800/30 border-gray-600/50 text-gray-300 hover:bg-gray-700/50 text-left justify-start ${
                  currentPlaylist.id === playlist.id ? 'border-blue-500/50 bg-blue-500/10' : ''
                }`}
              >
                <Radio className="w-4 h-4 mr-2" />
                {playlist.name} ({playlist.tracks.length} tracks)
              </Button>
            ))}
          </div>
        </div>

        {/* Voice Commands Help */}
        <div className="mt-4 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
          <div className="text-xs text-purple-300 mb-1">🎵 Voice Commands:</div>
          <div className="text-xs text-gray-400">
            "Play rock music" • "Skip this song" • "Pause music" • "Turn up volume"
          </div>
        </div>

        {/* Safety Notice */}
        <div className="mt-2 text-xs text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 rounded p-2">
          🚨 Audio-only playback for safe riding. Use voice commands for hands-free control.
        </div>
      </div>
    </Card>
  );
}