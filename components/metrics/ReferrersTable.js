import React from 'react';
import { useIntl, defineMessage } from 'react-intl';
import FilterLink from 'components/common/FilterLink';
import MetricsTable from './MetricsTable';

export const FILTER_COMBINED = 0;
export const FILTER_RAW = 1;

const messages = defineMessage({
  pages: { id: 'metrics.steps', defaultMessage: 'Steps' },
  views: { id: 'metrics.views', defaultMessage: 'View' },
});

export default function PagesTable({ websiteId, showFilters, ...props }) {
  const { formatMessage } = useIntl();
  const url = document.URL;
  const title = url.split('/')[5];

  const renderLink = ({ x: step }) => {
    return <FilterLink id="step" value={step}/>;
  };

  return (
    <>
      <MetricsTable
        title={formatMessage(messages.pages)}
        type="step"
        metric={formatMessage(messages.views)}
        websiteId={websiteId}
        renderLabel={renderLink}
        {...props}
      />
    </>
  );
}
