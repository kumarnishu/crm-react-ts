import { Dialog, DialogContent, DialogTitle, Button, Typography, Stack, CircularProgress, Alert } from '@mui/material'
import { AxiosResponse } from 'axios';
import { useContext, useEffect } from 'react';
import { useMutation } from 'react-query';
import { queryClient } from '../../..';
import { UserChoiceActions, ChoiceContext } from '../../../contexts/dialogContext';
import { MakeOwner } from '../../../services/UserServices';
import { BackendError } from '../../../types';


function MakeOwnerDialog({ id }: { id: string }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    const { mutate, isLoading, isSuccess, error, isError } = useMutation
        <AxiosResponse<any>, BackendError, string>
        (MakeOwner,
            {
                onSuccess: () => {
                    queryClient.invalidateQueries('users')

                }
            }
        )

    useEffect(() => {
        if (isSuccess)
            setTimeout(() => {
                setChoice({ type: UserChoiceActions.close })
            }, 1000)
    }, [setChoice, isSuccess])

    return (
        <Dialog open={choice === UserChoiceActions.make_owner ? true : false}
            onClose={() => setChoice({ type: UserChoiceActions.close })}
        >
            <DialogTitle textAlign="center">
                Make Owner
            </DialogTitle>
            <DialogContent>
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
                            new owner created
                        </Alert>
                    ) : null
                }
                <Typography variant="body1" color="error">
                    Warning ! This is a dangerous  Action, Be careful
                </Typography>
            </DialogContent>
            <Stack
                direction="column"
                gap={2}
                padding={2}
                width="100%"
            >
                <Button fullWidth variant="outlined" color="error"
                    onClick={() => {
                        setChoice({ type: UserChoiceActions.make_owner })
                        mutate(id)
                    }}
                    disabled={isLoading}
                >
                    {isLoading ? <CircularProgress /> :
                        "Submit"}
                </Button>
                <Button fullWidth variant="contained"
                    disabled={isLoading}
                     onClick={() => setChoice({ type: UserChoiceActions.close })}>Cancel</Button>
            </Stack >
        </Dialog >

    )
}

export default MakeOwnerDialog
