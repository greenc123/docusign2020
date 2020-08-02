import React, { useState, useEffect } from 'react';
import request from 'superagent';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

// CUSTOM COMPONENTS
import AddressForm from './AddressForm';
import PaymentForm from './PaymentForm';
import Review from './Review';
import { CustomStepIcon, CustomStepConnector } from './CustomFormStepper';

const useStyles = makeStyles((theme) => ({
  layout: {
    width: 'auto',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  stepper: {
    padding: theme.spacing(3, 0, 5),
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  }
}));

const FormContent = ({
  step,
  formFields,
  setFormFields
}) => {
  const setField = (step) => (field, value) => {
    const newFormFields = [...formFields];
    newFormFields[step][field] = value;
    setFormFields(newFormFields);
  };

  switch (step) {
    case 0:
      return <AddressForm initialValues={formFields[step]} setFormField={setField(step)} />;
    case 1:
      return <PaymentForm initialValues={formFields[step]} setFormField={setField(step)} />;
    case 2:
      return <Review />;
    default:
      throw new Error('Unknown step');
  }
};

const Form = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [formFields, setFormFields] = useState([
    { $$title: 'Step 1' }, { $$title: 'Step 2' }, { $$title: 'Step 3' }
  ]);

  const handleNext = () => setActiveStep(activeStep + 1);
  const handleBack = () => setActiveStep(activeStep - 1);

  useEffect(() => {
    const getFormData = () => formFields.reduce((data, form) => {
      const fields = { ...form };
      delete fields['$$title'];
  
      return {
        ...data,
        ...fields
      };
    }, {});

    if (activeStep === formFields.length) {
      const { REACT_APP_BACKEND_URL } = process.env;
      setLoading(true);
      (async () => {
        try {
          const { body } = await request.post(REACT_APP_BACKEND_URL).send(getFormData()).accept('json');
          const json = JSON.parse(body);
          setLoading(false);
        } catch (err) {
          console.error(err);
          setLoading(false);
        }
      })();
    }
  }, [activeStep, formFields]);

  return (
    <main className={classes.layout}>
      <Paper className={classes.paper}>

        <Typography component="h1" variant="h4" align="center">
          Pre-Assessment
        </Typography>

        <Stepper alternativeLabel activeStep={activeStep} className={classes.stepper} connector={<CustomStepConnector />}>
          {formFields.map(({ $$title }) => (
            <Step key={$$title}>
              <StepLabel StepIconComponent={CustomStepIcon}>{$$title}</StepLabel>
            </Step>
          ))}
        </Stepper>
          <>
            {activeStep < formFields.length &&
              <FormContent formFields={formFields} setFormFields={setFormFields} step={activeStep} />}
            {activeStep === formFields.length && ((loading) ? (
              <h1>Loading...</h1>
            ) : (
              <>
                <Typography variant="h5" gutterBottom>
                  Thank you for your order.
                </Typography>
                <Typography variant="subtitle1">
                  Your order number is #2001539. We have emailed your order confirmation, and will
                  send you an update when your order has shipped.
                </Typography>
              </>
            ))}

            <div className={classes.buttons}>
              {(activeStep < formFields.length) ? (
                <>
                  {activeStep !== 0 && (
                    <Button disabled={loading} onClick={handleBack} className={classes.button}>
                      Back
                    </Button>
                  )}
                  <Button
                    disabled={loading}
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    className={classes.button}
                  >
                    {activeStep === formFields.length - 1 ? 'Place order' : 'Next'}
                  </Button>
                </>
              ) : (
                <Button
                  disabled={loading}
                  variant="contained"
                  color="secondary"
                  className={classes.button}
                  onClick={() => setActiveStep(0)}
                >
                  RESET
                </Button>
              )}
            </div>
          </>
      </Paper>
    </main>
  );
}

export default Form;
