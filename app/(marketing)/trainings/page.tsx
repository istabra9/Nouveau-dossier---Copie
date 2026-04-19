import { CatalogueExplorer } from "@/frontend/components/catalogue/catalogue-explorer";
import { PageIntro } from "@/frontend/components/shared/page-intro";
import { getCataloguePageData } from "@/backend/services/platform";

export default async function TrainingsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const catalogue = await getCataloguePageData();
  const params = (await searchParams) ?? {};
  const initialQuery =
    typeof params.q === "string" ? params.q : "";
  const initialCategory =
    typeof params.category === "string" ? params.category : "all";

  return (
    <div className="section-wrap space-y-10 py-12">
      <PageIntro eyebrow="Trainings" title="All trainings" />
      <CatalogueExplorer
        trainings={catalogue.trainings}
        categories={catalogue.categories}
        initialQuery={initialQuery}
        initialCategory={initialCategory}
      />
    </div>
  );
}
