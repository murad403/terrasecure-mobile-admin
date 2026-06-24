"use client";
import React, { useState } from 'react';
import DashboardChildrenLayout from '@/components/shared/DashboardChildrenLayout';
import ConflictStats from './ConflictStats';
import ConflictCard from './ConflictCard';
import ReviewOnMapModal from './ReviewOnMapModal';

export interface Conflict {
    id: string;
    severity: 'High' | 'Medium' | 'Low';
    type: 'Overlap' | 'Duplicate' | 'Invalid Geometry' | 'Boundary Conflict';
    parcels: string[];
    detectedDate: string;
}

const generateMockConflicts = (): Conflict[] => {
    const base: Conflict[] = [
        { id: 'CON-21', severity: 'High', type: 'Overlap', parcels: ['CM-2847', 'CM-2848'], detectedDate: '9 Jun 2025' },
        { id: 'CON-20', severity: 'Medium', type: 'Duplicate', parcels: ['CM-2790', 'CM-2791'], detectedDate: '5 Jun 2025' },
        { id: 'CON-19', severity: 'Low', type: 'Invalid Geometry', parcels: ['CM-2765'], detectedDate: '1 Jun 2025' },
        { id: 'CON-18', severity: 'High', type: 'Boundary Conflict', parcels: ['CM-2701', 'CM-2702'], detectedDate: '28 May 2025' }
    ];

    const severities: ('High' | 'Medium' | 'Low')[] = ['High', 'Medium', 'Low'];
    let idCounter = 17;

    // Add overlaps to reach 23 total
    for (let i = 0; i < 19; i++) {
        base.push({
            id: `CON-${idCounter--}`,
            severity: severities[i % 3],
            type: 'Overlap',
            parcels: [`CM-${2840 - i}`, `CM-${2841 - i}`],
            detectedDate: `${25 - (i % 15)} May 2025`
        });
    }

    // Add duplicates to reach 8 total
    for (let i = 0; i < 7; i++) {
        base.push({
            id: `CON-${idCounter--}`,
            severity: severities[i % 3],
            type: 'Duplicate',
            parcels: [`CM-${2780 - i}`, `CM-${2781 - i}`],
            detectedDate: `${20 - (i % 10)} May 2025`
        });
    }

    // Add invalid geometries to reach 11 total
    for (let i = 0; i < 10; i++) {
        base.push({
            id: `CON-${idCounter--}`,
            severity: severities[i % 3],
            type: 'Invalid Geometry',
            parcels: [`CM-${2750 - i}`],
            detectedDate: `${15 - (i % 8)} May 2025`
        });
    }

    // Add boundary conflicts to reach 5 total
    for (let i = 0; i < 4; i++) {
        base.push({
            id: `CON-${idCounter--}`,
            severity: severities[i % 3],
            type: 'Boundary Conflict',
            parcels: [`CM-${2690 - i}`, `CM-${2691 - i}`],
            detectedDate: `${10 - (i % 5)} May 2025`
        });
    }

    return base.sort((a, b) => {
        const numA = parseInt(a.id.split('-')[1]);
        const numB = parseInt(b.id.split('-')[1]);
        return numB - numA;
    });
};

const ConflictsPage = () => {
    const [conflicts, setConflicts] = useState<Conflict[]>(generateMockConflicts);
    const [selectedConflict, setSelectedConflict] = useState<Conflict | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Dynamic stats calculation
    const total = conflicts.length;
    const overlaps = conflicts.filter(c => c.type === 'Overlap').length;
    const duplicates = conflicts.filter(c => c.type === 'Duplicate').length;
    const invalidGeoms = conflicts.filter(c => c.type === 'Invalid Geometry').length;
    const boundaryConflicts = conflicts.filter(c => c.type === 'Boundary Conflict').length;

    const handleResolve = (id: string) => {
        setConflicts(prev => prev.filter(c => c.id !== id));
    };

    const handleBlock = (id: string) => {
        setConflicts(prev => prev.filter(c => c.id !== id));
    };

    const handleApproveException = (id: string) => {
        setConflicts(prev => prev.filter(c => c.id !== id));
    };

    const handleReviewOnMap = (conflict: Conflict) => {
        setSelectedConflict(conflict);
        setIsModalOpen(true);
    };

    return (
        <DashboardChildrenLayout
            title="Conflict Detection"
            subtitle="Detected overlaps, duplicates, and boundary conflicts"
        >
            {/* Stats Cards */}
            <ConflictStats
                total={total}
                overlaps={overlaps}
                duplicates={duplicates}
                invalidGeoms={invalidGeoms}
                boundaryConflicts={boundaryConflicts}
            />

            {/* Conflicts List Container */}
            <div>
                {conflicts.map((conflict) => (
                    <ConflictCard
                        key={conflict.id}
                        conflict={conflict}
                        onReviewOnMap={() => handleReviewOnMap(conflict)}
                        onResolve={() => handleResolve(conflict.id)}
                        onBlock={() => handleBlock(conflict.id)}
                        onApproveException={() => handleApproveException(conflict.id)}
                    />
                ))}

                {conflicts.length === 0 && (
                    <div className="text-center py-20 bg-white border border-slate-100 rounded-2xl shadow-sm text-slate-400 font-semibold">
                        All conflicts resolved! No conflicts detected.
                    </div>
                )}
            </div>

            {/* Review Modal */}
            {selectedConflict && (
                <ReviewOnMapModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedConflict(null);
                    }}
                    conflict={selectedConflict}
                    onBlock={() => handleBlock(selectedConflict.id)}
                    onApproveException={() => handleApproveException(selectedConflict.id)}
                />
            )}

        </DashboardChildrenLayout>
    );
};

export default ConflictsPage;