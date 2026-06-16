import store from '@/redux/store'
import React from 'react'
import { Provider } from 'react-redux'


const ReduxWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    )
}

export default ReduxWrapper