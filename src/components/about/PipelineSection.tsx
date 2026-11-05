import { PageSection } from "@/components/about/PageSection";
import { PipelineDiagram } from "@/components/about/PipelineDiagram";

export const PipelineSection = () => {
  return (
    <PageSection id="pipeline" title="The pipeline">
      <div className="mt-4">
        <PipelineDiagram />
      </div>
    </PageSection>
  );
}