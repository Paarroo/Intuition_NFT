import React, { ReactNode, createContext, useContext, useState } from "react";
import { GlassmorphismCard } from "./GlassmorphismCard";

interface BatchSelectionContextType {
  selectedItems: Set<string>;
  toggleSelection: (id: string) => void;
  selectAll: (ids: string[]) => void;
  clearSelection: () => void;
  isSelected: (id: string) => boolean;
  selectionCount: number;
}

const BatchSelectionContext = createContext<BatchSelectionContextType | undefined>(undefined);

export const useBatchSelection = () => {
  const context = useContext(BatchSelectionContext);
  if (!context) {
    throw new Error("useBatchSelection must be used within a BatchSelectionProvider");
  }
  return context;
};

interface BatchSelectionProviderProps {
  children: ReactNode;
}

export const BatchSelectionProvider: React.FC<BatchSelectionProviderProps> = ({ children }) => {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const toggleSelection = (id: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const selectAll = (ids: string[]) => {
    setSelectedItems(new Set(ids));
  };

  const clearSelection = () => {
    setSelectedItems(new Set());
  };

  const isSelected = (id: string) => {
    return selectedItems.has(id);
  };

  return (
    <BatchSelectionContext.Provider
      value={{
        selectedItems,
        toggleSelection,
        selectAll,
        clearSelection,
        isSelected,
        selectionCount: selectedItems.size,
      }}
    >
      {children}
    </BatchSelectionContext.Provider>
  );
};

interface BatchActionBarProps {
  totalItems: number;
  allItemIds: string[];
  onBatchTransfer?: (selectedIds: string[]) => void;
  className?: string;
}

export const BatchActionBar: React.FC<BatchActionBarProps> = ({
  totalItems,
  allItemIds,
  onBatchTransfer,
  className = "",
}) => {
  const { selectedItems, selectAll, clearSelection, selectionCount } = useBatchSelection();

  if (selectionCount === 0) {
    return null;
  }

  const selectedIds = Array.from(selectedItems);
  const isAllSelected = selectionCount === totalItems;

  return (
    <GlassmorphismCard
      variant="primary"
      size="sm"
      className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 ${className}`}
    >
      <div className="flex items-center gap-4 p-3">
        <span className="text-sm font-medium">{selectionCount} selected</span>

        <div className="flex gap-2">
          <button
            onClick={() => (isAllSelected ? clearSelection() : selectAll(allItemIds))}
            className="btn btn-ghost btn-xs"
          >
            {isAllSelected ? "Deselect All" : "Select All"}
          </button>

          <button onClick={clearSelection} className="btn btn-ghost btn-xs">
            Clear
          </button>

          {onBatchTransfer && (
            <button onClick={() => onBatchTransfer(selectedIds)} className="btn btn-primary btn-xs">
              Transfer Selected ({selectionCount})
            </button>
          )}
        </div>
      </div>
    </GlassmorphismCard>
  );
};

interface SelectableItemProps {
  id: string;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}

export const SelectableItem: React.FC<SelectableItemProps> = ({ id, children, className = "", disabled = false }) => {
  const { isSelected, toggleSelection } = useBatchSelection();
  const selected = isSelected(id);

  return (
    <div
      className={`relative ${className} ${selected ? "ring-2 ring-primary ring-opacity-60" : ""}`}
      onClick={e => {
        if (!disabled && (e.metaKey || e.ctrlKey || e.shiftKey)) {
          e.preventDefault();
          toggleSelection(id);
        }
      }}
    >
      {/* Selection indicator */}
      <div
        className={`absolute top-2 right-2 z-10 cursor-pointer ${disabled ? "opacity-50" : ""}`}
        onClick={e => {
          e.stopPropagation();
          if (!disabled) {
            toggleSelection(id);
          }
        }}
      >
        <div
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
            selected
              ? "bg-primary border-primary text-primary-content"
              : "border-white/40 bg-white/10 hover:bg-white/20"
          }`}
        >
          {selected && <span className="text-xs">✓</span>}
        </div>
      </div>

      {children}
    </div>
  );
};

interface BatchTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedIds: string[];
  selectedItems: any[];
  onConfirm: (address: string, selectedIds: string[]) => void;
}

export const BatchTransferModal: React.FC<BatchTransferModalProps> = ({
  isOpen,
  onClose,
  selectedIds,
  selectedItems,
  onConfirm,
}) => {
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim() || selectedIds.length === 0) return;

    setIsLoading(true);
    try {
      await onConfirm(address.trim(), selectedIds);
      onClose();
      setAddress("");
    } catch (error) {
      console.error("Batch transfer failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <GlassmorphismCard variant="primary" size="lg" className="w-full max-w-md">
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4">Batch Transfer ({selectedIds.length} NFTs)</h3>

          <div className="mb-4">
            <p className="text-sm opacity-80 mb-2">Selected NFTs:</p>
            <div className="max-h-32 overflow-y-auto bg-white/5 rounded p-2">
              {selectedItems.map((item, index) => (
                <div key={selectedIds[index]} className="text-xs opacity-70 truncate">
                  {item.name || `Token #${selectedIds[index]}`}
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Transfer to address:</label>
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="0x..."
                className="input input-bordered w-full bg-white/10 border-white/20"
                required
                disabled={isLoading}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <button type="button" onClick={onClose} className="btn btn-ghost flex-1" disabled={isLoading}>
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary flex-1"
                disabled={isLoading || !address.trim() || selectedIds.length === 0}
              >
                {isLoading ? "Transferring..." : `Transfer ${selectedIds.length} NFTs`}
              </button>
            </div>
          </form>
        </div>
      </GlassmorphismCard>
    </div>
  );
};

export default BatchSelectionProvider;
