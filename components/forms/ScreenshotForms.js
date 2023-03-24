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
import { DOMAIN_REGEX } from 'lib/constants';
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
  } else if (!DOMAIN_REGEX.test(site)) {
    errors.site = <FormattedMessage id="label.invalid-site" defaultMessage="Invalid site" />;
  }
  return errors;
};

const OwnerDropDown = ({ websites }) => {
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

export default function WebsiteScreenshotForm({ values, onSave, onClose }) {
  const { post } = useApi();
  const { websiteUuid: websiteId } = values;
  const { data: websites} = useFetch(
    `/websites/${websiteId}/metrics`,
    {
      params: {
        type: "url",
        start_at: 1679612400000,
        end_at: 1679698799999,
      }
    },
  );

  const [message, setMessage] = useState();

  if(!websites) {
    return null;
  }

  const handleSubmit = async values => {
    console.log(values)
    const { ok, data } = await post(`/screenshot/${websiteId}/create`, {
        url: values.url,
        site: values.site
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
          <Form>
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
            </FormRow>
            <OwnerDropDown websites={websites}/>
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
