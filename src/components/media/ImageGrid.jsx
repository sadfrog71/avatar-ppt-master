import React from 'react';
import { MediaFrame } from './MediaFrame.jsx';

export function ImageGrid({ images, slotPrefix = 'grid', className = 'grid-3-3' }) {
  return (
    <div className={className}>
      {images.map((image, index) => (
        <MediaFrame
          key={`${image.caption}-${index}`}
          image={image}
          slot={`${slotPrefix}-${index + 1}`}
          caption={image.caption}
          className="h-26"
          style={{ height: '26vh' }}
        />
      ))}
    </div>
  );
}
