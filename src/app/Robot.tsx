import React, { useEffect, useRef } from 'react';

const RobotBackground = () => {
  const leftEyeRef = useRef(null);
  const rightEyeRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (event:any) => {
      const eyes = [leftEyeRef.current, rightEyeRef.current];
      const maxMovement = 5; // Change this value to adjust the movement range
      
      eyes.forEach((eye) => {
        const eyeRect = eye.getBoundingClientRect();
        const eyeX = eyeRect.left + eyeRect.width / 2;
        const eyeY = eyeRect.top + eyeRect.height / 2;
        const angle = Math.atan2(event.clientY - eyeY, event.clientX - eyeX);
        const distance = Math.min(maxMovement, Math.hypot(event.clientX - eyeX, event.clientY - eyeY) / 10);
        const pupilX = Math.cos(angle) * distance;
        const pupilY = Math.sin(angle) * distance;
        eye.querySelector('.pupil').style.transform = `translate(${pupilX}px, ${pupilY}px)`;
      });
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="sticky" ref={containerRef}>
      <div className="eye" ref={leftEyeRef} style={{ top: '235px', left: '112px' }}>
        <div className="pupil"></div>
      </div>
      <div className="eye" ref={rightEyeRef} style={{ top: '40%', left: '15%' }}>
        <div className="pupil"></div>
      </div>
    </div>
  );
};

export default RobotBackground;
