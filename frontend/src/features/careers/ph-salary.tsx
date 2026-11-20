import { ExternalLink, Info } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatMonthlySalary, salaryForCareer, salaryReviewedAt, salarySources } from "./ph-salary-data";

export function PhilippineSalaryComparison({ careers }: {
  careers: { id: string; title: string }[];
}) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        {careers.map((career) => {
          const salary = salaryForCareer(career.id);
          const source = salary && salarySources[salary.source];
          return (
            <Card key={career.id} className="min-w-0 gap-4 p-5 shadow-none">
              <h3 className="font-semibold">{career.title}</h3>
              {salary && source ? (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground">Approx. starting salary</p>
                    <p className="mt-1 flex flex-wrap items-baseline gap-x-2">
                      <strong className="text-2xl font-semibold tabular-nums">{formatMonthlySalary(salary.lowPhp)}–{formatMonthlySalary(salary.highPhp)}</strong>
                      <span className="text-sm text-muted-foreground">PHP / month</span>
                    </p>
                    <p className="mt-1 text-sm">Philippines · before deductions</p>
                  </div>
                  <dl className="space-y-2 border-t pt-3 text-sm">
                    <div><dt className="text-muted-foreground">Estimate basis</dt><dd className="font-medium">{salary.role}</dd></div>
                    <div><dt className="text-muted-foreground">Reference</dt><dd>{source.publisher} · {source.period}</dd></div>
                  </dl>
                  <p className="text-sm text-muted-foreground">{salary.coverage}</p>
                  <a className="inline-flex min-h-11 items-center gap-2 self-start underline underline-offset-4" href={source.url} target="_blank" rel="noreferrer">
                    View {source.publisher} reference
                    <ExternalLink className="size-4 shrink-0" aria-hidden="true" />
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </>
              ) : (
                <div className="space-y-2">
                  <p className="text-lg font-medium">Salary reference unavailable</p>
                  <p className="text-sm text-muted-foreground">A starting estimate for {career.title} has not been added yet.</p>
                </div>
              )}
            </Card>
          );
        })}
      </div>
      <div className="flex items-start gap-2 rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        <p>A rough guide to first or junior roles, not a measured national average. Ranges are Asgard estimates informed by the linked references; some use a broader job family. Location, company, skills and prior experience affect offers. Sources checked <time dateTime={salaryReviewedAt}>20 November 2026</time>.</p>
      </div>
    </div>
  );
}

export function PhilippineSalarySources() {
  return (
    <div className="space-y-2">
      <h3 className="font-semibold">Philippine salary references</h3>
      <p>Asgard’s approximate starting ranges use DOLE career pamphlets, junior networking salary information and Permhunt’s early-career recruitment guides. Older DOLE references are labeled by their guide year. The ranges are editorial estimates, not surveyed averages, confidence intervals or promised offers.</p>
      <p>Some careers use broader software, data, security, infrastructure or electronics estimates, explained on their cards. UI and UX share a combined design reference. DevOps uses junior roles with 1–3 years of experience, rather than a fresh-graduate benchmark.</p>
      <p>References are checked manually. No live feed or publisher endorsement is implied.</p>
    </div>
  );
}
