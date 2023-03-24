import React from 'react';
import 'reactflow/dist/style.css';
import { useRouter } from 'next/router';
import Layout from 'components/layout/Layout';
import useRequireLogin from 'hooks/useRequireLogin';
import Page from 'components/layout/Page';
import TreeBoard from 'components/pages/TreeBoard';

export default function TreePage() {
  const { loading } = useRequireLogin();
  const router = useRouter();
  const { id } = router.query;

  if (!id || loading) {
    return null;
  }

  return (
    <Layout>
      <Page>
        <TreeBoard id={id} />
      </Page>
    </Layout>
  );
}
