import React, { useCallback, useState } from "react";
import { Upload, X, File, CheckCircle, AlertCircle, Cloud } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/utils/helpers";
import { useFileUpload } from "@/hooks/useFileUpload";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";

interface UploadDropzoneProps {
  isOpen: boolean;
  onClose: () => void;
  folderId?: string | null;
}

/** Compound component type */
type UploadDropzoneComponent = React.FC<UploadDropzoneProps> & {
  Trigger: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>>;
};

const UploadDropzone: UploadDropzoneComponent = ({
  isOpen,
  onClose,
  folderId = null,
}) => {
  const { uploadFiles, progresses } = useFileUpload();

  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [_uploadErrors, setUploadErrors] = useState<Map<string, string>>(new Map());

  /** Prevent duplicate file names */
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => {
      const existing = new Set(prev.map((f) => f.name));
      const newFiles = acceptedFiles.filter((f) => !existing.has(f.name));
      return [...prev, ...newFiles];
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  const handleUpload = async () => {
    if (!files.length) return;

    setIsUploading(true);
    setUploadErrors(new Map());

    try {
      await uploadFiles(files, folderId);
      setFiles([]);
      setTimeout(onClose, 800);
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const getFileProgress = (fileName: string) =>
    progresses.find((p) => p.file.name === fileName);

  const totalSize = files.reduce((acc, file) => acc + file.size, 0);
  const uploadedSize = progresses.reduce(
    (acc, p) => acc + (p.isComplete ? p.file.size : p.uploaded),
    0
  );

  const overallProgress =
    totalSize > 0 ? Math.min(100, (uploadedSize / totalSize) * 100) : 0;



  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Upload Files"
      size="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="text-sm text-gray-500">
            {files.length} file{files.length !== 1 ? "s" : ""} selected •{" "}
            {(totalSize / 1024 / 1024).toFixed(2)} MB
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={onClose} disabled={isUploading}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleUpload}
              disabled={!files.length || isUploading}
              loading={isUploading}
            >
              {isUploading ? "Uploading..." : "Upload Files"}
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all",
            isDragActive
              ? "border-primary-500 bg-primary-50"
              : "border-gray-300 hover:border-primary-400 hover:bg-primary-50"
          )}
        >
          <input {...getInputProps()} />
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              {isDragActive ? (
                <Cloud className="h-8 w-8 text-primary-500" />
              ) : (
                <Upload className="h-8 w-8 text-gray-400" />
              )}
            </div>
            <p className="text-lg font-medium text-gray-900">
              {isDragActive ? "Drop files here" : "Drag & drop files here"}
            </p>
            <p className="text-sm text-gray-500">
              or click to browse files
            </p>
          </div>
        </div>

        {/* Overall Progress */}
        {isUploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>{Math.round(overallProgress)}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-500 transition-all"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* File List */}
        {files.length > 0 && (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {files.map((file, index) => {
              const progress = getFileProgress(file.name);
              return (
                <div
                  key={`${file.name}-${index}`}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-xl"
                >
                  <div className="flex items-center space-x-3">
                    <File className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {progress ? (
                      progress.isComplete ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : progress.error ? (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      ) : (
                        <>
                          <Spinner size="sm" />
                          <span className="text-sm">
                            {Math.round(progress.progress)}%
                          </span>
                        </>
                      )
                    ) : null}

                    {!isUploading && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Modal>
  );
};

/** Trigger Button */
const UploadTrigger: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  className,
  ...props
}) => (
  <button
    type="button"
    className={cn("inline-flex items-center justify-center", className)}
    {...props}
  >
    {children || <Upload className="h-5 w-5" />}
  </button>
);

UploadDropzone.Trigger = UploadTrigger;

export default UploadDropzone;
