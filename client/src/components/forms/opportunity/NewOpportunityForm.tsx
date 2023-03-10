import { Alert,  Button, CircularProgress, Stack, TextField } from '@mui/material';
import { AxiosResponse } from 'axios';
import { useFormik } from 'formik';
import { useEffect, useContext } from 'react';
import { useMutation } from 'react-query';
import * as Yup from "yup"
import { queryClient } from '../../..';
import { OpportunityChoiceActions, ChoiceContext } from '../../../contexts/dialogContext';
import { NewOpportunity } from '../../../services/OpportunityServices';
import { BackendError, Target } from '../../../types';
import { IOpportunity } from '../../../types/opportunity.type';
import { Countries } from '../../../utils/countries';
import { Source } from '../../../utils/Source';
import { States } from '../../../utils/states';

type TformData = {
  name: string,
  email: string,
  mobile: string,
  dp: string | Blob | File
  city: string,
  state: string,
  description: string,
  probability: "easy" | "medium" | "hard" | ""
  customer_name: string,
  address: string,
  country: string
  alternate_mobile: string,
  alternate_email: string,
  customer_designation: string,
  opportunity_source: string,
  remarks: string,
}

function NewOpportunityForm() {
  const { mutate, isLoading, isSuccess, isError, error } = useMutation
    <AxiosResponse<IOpportunity>, BackendError, FormData>
    (NewOpportunity, {
      onSuccess: () => queryClient.invalidateQueries('opportunities')
    })

  const { setChoice } = useContext(ChoiceContext)

  const formik = useFormik<TformData>({
    initialValues: {
      name: "",
      email: "",
      mobile: "",
      dp: "",
      city: "",
      state: "",
      description: "",
      probability: "",
      customer_name: "",
      address: "",
      country: "india",
      alternate_mobile: "",
      alternate_email: "",
      customer_designation: "",
      opportunity_source: "",
      remarks: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required('Required field')
        .min(4, 'Must be 4 characters or more')
        .max(30, 'Must be 30 characters or less'),
      email: Yup.string()
        .email('provide a valid email id')
        .required('Required field'),
      customer_name: Yup.string().required("required field")
        .min(4, 'Must be 4 characters or more')
        .max(30, 'Must be 30 characters or less'),
      customer_designation: Yup.string().required("required field"),
      city: Yup.string().required("required field")
        .min(3, 'Must be 3 characters or more')
        .max(30, 'Must be 30 characters or less'),
      state: Yup.string().required("required field")
        .min(3, 'Must be 3 characters or more')
        .max(30, 'Must be 30 characters or less'),
      probability: Yup.string().required("required field"),
      opportunity_source: Yup.string().required("required field"),
      country: Yup.string().required("required field"),
      description: Yup.string().required("required field")
        .min(20, 'Must be 20 characters or more')
        .max(1000, 'Must be 1000 characters or less'),
      address: Yup.string()
        .min(10, 'Must be 10 characters or more')
        .max(300, 'Must be 300 characters or less'),
      remarks: Yup.string()
        .min(10, 'Must be 10 characters or more')
        .max(500, 'Must be 500 characters or less'),
      mobile: Yup.string()
        .min(10, 'Must be 10 digits')
        .max(10, 'Must be 10 digits')
        .required('Required field'),
      alternate_mobile: Yup.string()
        .min(10, 'Must be 10 digits')
        .max(10, 'Must be 10 digits'),
      dp: Yup.mixed<File>()
        .test("size", "size is allowed only less than 200kb",
          file => {
            if (file)
              if (!file.size) //file not provided
                return true
              else
                return Boolean(file.size <= 1024 * 200)
            return true
          }
        )
        .test("type", " allowed only .jpg, .jpeg, .png, .gif images",
          file => {
            const Allowed = ["image/png", "image/jpg", "image/jpeg", "image/png", "image/gif"]
            if (file)
              if (!file.size) //file not provided
                return true
              else
                return Boolean(Allowed.includes(file.type))
            return true
          }
        )
    }),
    onSubmit: (values: TformData) => {
      let formdata = new FormData()
      formdata.append("name", values.name)
      formdata.append("email", values.email)
      formdata.append("mobile", values.mobile)
      formdata.append("city", values.city)
      formdata.append("state", values.state)
      formdata.append("description", values.description)
      formdata.append("probability", values.probability)
      formdata.append("customer_name", values.customer_name)
      formdata.append("address", values.address)
      formdata.append("country", values.country)
      formdata.append("alternate_mobile", values.alternate_mobile)
      formdata.append("alternate_email", values.alternate_email)
      formdata.append("customer_designation", values.customer_designation)
      formdata.append("opportunity_source", values.opportunity_source)
      formdata.append("remarks", values.remarks)
      formdata.append("dp", values.dp)
      mutate(formdata)
    }
  });
  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        setChoice({ type: OpportunityChoiceActions.close })
      }, 1000)
    }
  }, [isSuccess, setChoice])

  return (
    <form onSubmit={formik.handleSubmit}>
     
      <Stack
        gap={2}
        py={2}
      >
        {/* name */}
        <TextField
          autoFocus
          variant='standard'
          
          fullWidth
          required
          error={
            formik.touched.name && formik.errors.name ? true : false
          }
          id="name"
          label="Opportunity Name"
          helperText={
            formik.touched.name && formik.errors.name ? formik.errors.name : ""
          }
          {...formik.getFieldProps('name')}
        />
        {/* customer name */}
        <TextField
          variant='standard'
          
          fullWidth
          required
          error={
            formik.touched.customer_name && formik.errors.customer_name ? true : false
          }
          id="customer_name"
          label="Customer Name"
          helperText={
            formik.touched.customer_name && formik.errors.customer_name ? formik.errors.customer_name : ""
          }
          {...formik.getFieldProps('customer_name')}
        />

        {/* customer designiation */}
        <TextField
          variant='standard'
          
          fullWidth
          required
          error={
            formik.touched.customer_designation && formik.errors.customer_designation ? true : false
          }
          id="customer_designation"
          label="Customer Designiation"
          helperText={
            formik.touched.customer_designation && formik.errors.customer_designation ? formik.errors.customer_designation : ""
          }
          {...formik.getFieldProps('customer_designation')}
        />
        {/* mobile */}
        <TextField
          variant='standard'
          
          required
          error={
            formik.touched.mobile && formik.errors.mobile ? true : false
          }
          id="mobile"
          label="Mobile"
          fullWidth
          helperText={
            formik.touched.mobile && formik.errors.mobile ? formik.errors.mobile : ""
          }
          {...formik.getFieldProps('mobile')}
        />


        {/* email */}
        <TextField
          variant='standard'
          
          required
          fullWidth
          error={
            formik.touched.email && formik.errors.email ? true : false
          }
          id="email"
          label="Email"
          helperText={
            formik.touched.email && formik.errors.email ? formik.errors.email : ""
          }
          {...formik.getFieldProps('email')}
        />

        {/* alternate mobile */}
        <TextField
          variant='standard'
          
          fullWidth
          error={
            formik.touched.alternate_mobile && formik.errors.alternate_mobile ? true : false
          }
          id="alternate_mobile"
          label="Alternate Mobile"
          helperText={
            formik.touched.alternate_mobile && formik.errors.alternate_mobile ? formik.errors.alternate_mobile : ""
          }
          {...formik.getFieldProps('alternate_mobile')}
        />
        {/* alternate_email */}
        <TextField
          variant='standard'
          
          fullWidth
          error={
            formik.touched.alternate_email && formik.errors.alternate_email ? true : false
          }
          id="alternate_email"
          label="Alternate Email"
          helperText={
            formik.touched.alternate_email && formik.errors.alternate_email ? formik.errors.alternate_email : ""
          }
          {...formik.getFieldProps('alternate_email')}
        />
        {/* city */}
        <TextField
          variant='standard'
          
          required
          fullWidth
          error={
            formik.touched.city && formik.errors.city ? true : false
          }
          id="city"
          label="City"
          helperText={
            formik.touched.city && formik.errors.city ? formik.errors.city : ""
          }
          {...formik.getFieldProps('city')}
        />
        {/* state */}
        <TextField
          variant='standard'
          select
          SelectProps={{
            native: true
          }}
          focused
          required
          error={
            formik.touched.state && formik.errors.state ? true : false
          }
          id="state"
          label="State"
          fullWidth
          helperText={
            formik.touched.state && formik.errors.state ? formik.errors.state : ""
          }
          {...formik.getFieldProps('state')}
        >
          <option value="">
            Select State
          </option>
          {
            States.map(state => {
              return (<option key={state.code} value={state.state}>
                {state.state}
              </option>)
            })
          }
        </TextField>
        {/* probability */}
        <TextField
          variant='standard'
          select
          SelectProps={{
            native: true
          }}
          focused
          required
          error={
            formik.touched.probability && formik.errors.probability ? true : false
          }
          id="probability"
          label="Probability"
          fullWidth
          helperText={
            formik.touched.probability && formik.errors.probability ? formik.errors.probability : ""
          }
          {...formik.getFieldProps('probability')}
        >
          <option value="">
            Select
          </option>
          <option value="easy">
            easy
          </option><option value="medium">
            medium
          </option><option value="hard">
            hard
          </option>
        </TextField>

        {/* opportunity_source */}
        <TextField
          variant='standard'
          select
          SelectProps={{
            native: true
          }}
          focused
          required
          error={
            formik.touched.opportunity_source && formik.errors.opportunity_source ? true : false
          }
          id="opportunity_source"
          label="Opportunity Source"
          fullWidth
          helperText={
            formik.touched.opportunity_source && formik.errors.opportunity_source ? formik.errors.opportunity_source : ""
          }
          {...formik.getFieldProps('opportunity_source')}
        >
          <option value="">
            Select
          </option>
          {

            Source.map(source => {
              return (
                <option key={source} value={source}>
                  {source}
                </option>)
            })
          }
        </TextField>
        {/* country */}
        <TextField
          variant='standard'
          select
          SelectProps={{
            native: true
          }}
          
          required
          error={
            formik.touched.country && formik.errors.country ? true : false
          }
          id="country"
          label="Country"
          fullWidth
          helperText={
            formik.touched.country && formik.errors.country ? formik.errors.country : ""
          }
          {...formik.getFieldProps('country')}
        >
          {
            Countries.map(country => {
              return (<option key={country.unicode} value={country.name.toLowerCase()}>
                {country.name}
              </option>)
            })
          }
        </TextField>

        {/*dp  */}
        <TextField
          fullWidth
          error={
            formik.touched.dp && formik.errors.dp ? true : false
          }
          helperText={
            formik.touched.dp && formik.errors.dp ? String(formik.errors.dp) : ""
          }
          label="Display Picture"
          focused
          variant='standard'
          type="file"
          name="dp"
          onBlur={formik.handleBlur}
          onChange={(e) => {
            e.preventDefault()
            const target: Target = e.currentTarget
            let files = target.files
            if (files) {
              let file = files[0]
              formik.setFieldValue("dp", file)
            }
          }}
        />
        {/* address */}
        <TextField
          variant='standard'
          multiline
          minRows={2}
          
          error={
            formik.touched.address && formik.errors.address ? true : false
          }
          id="address"
          label="Address"
          fullWidth
          helperText={
            formik.touched.address && formik.errors.address ? formik.errors.address : ""
          }
          {...formik.getFieldProps('address')}
        />
        {/* description */}
        <TextField
          variant='standard'
          multiline
          minRows={2}
          required
          
          error={
            formik.touched.description && formik.errors.description ? true : false
          }
          id="description"
          label="Description"
          fullWidth
          helperText={
            formik.touched.description && formik.errors.description ? formik.errors.description : ""
          }
          {...formik.getFieldProps('description')}
        />
        {/* remarks */}
        <TextField
          variant='standard'
          multiline
          minRows={2}
          
          error={
            formik.touched.remarks && formik.errors.remarks ? true : false
          }
          id="remarks"
          label="Remarks"
          fullWidth
          helperText={
            formik.touched.remarks && formik.errors.remarks ? formik.errors.remarks : ""
          }
          {...formik.getFieldProps('remarks')}
        />
      </Stack>
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
            new opportunity created 
          </Alert>
        ) : null
      }
      <Button variant="contained" color="primary" type="submit"
        disabled={Boolean(isLoading)}
        fullWidth>{Boolean(isLoading) ? <CircularProgress /> : "Create"}
      </Button>
    </form>
  )
}

export default NewOpportunityForm
