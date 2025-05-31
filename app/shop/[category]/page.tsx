import { CategoryPageContent } from "./category-page-content";

// Server component wrapper to handle async params
export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  return <CategoryPageContent category={category} />;
}
