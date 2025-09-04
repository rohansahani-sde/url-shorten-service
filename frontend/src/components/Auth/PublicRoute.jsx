import React from 'react'
import { isAuthenticated } from '../../utils/auth'
import { Navigate } from 'react-router-dom'

const PublicRoute = ({children}) => {
    if (isAuthenticated()){
        return <Navigate to={"/me"} replace />
    }
    return children;
}

export default PublicRoute