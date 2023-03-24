import React, { useState } from 'react';
import { useIntl, defineMessage } from 'react-intl';
import FilterLink from 'components/common/FilterLink';
import FilterButtons from 'components/common/FilterButtons';
import { urlFilter } from 'lib/filters';
import MetricsTable from './MetricsTable';
import Link from 'components/common/Link';
import OverflowText from 'components/common/OverflowText';
import Favicon from 'components/common/Favicon';

export const FILTER_COMBINED = 0;
export const FILTER_RAW = 1;

const messages = defineMessage({
  combined: { id: 'metrics.filter.combined', defaultMessage: 'Combined' },
  raw: { id: 'metrics.filter.raw', defaultMessage: 'Raw' },
  pages: { id: 'metrics.pages', defaultMessage: 'Pages' },
  views: { id: 'metrics.views', defaultMessage: 'View' },
});

export default function PagesTable({ websiteId, showFilters, ...props }) {
  const [filter, setFilter] = useState(FILTER_COMBINED);
  const { formatMessage } = useIntl();
  const url = document.URL;
  const title = url.split('/')[5];

  const buttons = [
    {
      label: formatMessage(messages.combined),
      value: FILTER_COMBINED,
    },
    {
      label: formatMessage(messages.raw),
      value: FILTER_RAW,
    },
  ];

  const renderLink = ({ x: url }) => {
    return <FilterLink id="url" value={url} />;
  };

  return (
    <>
      {showFilters && <FilterButtons buttons={buttons} selected={filter} onClick={setFilter} />}
      <Link href="/tree/[...id]" as={`/tree/${websiteId}/${title}`}>
        <Favicon domain={props?.domain} />
        <OverflowText tooltipId={`${websiteId}-name`}>{title}</OverflowText>
      </Link>
      <MetricsTable
        title={formatMessage(messages.pages)}
        type="url"
        metric={formatMessage(messages.views)}
        websiteId={websiteId}
        dataFilter={filter !== FILTER_RAW ? urlFilter : null}
        renderLabel={renderLink}
        {...props}
      />
    </>
  );
}
