import React, { useState, useRef } from 'react';

export default function FileUpload({ 
  onFileSelect, 
  multiple = false, 
  accept = "*/*", 
  maxSize = 10 * 1024 * 1024, // 10MB default
  className = "" 
}) {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState([]);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (fileList) => {
    const newFiles = Array.from(fileList);
    const validFiles = [];
    const newErrors = [];

    newFiles.forEach(file => {
      // Check file size
      if (file.size > maxSize) {
        newErrors.push(`${file.name} is too large. Maximum size is ${formatFileSize(maxSize)}`);
        return;
      }

      // Check file type if accept is specified
      if (accept !== "*/*") {
        const acceptedTypes = accept.split(',').map(type => type.trim());
        const fileType = file.type;
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        
        const isAccepted = acceptedTypes.some(type => {
          if (type.startsWith('.')) {
            return fileExtension === type.toLowerCase();
          }
          return fileType === type || fileType.startsWith(type.replace('*', ''));
        });

        if (!isAccepted) {
          newErrors.push(`${file.name} is not an accepted file type`);
          return;
        }
      }

      validFiles.push(file);
    });

    if (validFiles.length > 0) {
      const updatedFiles = multiple ? [...files, ...validFiles] : validFiles;
      setFiles(updatedFiles);
      onFileSelect(multiple ? updatedFiles : validFiles[0]);
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setTimeout(() => setErrors([]), 5000); // Clear errors after 5 seconds
    }
  };

  const removeFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onFileSelect(multiple ? updatedFiles : null);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className={className}>
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleChange}
          className="hidden"
        />
        
        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        
        <p className="mt-1 text-sm text-gray-600">
          <button
            type="button"
            onClick={onButtonClick}
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Upload files
          </button>
          {' '}or drag and drop
        </p>
        
        <p className="text-xs text-gray-500">
          {accept !== "*/*" ? `Accepted types: ${accept}` : 'All file types accepted'} • Max size: {formatFileSize(maxSize)}
        </p>
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="mt-4 space-y-2">
          {errors.map((error, index) => (
            <div key={index} className="text-sm text-red-600 bg-red-50 p-2 rounded">
              {error}
            </div>
          ))}
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium text-gray-900">Selected Files:</h4>
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-sm text-gray-700">{file.name}</span>
                <span className="text-xs text-gray-500">({formatFileSize(file.size)})</span>
              </div>
              <button
                onClick={() => removeFile(index)}
                className="text-red-500 hover:text-red-700"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
