import React from 'react';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { message, Upload } from 'antd';

const { Dragger } = Upload;

const props: UploadProps = {
  name: 'file',
  multiple: false, // Hanya satu gambar yang bisa diupload
  accept: 'image/*', // Hanya menerima gambar
  action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
  onChange(info) {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log('Dropped files', e.dataTransfer.files);
  },
  beforeUpload(file) {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image files!');
    }
    return isImage || Upload.LIST_IGNORE;
  },
};

const UploadComponent: React.FC = () => (
  <div className="mt-3">
    <label className="block text-sm font-medium">Foto</label>
    <Dragger {...props} style={{ backgroundColor: '#fff', border: '1px solid #d9d9d9', borderRadius: '8px' }}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">Click or drag file to this area to upload</p>
      <p className="ant-upload-hint">
        Hanya menerima gambar. Tidak boleh mengupload data perusahaan atau file terlarang lainnya.
      </p>
    </Dragger>
  </div>
);

export default UploadComponent;
