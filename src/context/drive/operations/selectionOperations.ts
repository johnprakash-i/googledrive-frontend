import { Dispatch } from 'react'
import { DriveAction } from '../types'

export const createSelectionOperations = (
  dispatch: Dispatch<DriveAction>,
  selectedItems: string[]
) => {
  const selectItem = (itemId: string) => {
    dispatch({
      type: 'SET_SELECTED_ITEMS',
      payload: [...selectedItems, itemId],
    })
  }

  const selectMultiple = (itemIds: string[]) => {
    dispatch({ type: 'SET_SELECTED_ITEMS', payload: itemIds })
  }

  const deselectItem = (itemId: string) => {
    dispatch({
      type: 'SET_SELECTED_ITEMS',
      payload: selectedItems.filter(id => id !== itemId),
    })
  }

  const clearSelection = () => {
    dispatch({ type: 'CLEAR_SELECTION' })
  }

  return {
    selectItem,
    selectMultiple,
    deselectItem,
    clearSelection
  }
}