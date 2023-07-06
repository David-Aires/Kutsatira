import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import Loading from 'components/common/Loading';
import ErrorMessage from 'components/common/ErrorMessage';
import useFetch from 'hooks/useFetch';
import useDateRange from 'hooks/useDateRange';
import usePageQuery from 'hooks/usePageQuery';
import { formatShortTime, formatNumber, formatLongNumber } from 'lib/format';
import MetricCard from './MetricCard';
import styles from './MetricsBar.module.css';

export default function MetricsBar({ websiteId, className }) {
  const [dateRange] = useDateRange(websiteId);
  const { startDate, endDate, modified } = dateRange;
  const [format, setFormat] = useState(true);
  const {
    query: { url, referrer, os, browser, device, country },
  } = usePageQuery();

  const { data, error, loading } = useFetch(
    `/websites/${websiteId}/statsConfig`,
    {
      params: {
        start_at: +startDate,
        end_at: +endDate,
        url,
        referrer,
        os,
        browser,
        device,
        country,
      },
    },
    [modified, url, referrer, os, browser, device, country],
  );

  const formatFunc = format
    ? n => (n >= 0 ? formatLongNumber(n) : `-${formatLongNumber(Math.abs(n))}`)
    : formatNumber;

  function handleSetFormat() {
    setFormat(state => !state);
  }

  const { configurations, uniques, close} = data || {};
  const num = Math.min(data && uniques.value, data && close.value);
  const diffs = data && {
    configurations: configurations.value - configurations.change,
    uniques: uniques.value - uniques.change,
    close: close.value - close.change,
  };

  return (
    <div className={classNames(styles.bar, className)} onClick={handleSetFormat}>
      {!data && loading && <Loading />}
      {error && <ErrorMessage />}
      {data && !error && (
        <>
          <MetricCard
            label={<FormattedMessage id="metrics.configurations" defaultMessage="Configurations" />}
            value={configurations.value}
            change={configurations.change}
            format={formatFunc}
          />
          <MetricCard
            label={<FormattedMessage id="metrics.visitors" defaultMessage="Visitors" />}
            value={uniques.value}
            change={uniques.change}
            format={formatFunc}
          />
          <MetricCard
            label={<FormattedMessage id="metrics.close" defaultMessage="Configuration close" />}
            value={close.value}
            change={close.change}
            format={formatFunc}
            reverseColors
          />
        </>
      )}
    </div>
  );
}
