import React, { useEffect, useState, useRef } from 'react'

function MediaIndicator({ currentMediaIndex, currentMediaRef, medias, onHandleNextMedia, musicianData, mediaLoaded }) {

    const [indicatorProgress, setIndicatorProgress] = useState(0)
    const indicatorAnimationIdRef = useRef();
    

    useEffect(() => {
        // Clear previous animation frame

        if (indicatorAnimationIdRef.current) {
            cancelAnimationFrame(indicatorAnimationIdRef.current);
        }

        if(mediaLoaded || currentMediaRef.current instanceof HTMLVideoElement) {
            setIndicatorProgress(0);
            indicatorAnimationIdRef.current = requestAnimationFrame(updateIndicatorProgress);
        }
        
        // Clean up on unmount or ref change
        return () => {
            if (indicatorAnimationIdRef.current) {
                cancelAnimationFrame(indicatorAnimationIdRef.current);
            }
        };
    }, [currentMediaIndex, currentMediaRef, musicianData, mediaLoaded]); 


    const updateIndicatorProgress = () => {
        const media = currentMediaRef.current;

        if (media instanceof HTMLVideoElement) {
            const duration = media.duration;
            const currentTime = media.currentTime;
            const progress = ((currentTime / duration) * 100).toFixed(1);
            setIndicatorProgress(progress);

            if (progress >= 100) {
                onHandleNextMedia();
                return;
            }

            indicatorAnimationIdRef.current = requestAnimationFrame(updateIndicatorProgress);
        } else {
            const startTime = Date.now();

            const animateImageProgress = () => {
                const duration = 3000;
                const elapsed = Date.now() - startTime;
                const progress = Math.min((elapsed / duration) * 100, 100).toFixed(1);
                setIndicatorProgress(progress);
                if (elapsed < duration) {
                    indicatorAnimationIdRef.current = requestAnimationFrame(animateImageProgress);
                } else {
                    console.log('2312312')
                    onHandleNextMedia();
                }
            };

            indicatorAnimationIdRef.current = requestAnimationFrame(animateImageProgress);
        }
    };

  return (
    <div className="mediaIndicator">
        {medias.map((_, index) => (
            <div
                key={index}
                className={`indicator ${index === currentMediaIndex ? 'active' : ''}`}
            >
                <div 
                    className='currentProgress'
                    style={
                        index === currentMediaIndex
                        ? { width: `${indicatorProgress}%` }
                        : index > currentMediaIndex 
                        ? { width: 0 }
                        : { width: `100%` }
                    } 
                >
                </div>
            </div>
        ))}
    </div>
  )
}

export default MediaIndicator