import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DiscoveryHeaderProps {
  currentStep: number;
  totalSteps?: number;
  showProgress?: boolean;
  disabled?: boolean;
  onBack: () => void;
  onSkip: () => void;
}
export function DiscoveryHeader({currentStep,totalSteps=5,showProgress=true,disabled=false,onBack,onSkip}:DiscoveryHeaderProps) {
  return <>
    <div className="discovery-topline"><Button variant="ghost" disabled={disabled} onClick={onBack}><ArrowLeft aria-hidden="true" size={16} />Return</Button>{showProgress && currentStep <= totalSteps && <Button variant="ghost" disabled={disabled} onClick={onSkip}>Save and browse careers</Button>}</div>
    {showProgress && <div className="discovery-progress">
      <p className="discovery-progress-title">Discovery</p>
      <div className="question-progress" style={{ gridTemplateColumns: `repeat(${totalSteps}, minmax(0, 1fr))` }} role="progressbar" aria-label="Discovery question progress" aria-valuemin={1} aria-valuemax={totalSteps} aria-valuenow={Math.min(currentStep,totalSteps)} aria-valuetext={`Question ${Math.min(currentStep,totalSteps)} of ${totalSteps}`}>{Array.from({length:totalSteps},(_,index) => <span key={index} className={index < currentStep ? "filled" : ""} />)}</div>
      <p className="discovery-progress-label">Question {Math.min(currentStep,totalSteps)} of {totalSteps}</p>
    </div>}
  </>;
}
