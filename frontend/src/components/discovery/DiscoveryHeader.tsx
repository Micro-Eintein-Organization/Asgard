import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DiscoveryHeaderProps {
  currentStep: number;
  totalSteps?: number;
  progress?: number;
  showProgress?: boolean;
  disabled?: boolean;
  onBack: () => void;
  onSkip: () => void;
}
export function DiscoveryHeader({currentStep,totalSteps=5,progress,showProgress=true,disabled=false,onBack,onSkip}:DiscoveryHeaderProps) {
  return <>
    <div className="discovery-topline"><Button variant="ghost" disabled={disabled} onClick={onBack}><ArrowLeft aria-hidden="true" size={16} />Return</Button>{showProgress && currentStep <= totalSteps && <Button variant="ghost" disabled={disabled} onClick={onSkip}>Save and browse careers</Button>}</div>
    {showProgress && <div className="discovery-progress">
      <p className="discovery-progress-title">Discovery</p>
      {progress !== undefined ? <>
        <div className="question-progress discovery-phase-progress" role="progressbar" aria-label="Discovery progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
          {[0,20,35,90].map((start,index) => <span key={start}><i style={{width: `${Math.max(0,Math.min(100,(progress-start)/([20,35,90,100][index]-start)*100))}%`}} /></span>)}
        </div>
        <p className="discovery-progress-label">Background · Interests · Explore work · Results</p>
        <p className="discovery-progress-label">{progress >= 100 ? "Discovery complete" : `Question ${currentStep}`}</p>
      </> : <>
        <div className="question-progress" style={{ gridTemplateColumns: `repeat(${totalSteps}, minmax(0, 1fr))` }} role="progressbar" aria-label="Discovery question progress" aria-valuemin={0} aria-valuemax={totalSteps} aria-valuenow={Math.min(currentStep - 1,totalSteps - 1)} aria-valuetext={`Question ${currentStep}; more questions may depend on your answers`}>{Array.from({length:totalSteps},(_,index) => <span key={index} className={index < currentStep - 1 ? "filled" : ""} />)}</div>
        <p className="discovery-progress-label">Question {currentStep}</p>
      </>}
    </div>}
  </>;
}
