import React, { useState, useEffect, useMemo } from "react";
import { Star } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { useDrive } from "@/hooks/useDrive";
import FileGrid from "../components/FileGrid";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import type { FileItem, Folder } from "@/types/drive.types";
import Breadcrumbs from "../components/Breadcrumbs";

const Starred: React.FC = () => {
  const {
    files,
    folders,
    isLoading,
    fetchFiles,
    fetchFolders,
    currentPath, // ✅ Add this
  } = useDrive();

  const [viewMode, _setViewMode] = useState<"grid" | "list">("grid");
  const [filter, _setFilter] = useState<"all" | "files" | "folders">("all");

  const [starredItems, setStarredItems] = useState<{
    files: FileItem[];
    folders: Folder[];
  }>({
    files: [],
    folders: [],
  });

  useEffect(() => {
    fetchFiles();
    fetchFolders();
  }, [fetchFiles, fetchFolders]);

  // ✅ Compute starred items safely
  useEffect(() => {
    const starredFiles = files.filter((file) => file.isStarred);
    const starredFolders = folders.filter((folder) => folder.isStarred);
    setStarredItems({
      files: starredFiles,
      folders: starredFolders,
    });
  }, [files, folders]);

  // ✅ Check if we're inside a folder
  const isNavigating = currentPath.length > 0;

  // ✅ Memoized stats (performance boost)
  const totalSizeGB = useMemo(() => {
    const totalBytes = starredItems.files.reduce(
      (acc, file) => acc + (file.size || 0),
      0,
    );
    return (totalBytes / 1024 / 1024 / 1024).toFixed(2);
  }, [starredItems.files]);

  const recentlyAddedCount = useMemo(() => {
    const ONE_DAY = 24 * 60 * 60 * 1000;
    return starredItems.files.filter((f) => {
      const diff = Date.now() - new Date(f.updatedAt).getTime();
      return diff < ONE_DAY;
    }).length;
  }, [starredItems.files]);

  return (
    <AppLayout>
      {/* HEADER */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Star className="h-6 w-6 mr-2 text-yellow-500 fill-yellow-500" />
              Starred
            </h1>
            <p className="text-gray-600">Your important files and folders</p>
          </div>
        </div>
        <div className="mb-6">
          <Breadcrumbs />
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            label="Starred Items"
            value={starredItems.files.length + starredItems.folders.length}
          />
          <StatCard label="Total Size" value={`${totalSizeGB} GB`} />
          <StatCard label="Added Today" value={recentlyAddedCount} />
        </div>
      </div>

      {/* CONTENT */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Spinner size="xl" />
        </div>
      ) : starredItems.files.length === 0 &&
        starredItems.folders.length === 0 ? (
        <EmptyState />
      ) : (
        <FileGrid
          viewMode={viewMode}
          items={
            !isNavigating
              ? {
                  files: filter === "folders" ? [] : starredItems.files,
                  folders: filter === "files" ? [] : starredItems.folders,
                }
              : undefined
          }
        />
      )}
    </AppLayout>
  );
};

export default Starred;

/* ---------- SMALL COMPONENTS ---------- */
const StatCard = ({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) => (
  <div className="bg-white p-4 rounded-2xl border border-gray-200">
    <p className="text-sm text-gray-500 mb-1">{label}</p>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
  </div>
);

const EmptyState = () => (
  <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
    <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
      <Star className="h-12 w-12 text-gray-400" />
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">No starred items</h3>
    <p className="text-gray-500 mb-6 max-w-md mx-auto">
      Star important files and folders to access them quickly from here.
    </p>
    <Button variant="primary" onClick={() => (window.location.href = "/")}>
      Go to My Drive
    </Button>
  </div>
);
