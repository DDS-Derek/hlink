import { message } from 'antd'
import useSWR from 'swr'
import fetch from '../kit/fetch'
import { TListItem, TConfig } from '../../types/shim'
import { useState } from 'react'
import { isFunction } from '../kit'

type CallbackOption<T> = {
  onSuccess?: (data: T) => void
  onError?: (e: any) => void
}

export function useAddOrEdit(options?: CallbackOption<boolean>) {
  const [currentConfig, setEdit] = useState<TListItem>()
  const [newConfig, addOrUpdateConfig] = useState<TConfig>()
  const addOrEditResult = useSWR(
    () => (newConfig ? ['/api/config', currentConfig] : null),
    (url) => {
      const method = currentConfig ? fetch.put : fetch.post
      const params = currentConfig
        ? {
            preName: currentConfig.name,
            preDescription: currentConfig.description,
            ...newConfig,
          }
        : newConfig
      return method<boolean>(url, params)
    },
    {
      onError(e) {
        message.error(e.message)
        addOrUpdateConfig(undefined)
        if (isFunction(options?.onError)) {
          options?.onError(e)
        }
      },
      onSuccess(data) {
        addOrUpdateConfig(undefined)
        if (isFunction(options?.onSuccess)) {
          options?.onSuccess(data)
        }
      },
    }
  )
  return {
    addOrUpdateConfig: (newConfig: TConfig, currentConfig?: TListItem) => {
      setEdit(currentConfig)
      addOrUpdateConfig(newConfig)
    },
    ...addOrEditResult,
  }
}

export function useList() {
  return useSWR('/api/config/list', (url) => fetch.get<TListItem[]>(url), {
    suspense: true,
  })
}

export function useGet(options?: CallbackOption<TConfig>) {
  const [item, getItem] = useState<TListItem>()
  const result = useSWR(
    item ? '/api/config' : null,
    (url) => {
      return fetch.get<string>(url, { ...item })
    },
    {
      onError(e) {
        message.error(e.message)
        getItem(undefined)
        if (isFunction(options?.onError)) {
          options?.onError(e)
        }
      },
      onSuccess(data) {
        getItem(undefined)
        if (isFunction(options?.onSuccess)) {
          if (item) {
            options?.onSuccess({
              detail: data,
              name: item?.name,
              description: item?.description,
            })
          }
        }
      },
    }
  )
  return {
    getItem,
    ...result,
  }
}

export function useDelete(options?: CallbackOption<boolean>) {
  const [name, rmItem] = useState<TListItem>()
  const result = useSWR(
    name ? '/api/config' : null,
    (url) => {
      return fetch.delete<boolean>(url, { name })
    },
    {
      onError(e) {
        message.error(e.message)
        rmItem(undefined)
        if (isFunction(options?.onError)) {
          options?.onError(e)
        }
      },
      onSuccess(data) {
        rmItem(undefined)
        if (isFunction(options?.onSuccess)) {
          options?.onSuccess(data)
        }
      },
    }
  )
  return {
    rmItem,
    ...result,
  }
}
