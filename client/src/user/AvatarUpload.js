import React, { useState } from 'react';
import { Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import useUploadImage from '../hooks/useUploadImage';

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
}

const AvatarUpload = () => {
  const { imageUrl, uploadPic, deleteImageUrl } = useUploadImage();
  const [image, setImage] = useState('');

  const onChange = (info) => {
    console.log(info.file.originFileObj);
    setImage(info.file.originFileObj);
  };

  const handleDelete = () => {
    setImage('');
    deleteImageUrl();
  };

  const uploadButton = (
    <div>
      {image ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );


  return (
    <div className='upload-avatar__container'>
      <ImgCrop rotate>
        <Upload
          name="avatar"
          listType="picture-card"
          className="avatar-uploader"
          onChange={onChange}
          showUploadList={false}
          multiple={false}
          customRequest={() => uploadPic(image)}
          beforeUpload={beforeUpload}>
          {image && imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
        </Upload>
      </ImgCrop>
      {image && <DeleteOutlined onClick={handleDelete} />}
    </div>
  );
};

export default AvatarUpload;
