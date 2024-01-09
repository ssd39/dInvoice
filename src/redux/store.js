import { configureStore } from '@reduxjs/toolkit'
import didSlice from './didSlice'
import invoiceSlice from './invoiceSlice'
import protocolSlice from './protocolSlice'
import pifSlice from './pifSlice'

export default configureStore({
  reducer: {
    did: didSlice,
    invoice: invoiceSlice,
    protocol: protocolSlice,
    pfi: pifSlice
  },
})