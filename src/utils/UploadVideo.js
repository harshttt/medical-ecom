import React from "react";
import { Upload, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";
import service from "../services/file";

const UploadFile = ({
  value = [],
  onChange,
  count = 1,
  requiredWidth,
  requiredHeight,
  listType = "picture-card", // can be 'text' for non-image preview
}) => {
  const isMultiple = count > 1;

  // Allowed MIME types
  const allowedTypes = [
    "video/mp4",
  ];

  // Map stored value to Upload-compatible fileList
  const fileList = (value || []).map((item, index) => ({
    uid: item?.uid || `${item?.url}-${index}`,
    name: item?.name || `file-${index}`,
    status: "done",
    url: item?.url,
  }));

  // Validate file type before uploading
  const beforeUpload = (file) => {
    if (!allowedTypes.includes(file.type)) {
      message.error(`File type not allowed: ${file.name}`);
      return Upload.LIST_IGNORE;
    }
    

    return true;
  };

  // Handle upload
  const handleUpload = async ({ file, onSuccess, onError }) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await service.save(formData);

      if (!res?.url) {
        throw new Error(res?.message || "Invalid upload response");
      }

      const newFile = { uid: uuidv4(), url: res?.url, name: file.name };
      const updated = isMultiple ? [...(value || []), newFile] : [newFile];

      onChange?.(updated);
      onSuccess("ok");
    } catch (err) {
      console.error("Upload failed:", err);
      message.error(err.message || "Upload failed");
      onError?.(err);
    }
  };

  // Handle remove
  const handleRemove = (file) => {
    const updatedFileList = fileList.filter((f) => f.uid !== file.uid);
    const updatedValue = updatedFileList.map((f) => ({
      uid: f.uid,
      url: f.url,
      name: f.name,
    }));
    onChange?.(updatedValue);
  };

  return (
    <Upload
      beforeUpload={beforeUpload}
      customRequest={handleUpload}
      fileList={fileList}
      onRemove={handleRemove}
      listType={listType}
      accept={allowedTypes.join(",")}
      maxCount={count}
      multiple={isMultiple}
    >
      {fileList.length < count && (
        <div>
          <PlusOutlined />
          <div style={{ marginTop: 8 }}>Upload</div>
        </div>
      )}
    </Upload>
  );
};

export default UploadFile;
