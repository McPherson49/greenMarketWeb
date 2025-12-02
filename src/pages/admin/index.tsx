import { useEffect } from 'react';
import { useRouter } from 'next/router';

const AdminIndex: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/dashboard');
  }, [router]);

  return <div>Loading...</div>;
};

export default AdminIndex;