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

const initialValues = {}


const PagesDropDown = ({ websites }) => {
    const { setFieldValue, values } = useFormikContext();

    useEffect(() => {
        if(!values.url) {
            setFieldValue('url', websites[0].x);
        } else {
            setFieldValue('url', values.url)
        };
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
    if(!values.step) {
        setFieldValue('step', steps[0].step);
    } else {
        setFieldValue('step', values.step)
    };
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

const TypesDropDown = ({ types }) => {
    const { setFieldValue, values } = useFormikContext();
  
    useEffect(() => {
        if(!values.type) {
            setFieldValue('type', types[0].event_type);
        } else {
            setFieldValue('type', values.type)
        };
      }, [types, setFieldValue , values]);
  
    return (
      <FormRow>
        <label htmlFor="type">
          <FormattedMessage id="label.type" defaultMessage="type" />
        </label>
        <div>
          <Field as="select" name="type" className={styles.dropdown}>
            {types?.map(type => (
              <option key={type.event_type} value={type.event_type}>
                {type.event_type}
              </option>
            ))}
          </Field>
          <FormError name="type" />
        </div>
      </FormRow>
    );
  };

export default function HeatmapForm({ values, onSave, onClose }) {
  const { get } = useApi();
  const [stepsValues, setStepsValues] = useState(null)
  const [typesValues, setTypesValues] = useState(null)
  const { data: websites} = useFetch(
    `/websites/${values}/metrics`,
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

  const updateForm = async url => {
    const {data:steps} = await get(`/websites/${values}/steps`, {
        url: url
    });

    const {data:types} = await get(`/websites/${values}/types`, {
      url: url
    });

    if(steps.length > 0) { 
      setStepsValues(steps);
    } else {
      setStepsValues(null);
    }

    if(types.length > 0) { 
      setTypesValues(types);
    } else {
      setTypesValues(null);
    }
  }

  const onChangeStep = eventForm => {
    if(eventForm.target.tagName == 'SELECT' && eventForm.target.name == "url") {
      updateForm(eventForm.target.value);
    }
  }

  const handleSubmit = async values => {
    if(!stepsValues) delete values.step;
    if(values.url && ((values.step && stepsValues) || (!values.step && !stepsValues)) && values.type) {
        onSave(values)
    } else {
        setMessage(
            <FormattedMessage id="message.failure" defaultMessage="Something went wrong." />,
          );
    }
  };

  if(!typesValues) {
    updateForm(websites[0].x);
  }

  return (
    <FormLayout>
      <Formik
      initialValues={initialValues}
        onSubmit={handleSubmit}
      >
        {() => (
          <Form onChange={onChangeStep}>
            <PagesDropDown websites={websites}/>
            {stepsValues && <StepsDropDown steps={stepsValues}/>}
            {typesValues && <TypesDropDown types={typesValues}/>}
            <FormButtons>
              <Button type="submit" variant="action">
                <FormattedMessage id="label.submit" defaultMessage="Submit" />
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
