'use client';

import React from 'react';
import { X, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui';

interface ConfirmDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isDeleting: boolean;
    characterName: string;
}

export default function ConfirmDeleteModal({
    isOpen,
    onClose,
    onConfirm,
    isDeleting,
    characterName
}: ConfirmDeleteModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={!isDeleting ? onClose : undefined}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md bg-obsidian-light border border-stone-border rounded-xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-stone-border">
                    <h2 className="gothic-heading text-lg text-text-primary flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-hellfire-red/20 flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 text-hellfire-red" />
                        </div>
                        Delete Character
                    </h2>
                    <button
                        onClick={onClose}
                        disabled={isDeleting}
                        className="p-2 rounded-lg hover:bg-obsidian-lighter text-text-muted hover:text-text-primary 
                                 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-5">
                    <p className="text-text-secondary mb-2">
                        Are you sure you want to delete{' '}
                        <span className="text-text-primary font-semibold">{characterName}</span>?
                    </p>
                    <p className="text-sm text-text-muted">
                        This action cannot be undone. The character will be permanently removed from your profile.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 p-5 pt-0">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isDeleting}
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="flex-1 !bg-hellfire-red hover:!bg-hellfire-red/80 !border-hellfire-red"
                        icon={isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : undefined}
                    >
                        {isDeleting ? 'Deleting...' : 'Delete Character'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
