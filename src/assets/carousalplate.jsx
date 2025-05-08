import React, { useEffect, useState } from 'react';
import { Carousel, Spin } from 'antd';
import axios from 'axios';

const App = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNatureImages = async () => {
    try {
      const urls = Array.from({ length: 5 }, () => 
        `https://source.unsplash.com/random`
      );
      setImages(urls);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching nature images:', err);
    }
  };

  useEffect(() => {
    fetchNatureImages();
    const interval = setInterval(fetchNatureImages, 30000); // update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ height: '100vh', width: '100vw', overflow: 'hidden', backgroundColor: '#000' }}>
      {loading ? (
        <Spin size="large" style={{ position: 'absolute', top: '50%', left: '50%' }} />
      ) : (
        <Carousel autoplay effect="fade" dotPosition="bottom" style={{ height: '100%' }}>
          {images.map((url, index) => (
            <div key={index} style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <img
                src={url}
                alt={`nature-${index}`}
                style={{
                  maxHeight: '100%',
                  maxWidth: '100%',
                  objectFit: 'contain',
                }}
              />
            </div>
          ))}
        </Carousel>
      )}
    </div>
  );
};

export default App;
