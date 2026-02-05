import React, { useState } from "react";
import { Folder, File, Upload, Share2 } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { useDrive } from "@/hooks/useDrive";
import { useAuth } from "@/hooks/useAuth";
import FileGrid from "../components/FileGrid";
import Breadcrumbs from "../components/Breadcrumbs";
import UploadDropzone from "../components/UploadDropzone";
import CreateFolderModal from "../components/CreateFolderModal";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";

const Dashboard: React.FC = () => {
  const {
    files,
    folders,

    isLoading,
    getCurrentFolderContents,
  } = useDrive();

  const { user } = useAuth();

  const [viewMode, _setViewMode] = useState<"grid" | "list">("grid");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCreateFolder, setShowCreateFolder] = useState(false);

  const { files: currentFiles, folders: currentFolders } =
    getCurrentFolderContents();

  if (isLoading && files.length === 0 && folders.length === 0) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <Spinner size="xl" />
            <p className="mt-4 text-gray-600">Loading your files...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Drive</h1>
            <p className="text-gray-600">Welcome back, {user?.firstName}!</p>
          </div>
        </div>

        {/* Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumbs />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-2xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Files</p>
                <p className="text-2xl font-bold text-gray-900">
                  {files.length}
                </p>
              </div>
              <div className="p-2 bg-blue-100 rounded-xl">
                <File className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Folders</p>
                <p className="text-2xl font-bold text-gray-900">
                  {folders.length}
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-xl">
                <Folder className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Shared Files</p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    files.filter((f) => f.sharedWith && f.sharedWith.length > 0)
                      .length
                  }
                </p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-xl">
                <Share2 className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* File Grid */}
      <FileGrid viewMode={viewMode} />

      {/* Empty state */}
      {currentFiles.length === 0 &&
        currentFolders.length === 0 &&
        !isLoading && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Folder className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              This folder is empty
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Upload files or create folders to organize your content.
            </p>
            <div className="flex items-center justify-center space-x-3">
              <Button
                variant="outline"
                icon={<Folder />}
                onClick={() => setShowCreateFolder(true)}
              >
                New Folder
              </Button>
              <Button
                variant="primary"
                icon={<Upload />}
                onClick={() => setShowUploadModal(true)}
              >
                Upload Files
              </Button>
            </div>
          </div>
        )}

      {/* Modals */}
      <UploadDropzone
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
      />

      <CreateFolderModal
        isOpen={showCreateFolder}
        onClose={() => setShowCreateFolder(false)}
      />
    </AppLayout>
  );
};

export default Dashboard;
