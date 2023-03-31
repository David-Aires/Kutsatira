import React from 'react';
import 'reactflow/dist/style.css';
import { useRouter } from 'next/router';
import Layout from 'components/layout/Layout';
import useRequireLogin from 'hooks/useRequireLogin';
import Page from 'components/layout/Page';
import HeatmapBoard from 'components/pages/HeatmapBoard';


export default function HeatmapPage() {
  const { loading } = useRequireLogin();
  const router = useRouter();
  const { id } = router.query;

  if (!id || loading) {
    return null;
  }

  return (
    <Layout>
      <Page>
        <HeatmapBoard id={id} />
      </Page>
    </Layout>
  );
}
