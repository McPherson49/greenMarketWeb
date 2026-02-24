import EditProductForm from '@/components/EditProductForm';
import { useRouter } from 'next/router';

export default function EditProductPage() {
  const router = useRouter();
  const { id } = router.query;

  const productId = typeof id === 'string' ? id : null;

  if (!productId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Invalid product ID</p>
      </div>
    );
  }

  return <EditProductForm productId={productId} />;
}