import { useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'

import type { RootState, AppDispatch } from './store'
import { useGetMeQuery } from './api'

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const useSelectIsAuthed = () => {
  const { data } = useGetMeQuery()

  return Boolean(data)
}
