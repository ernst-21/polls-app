const fetch = require('node-fetch');
import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';

const useUploadImage = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [redirectToNetError, setRedirectToNetError] = useState(false);

  const uploadPic = (img) => {
    const data = new FormData();
    data.append('file', img);
    data.append('upload_preset', 'mern-boilerplate');
    data.append('cloud_name', 'ernst1');
    fetch('https://api.cloudinary.com/v1_1/ernst1/image/upload', {
      method: 'POST',
      body: data
    })
      .then((res) => res.json())
      .then((data) => {
        setImageUrl(data.url);
      })
      .catch((err) => {
        console.log(err);
        setRedirectToNetError(true);
      });
  };

  const deleteImageUrl = () => {
    setImageUrl(null);
  };

  if (redirectToNetError) {
    return <Redirect to="/info-network-error" />;
  }

  return { imageUrl, uploadPic, deleteImageUrl };
};

export default useUploadImage;
