import React, { useEffect, useState } from "react";
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
  listType = "picture-card",
}) => {
  const isMultiple = count > 1;

  const allowedTypes = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/gif",
    "image/svg+xml",
  ];

  // Ensure value is always an array
  const safeValue = Array.isArray(value) ? value : [];
  
  // Create fileList from value prop
  const fileList = safeValue.map((item, index) => {
    // If item has url property
    if (item.url) {
      return {
        uid: item.uid || `existing-${index}`,
        name: item.name || `image-${index}`,
        status: "done",
        url: item.url,
        thumbUrl: item.url, // Important for preview
      };
    }
    // If item is a string URL
    if (typeof item === "string") {
      return {
        uid: `existing-${index}`,
        name: `image-${index}`,
        status: "done",
        url: item,
        thumbUrl: item,
      };
    }
    return item;
  });

  const beforeUpload = (file) => {
    if (!allowedTypes.includes(file.type)) {
      message.error(`File type not allowed: ${file.name}`);
      return Upload.LIST_IGNORE;
    }
    if (file.type.startsWith("image/") && requiredWidth && requiredHeight) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => {
          if (img.width !== requiredWidth || img.height !== requiredHeight) {
            message.error(
              `Image must be exactly ${requiredWidth}×${requiredHeight}px`
            );
            reject();
          } else {
            resolve(true);
          }
        };
        img.onerror = () => {
          message.error("Failed to read image dimensions");
          reject();
        };
      });
    }
    return true;
  };

  const handleUpload = async ({ file, onSuccess, onError }) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await service.save(formData);
      
      // Handle both response formats
      const data = response.data || response;
      
      console.log("Upload response:", data);

      if (!data || !data.url) {
        throw new Error(data?.message || "Invalid upload response - missing URL");
      }

      const newFile = { 
        uid: uuidv4(), 
        url: data.url, 
        name: file.name,
        status: "done",
        thumbUrl: data.url,
      };
      
      const currentValue = Array.isArray(value) ? value : [];
      const updated = isMultiple ? [...currentValue, newFile] : [newFile];

      onChange?.(updated);
      onSuccess(data, file);
      
    } catch (err) {
      console.error("Upload failed details:", err);
      message.error(err.message || "Upload failed");
      onError?.(err);
    }
  };

  const handleRemove = (file) => {
    const newFileList = fileList.filter(f => f.uid !== file.uid);
    const newValue = newFileList.map(f => ({
      uid: f.uid,
      url: f.url,
      name: f.name,
    }));
    onChange?.(newValue);
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