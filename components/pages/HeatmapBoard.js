import React, { useState } from 'react';
import h337 from 'heatmap.js';
import useApi from 'hooks/useApi';
import PageHeader from 'components/layout/PageHeader';
import ButtonLayout from 'components/layout/ButtonLayout';
import Button from 'components/common/Button';
import Gear from 'assets/gear.svg';
import Modal from 'components/common/Modal';
import Toast from 'components/common/Toast';
import { FormattedMessage } from 'react-intl';
import HeatmapForm from 'components/forms/HeatmapForm';

export default function HeatmapBoard({ id }) {
  const [websiteId] = id;
  const [imageObjectURL, setImageObjectURL] = useState(null);
  const [optionHeatmap, setOptionHeatmap] = useState(false);
  const [displayHeatmap, setDisplayHeatmap] = useState(false);
  const [message, setMessage] = useState();
  const { getImage, get } = useApi();
  const data = async url => {
    return await getImage(`/screenshot/${websiteId}/all`, {
      url: url,
    });
  };

  const initHeatmap = async values => {
    data(values.url).then(data => {
      setImageObjectURL(URL.createObjectURL(data.data));
    });
    const img = document.getElementById('imageId');
    const box = document.querySelector('.App');
    img.onload = async () => {
      // now generate some random data
      const width = img.width;
      const height = img.height;
      box.style.height = height + 'px';
      box.style.width = width + 'px';

      [...document.getElementsByClassName('heatmap-canvas')].forEach(e => e.remove());

      const heatmapInstance = h337.create({
        // only container is required, the rest will be defaults
        container: box,
        radius: 25,
      });

      const { data: points } = await get(`/websites/${websiteId}/allEvent`, {
        url: values.url,
        type: values.type,
        step: values.step ? values.step : null,
      });

      const unique = [];
      if (points[0].event_data[0].posX) {
        for (const element of points) {
          for (const point of element) {
            const item = point.event_data;
            const duplicate = unique.find(obj => obj.posX === item.posX && obj.posY === item.posY);
            if (!duplicate) {
              item.count = 1;
              unique.push(item);
            } else {
              const index = unique.findIndex(x => x.posX === item.posX && x.posY == item.posY);
              unique[index].count += 1;
            }
          }
        }
      } else {
        for (const point of points) {
          const item = point.event_data;
          const duplicate = unique.find(obj => obj.posX === item.posX && obj.posY === item.posY);
          if (!duplicate) {
            item.count = 1;
            unique.push(item);
          } else {
            const index = unique.findIndex(x => x.posX === item.posX && x.posY == item.posY);
            unique[index].count += 1;
          }
        }
      }

      heatmapInstance.setData({
        max: Math.max(...unique.map(o => o.count)),
        data: unique.map(x => {
          return { x: x.posX, y: x.posY, value: x.count };
        }),
      });
    };
  };

  function handleSave(values) {
    setDisplayHeatmap(true);
    initHeatmap(values);
    setMessage(<FormattedMessage id="message.save-success" defaultMessage="Saved successfully." />);
    handleClose();
  }

  function handleClose() {
    setOptionHeatmap(false);
  }

  return (
    <div>
      <PageHeader>
        <ButtonLayout align="right">
          <Button
            icon={<Gear />}
            size="small"
            tooltip={<FormattedMessage id="label.OptionHeatmap" defaultMessage="filter" />}
            tooltipId={`button-heatmap-${websiteId}`}
            onClick={() => setOptionHeatmap(true)}
          />
        </ButtonLayout>
        {optionHeatmap && (
          <Modal
            title={<FormattedMessage id="label.heatmap-filter" defaultMessage="Heatmap Filter" />}
          >
            <HeatmapForm values={websiteId} onSave={handleSave} onClose={handleClose} />
          </Modal>
        )}
      </PageHeader>

      {displayHeatmap && (
        <div style={{ height: '37vw', width: '100%', position: 'relative' }} className="App">
          <img
            src={imageObjectURL}
            style={{ position: 'absolute', left: 0, top: 0, width: '100%' }}
            id="imageId"
          />
        </div>
      )}
      {message && <Toast message={message} onClose={() => setMessage(null)} />}
    </div>
  );
}
