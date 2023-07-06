import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Formik, Form, Field, useFormikContext} from 'formik';
import Button from 'components/common/Button';
import FormLayout, {
  FormButtons,
  FormError,
  FormMessage,
  FormRow,
} from 'components/layout/FormLayout';
import useApi from 'hooks/useApi';
import useFetch from 'hooks/useFetch';
import styles from './WebsiteEditForm.module.css';

const initialValues = {
  site: ''
};

const validate = ({ site }) => {
  const errors = {};
  if (!site) {
    errors.site = <FormattedMessage id="label.required" defaultMessage="Required" />;
  }
  return errors;
};

const PagesDropDown = ({ websites }) => {
    const { setFieldValue, values } = useFormikContext();

    useEffect(() => {
            setFieldValue('url', values.url);
      }, [websites, setFieldValue , values]);

    return (
      <FormRow>
        <label htmlFor="url">
          <FormattedMessage id="label.url" defaultMessage="page" />
        </label>
        <div>
          <Field as="select" name="url" className={styles.dropdown}>
            {websites?.map(site => (
              <option key={site.x+"_"+site.y} value={site.x}>
                {site.x}
              </option>
            ))}
          </Field>
          <FormError name="url" />
        </div>
      </FormRow>
    );
};

const StepsDropDown = ({ steps }) => {
  const { setFieldValue, values } = useFormikContext();

  useEffect(() => {
          setFieldValue('step', values.step);
    }, [steps, setFieldValue , values]);

  return (
    <FormRow>
      <label htmlFor="step">
        <FormattedMessage id="label.step" defaultMessage="step" />
      </label>
      <div>
        <Field as="select" name="step" className={styles.dropdown}>
          {steps?.map(step => (
            <option key={step.step} value={step.step}>
              {step.step}
            </option>
          ))}
        </Field>
        <FormError name="step" />
      </div>
    </FormRow>
  );
};

export default function WebsiteScreenshotForm({ values, onSave, onClose }) {
  const { post, get } = useApi();
  const { websiteUuid: websiteId } = values;
  const [stepsValues, setStepsValues] = useState(false)
  const { data: websites} = useFetch(
    `/websites/${websiteId}/metrics`,
    {
      params: {
        type: "url",
        start_at: 1000000000000,
        end_at: 9999999999999,
      }
    },
  );

  const [message, setMessage] = useState();

  if(!websites) {
    return null;
  }

  const onChangeStep = async eventForm => {
    if(eventForm.target.tagName == 'SELECT' && eventForm.target.name == "url") {
      const {ok, data:steps} = await get(`/websites/${websiteId}/steps`, {
          url: eventForm.target.value
      });

      if(steps.length > 0) { 
        setStepsValues(steps);
      } else {
        setStepsValues(null);
      }
    }
  }

  const handleSubmit = async values => {
    const { ok, data } = await post(`/screenshot/${websiteId}/create`, {
        url: values.url,
        site: values.site,
        step: (values.step && stepsValues?values.step:null),
        token: values.token,
    });

    if (ok) {
      onSave();
    } else {
      setMessage(
        data || <FormattedMessage id="message.failure" defaultMessage="Something went wrong." />,
      );
    }
  };

  return (
    <FormLayout>
      <Formik
        initialValues={{ ...initialValues}}
        validate={validate}
        onSubmit={handleSubmit}
      >
        {() => (
          <Form onChange={onChangeStep}>
            <FormRow>
              <label htmlFor="site">
                <FormattedMessage id="label.site" defaultMessage="URL" />
              </label>
              <div>
                <Field
                  name="site"
                  type="text"
                  placeholder="example.com"
                  spellCheck="false"
                  autoCapitalize="off"
                  autoCorrect="off"
                />
                <FormError name="site" />
              </div>
              <div>
                <Field
                  name="token"
                  type="text"
                  placeholder="auth"
                  spellCheck="false"
                  autoCapitalize="off"
                  autoCorrect="off"
                />
              </div>
            </FormRow>
            <PagesDropDown websites={websites}/>
            {stepsValues && <StepsDropDown steps={stepsValues}/>}
            <FormButtons>
              <Button type="submit" variant="action">
                <FormattedMessage id="label.createScreenshot" defaultMessage="Create" />
              </Button>
              <Button onClick={onClose}>
                <FormattedMessage id="label.cancel" defaultMessage="Cancel" />
              </Button>
            </FormButtons>
            <FormMessage>{message}</FormMessage>
          </Form>
        )}
      </Formik>
    </FormLayout>
  );
}
