import React from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';

const steps = [
    'CREATED',
    'SELECTION_PHASE',
    'CANDIDATE_PROPOSAL',
    'CONSOLIDATED',
    'DONE',
];

const StepProgress = ({ currentStep }) => {
    // Se lo step corrente è ABORTED, ritorna un cerchio rosso centrato
    if (currentStep.toUpperCase() === 'ABORTED') {
        return (
            <div className="d-flex flex-column align-items-center my-4">
                <div className="step-circle aborted">
                    <FaTimes color="white" />
                </div>
                <span className="step-label">ABORTED</span>
            </div>
        );
    }

    // Altrimenti, gestisce gli step standard
    const currentIndex = steps.indexOf(currentStep.toUpperCase());
    const safeIndex = currentIndex === -1 ? 0 : currentIndex;
    // Calcolo della larghezza della linea verde (ci sono 4 segmenti per 5 step)
    const totalSegments = steps.length - 1;
    const lineWidth = safeIndex > 0 ? `${(safeIndex / totalSegments) * 100}%` : '0';

    return (
        <div className="position-relative my-4">
            {/* Linea grigia di sfondo */}
            <div className="step-progress-line" />
            {/* Linea verde dinamica */}
            <div
                className="step-progress-line-completed"
                style={{ width: lineWidth }}
            />
            {/* Step (pallini e label) */}
            <div className="d-flex justify-content-between align-items-center position-relative">
                {steps.map((label, i) => (
                    <div key={i} className="text-center position-relative">
                        <div className={`step-circle ${i <= safeIndex ? 'completed' : ''}`}>
                            {i <= safeIndex ? (
                                <FaCheck color="white" />
                            ) : (
                                <div className="pending-circle" />
                            )}
                        </div>
                        <span className="step-label">{label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StepProgress;