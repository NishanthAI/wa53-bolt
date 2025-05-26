import React, { useState } from 'react';
import YouTube from 'react-youtube';
import { Loader2 } from 'lucide-react';

interface VideoPlayerProps {
  videoId: string;
  onComplete?: () => void;
  title?: string;
  description?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  videoId, 
  onComplete, 
  title,
  description
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const opts = {
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 0,
      modestbranding: 1,
      rel: 0,
    },
  };

  const handleReady = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setError('Failed to load the video. Please try again later.');
  };

  // Called when video ends
  const handleEnd = () => {
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <div className="w-full">
      {title && <h2 className="text-xl font-bold mb-3">{title}</h2>}
      
      <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <Loader2 size={32} className="text-blue-600 animate-spin" />
          </div>
        )}
        
        {error ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 p-4">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <div className={`w-full h-full ${isLoading ? 'invisible' : 'visible'}`}>
            <YouTube
              videoId={videoId}
              opts={opts}
              onReady={handleReady}
              onError={handleError}
              onEnd={handleEnd}
              className="w-full h-full"
            />
          </div>
        )}
      </div>
      
      {description && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium mb-2">About this lesson</h3>
          <p className="text-gray-700">{description}</p>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;