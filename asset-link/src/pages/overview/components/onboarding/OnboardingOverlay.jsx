import { icons } from '../../../../assets/icons';
import './OnboardingOverlay.css';

const OnboardingOverlay = ({ onComplete }) => {
    const arrowIcon = icons.find(i => i.id === 'arrow').icon;

    const steps = [
        {
            target: '.nav-button:nth-child(1)',
            description: 'View and manage all your assets in a detailed list',
            style: { top: '62%', left: '25%' },
            textPosition: 'left', // 'left', 'right', 'top', 'bottom'
            arrowRotation: 30 // degrees
        },
        {
            target: '.nav-button:nth-child(2)',
            description: 'Add your first asset',
            style: { top: '55%', left: '68%' },
            textPosition: 'left',
            arrowRotation: 30
        },
        {
            target: '.nav-button:nth-child(3)',
            description: 'View your total networth and see how it changes over time',
            style: { top: '38%', left: '55%' },
            textPosition: 'right',
            arrowRotation: 150
        }
    ];

    const getFlexDirection = (position) => {
        switch (position) {
            case 'left': return 'row-reverse';
            case 'right': return 'row';
            case 'top': return 'column-reverse';
            case 'bottom': return 'column';
            default: return 'row';
        }
    };

    return (
        <div className="onboarding-overlay" onClick={onComplete}>
            {steps.map((step, index) => (
                <div
                    key={index}
                    className="onboarding-arrow"
                    style={{
                        ...step.style,
                        flexDirection: getFlexDirection(step.textPosition)
                    }}
                >
                    <span
                        className="arrow-icon"
                        style={{
                            transform: `rotate(${step.arrowRotation}deg)`
                        }}
                    >
                        {arrowIcon}
                    </span>
                    <div className="onboarding-description">
                        {step.description}
                    </div>
                </div>
            ))}
            <div className="click-message">
                Click anywhere to close onboarding
            </div>
        </div>
    );
};

export default OnboardingOverlay; 