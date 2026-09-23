"use client";
import { useState } from "react";
import DashboardChildrenLayout from "@/components/shared/DashboardChildrenLayout";
import ConflictCard from "./ConflictCard";
import CreateInvestigation from "./CreateInvestigation";
import ReviewOnMapModal from "./ReviewOnMapModal";
import CustomPagination from "@/components/shared/CustomPagination";
import { useGetAllConflictsQuery } from "@/redux/features/conflicts/conflicts.api";
import { useUpdateParcelMutation } from "@/redux/features/parcel/parcel.api";
import { ConflictParcel } from "@/redux/features/conflicts/conflicts.type";
import { RefreshCw, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const ConflictsPage = () => {
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(20);

  const [selectedConflict, setSelectedConflict] = useState<ConflictParcel | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [workflowOpen, setWorkflowOpen] = useState(false);
  const [workflowConflict, setWorkflowConflict] = useState<ConflictParcel | null>(null);

  // RTK Query API Fetch
  const { data: response, isLoading, isFetching, error, refetch } = useGetAllConflictsQuery({
    page,
    limit,
  });
  const [updateParcel] = useUpdateParcelMutation();

  const conflictsList = response?.data || [];
  const pagination = response?.pagination;

  const handleOpenWorkflow = (conflict: ConflictParcel) => {
    setWorkflowConflict(conflict);
    setWorkflowOpen(true);
  };

  const handleBlock = async (id: number | string) => {
    try {
      const res = await updateParcel({ id, data: { status: "BLOCKED" } }).unwrap();
      toast.success(res?.message || "Parcel blocked successfully!");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to block parcel.");
    }
  };

  const handleReviewOnMap = (conflict: ConflictParcel) => {
    setSelectedConflict(conflict);
    setIsModalOpen(true);
  };

  return (
    <DashboardChildrenLayout
      title="Conflict Detection"
      subtitle="Detected overlaps, duplicates, and boundary conflicts"
    >
      <div className="space-y-6 pb-12">
        {/* Loading State */}
        {isLoading && (
          <div className="py-20 flex flex-col items-center justify-center space-y-3 bg-white border border-slate-200 rounded-2xl shadow-sm">
            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-sm font-semibold text-slate-600">
              Loading land conflicts data...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-rose-600 shrink-0" />
            <div>
              <h4 className="font-bold text-sm">Failed to load conflict records</h4>
              <p className="text-xs text-rose-700">
                Please check server connection or backend API response.
              </p>
            </div>
          </div>
        )}

        {/* Conflicts List Container */}
        {!isLoading && (
          <>
            {conflictsList.length > 0 ? (
              <div>
                {conflictsList.map((conflict) => (
                  <ConflictCard
                    key={conflict.id}
                    conflict={conflict}
                    onReviewOnMap={() => handleReviewOnMap(conflict)}
                    onResolve={() => handleOpenWorkflow(conflict)}
                    onBlock={() => handleBlock(conflict.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white border border-slate-200 rounded-2xl shadow-sm text-slate-400 font-semibold text-sm">
                No land conflicts found matching your filters.
              </div>
            )}

            {/* Custom Pagination */}
            {pagination && pagination.total > 0 && (
              <CustomPagination
                currentPage={page}
                totalPages={pagination.totalPages || 1}
                onPageChange={(newPage) => setPage(newPage)}
                totalEntries={pagination.total}
                pageSize={limit}
                isLoading={isFetching}
              />
            )}
          </>
        )}

        {/* Review Modal */}
        {selectedConflict && (
          <ReviewOnMapModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedConflict(null);
            }}
            conflict={selectedConflict}
          />
        )}

        {/* Create Investigation Drawer */}
        <CreateInvestigation
          isOpen={workflowOpen}
          onClose={() => {
            setWorkflowOpen(false);
            setWorkflowConflict(null);
          }}
          conflict={workflowConflict}
          onCreateInvestigation={(conflictId) => {
            refetch();
          }}
        />
      </div>
    </DashboardChildrenLayout>
  );
};

export default ConflictsPage;