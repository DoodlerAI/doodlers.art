import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { activateAccount } from "../../actions";
import SuccessMsg from "common/components/message/SuccessMsg";
import ErrorMsg from "common/components/message/ErrorMsg";
import './index.scss'

const AccountActivation = () => {
    const { activationToken } = useParams();
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const activate = async () => {
            try {
                const data: any = await activateAccount(activationToken);
                setSuccess(data.msg);
                setError("");
            }
            catch (error: any) {
                setSuccess("");
                error && setError(error);
            }
        }
        activate()
    }, [activationToken]);


    return (
        <div id='account-activation'>
            {success && <SuccessMsg message={success} />}
            {error && <ErrorMsg message={error} />}
        </div>
    )
}

export default AccountActivation