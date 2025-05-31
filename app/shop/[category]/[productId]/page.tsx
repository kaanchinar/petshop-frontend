import { redirect } from 'next/navigation';

export default async function OldProductPage({ 
  params 
}: { 
  params: Promise<{ category: string; productId: string }> 
}) {
  const { productId } = await params;
  redirect(`/products/${productId}`);
}