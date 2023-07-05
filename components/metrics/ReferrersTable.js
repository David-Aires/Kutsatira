import React, { useState } from 'react';
import { useIntl, defineMessage } from 'react-intl';
import FilterLink from 'components/common/FilterLink';
import { urlFilter } from 'lib/filters';
import MetricsTable from './MetricsTable';
import { FormattedMessage } from 'react-intl';

export const FILTER_COMBINED = 0;
export const FILTER_RAW = 1;

const messages = defineMessage({
  pages: { id: 'metrics.steps', defaultMessage: 'Steps' },
  views: { id: 'metrics.views', defaultMessage: 'View' },
});

export default function PagesTable({ websiteId, showFilters, ...props }) {
  const [filter, setFilter] = useState(FILTER_COMBINED);
  const { formatMessage } = useIntl();
  const url = document.URL;
  const title = url.split('/')[5];

  const renderLink = ({ x: url }) => {
    return <FilterLink id="url" value={url} />;
  };

  return (
    <>
      <MetricsTable
        title={formatMessage(messages.pages)}
        type="step"
        metric={formatMessage(messages.views)}
        websiteId={websiteId}
        dataFilter={filter !== FILTER_RAW ? urlFilter : null}
        renderLabel={renderLink}
        {...props}
      />
    </>
  );
}
