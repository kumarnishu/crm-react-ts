import { Alert, Button, CircularProgress, TextField } from '@mui/material';
import { Stack } from '@mui/system';
import { AxiosResponse } from 'axios';
import { useFormik } from 'formik';
import { useContext, useEffect } from 'react';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { UserChoiceActions, ChoiceContext } from '../../../contexts/dialogContext';
import { paths } from '../../../Routes';
import { ResetPasswordSendMail } from '../../../services/UserServices';
import { BackendError } from '../../../types';


function ResetPasswordSendMailForm() {
  const goto = useNavigate()
  const { mutate, isSuccess, isLoading, isError, error } = useMutation
    <AxiosResponse<string>,
      BackendError,
      { email: string }
    >
    (ResetPasswordSendMail)

  const { setChoice } = useContext(ChoiceContext)
  const formik = useFormik({
    initialValues: {
      email: ''
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email()
        .required('Required field')
    }),
    onSubmit: (values: {
      email: string
    }) => {
      mutate(values)
    },
  });
  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        setChoice({ type: UserChoiceActions.close })
        goto(paths.dashboard)
      }, 1000)
    }
  }, [setChoice, goto, isSuccess])
  return (
    <form onSubmit={formik.handleSubmit}>

      <Stack
        direction="column"
        pt={2}
        gap={2}
      >
        <TextField
          type="email"
          variant="filled"
          fullWidth
          required
          error={
            formik.touched.email && formik.errors.email ? true : false
          }
          id="email"
          label="Your Email"
          helperText={
            formik.touched.email && formik.errors.email ? formik.errors.email : "This will mail you a password reset link in your inbox ! If Not Found , please check your spam folder"
          }
          {...formik.getFieldProps('email')}
        />
        {
          isError ? (
            <Alert color="error">
              {error?.response.data.message}
            </Alert>
          ) : null
        }
        {
          isSuccess ? (
            <Alert color="success">
              reset password mail sent successfully
            </Alert>
          ) : null
        }
        <Button variant="contained"
          disabled={Boolean(isLoading)}
          color="primary" type="submit" fullWidth>{Boolean(isLoading) ? <CircularProgress /> : "Send"}
        </Button>
      </Stack>
    </form>
  )
}

export default ResetPasswordSendMailForm
