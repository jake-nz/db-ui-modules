'use client'

import type { TableProps } from 'antd'
import { Flex, Result, Switch, Table, Typography } from 'antd'
import type { AnyObject } from 'antd/es/_util/type'
import type { ColumnsType, FilterValue, SortOrder, SorterResult } from 'antd/es/table/interface'
import { ReadonlyURLSearchParams, usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { Suspense, useState } from 'react'
import useSWR from 'swr'
import type { Fetcher } from 'swr'
import type { AdminTableRecord, FetcherQuery, ListQuery } from './antAdminTypes'

const { Text } = Typography

const DEFAULT_PAGE_SIZE = 25

type AdminTableProps<RecordType extends AdminTableRecord = AdminTableRecord> = {
  fetcher: Fetcher<RecordType[], FetcherQuery>
  swrKey: string
  columns: ColumnsType<RecordType>
  defaultAutoRefetch?: number
  defaultFilters?: ListQuery['filters']
  defaultSorter?: SorterResult<RecordType>[]
  queryPrefix?: string
} & Omit<TableProps<RecordType>, 'data'>

export const AdminTable = <RecordType extends AdminTableRecord = AdminTableRecord>(
  props: AdminTableProps<RecordType>
) => {
  return (
    <Suspense fallback={<Table loading />}>
      <AdminTableComponent {...props} />
    </Suspense>
  )
}

export const AdminTableComponent = <RecordType extends AdminTableRecord = AdminTableRecord>({
  fetcher,
  columns,
  loading,
  swrKey,
  defaultAutoRefetch,
  defaultFilters,
  defaultSorter,
  queryPrefix,
  ...props
}: AdminTableProps<RecordType>) => {
  // Default filters and sorter
  const defaults = {
    filters: defaultFilters,
    sorter: defaultSorter,
    limit: props?.pagination ? props.pagination.pageSize : DEFAULT_PAGE_SIZE
  }
  // Get page, filters and sorter from URL. Update columns to show filtering and sorting
  const query = useListQuery(defaults, queryPrefix)

  const updatedColumns = columns.map(c => updateColumn(c, query))

  const [autoRefetch, _setAutoRefetch] = useState(defaultAutoRefetch)

  // Get data
  const { data, error, isLoading, isValidating, mutate } = useSWR<RecordType[], any, FetcherQuery>(
    { swrKey, ...query },
    fetcher,
    {
      refreshInterval: autoRefetch ? autoRefetch * 1000 : undefined
    }
  )

  const setAutoRefetch = (on: boolean) => {
    const defaultValue = defaultAutoRefetch || 30
    _setAutoRefetch(on ? defaultValue * 1000 : undefined)
    mutate()
  }

  const pagination = {
    ...usePagination(data, queryPrefix),
    ...props.pagination,
    pageSize: query.limit
  }

  // updates URL search query when table page, filters or sorter change
  const updateUrlQuery = useUpdateUrlQuery(queryPrefix)

  if (error) return <Result status="error" title="Error Loading Data" subTitle={error.message} />

  const showAutoRefetch = defaultAutoRefetch !== undefined
  const showTitle = showAutoRefetch || props.title

  return (
    <Table<RecordType>
      dataSource={data}
      columns={updatedColumns}
      loading={isLoading}
      tableLayout="auto"
      sticky={{ offsetHeader: 0 }}
      rowKey="id"
      onChange={updateUrlQuery}
      {...props}
      pagination={pagination}
      title={
        showTitle
          ? currentPageData => (
              <Flex>
                <div style={{ flex: 1 }}>{props.title?.(currentPageData)}</div>
                {showAutoRefetch && (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Switch
                      checked={Boolean(autoRefetch)}
                      onChange={setAutoRefetch}
                      loading={isValidating}
                      style={{ marginRight: '0.5em' }}
                    />
                    <Text>Auto Refresh ({defaultAutoRefetch}s)</Text>
                  </div>
                )}
              </Flex>
            )
          : undefined
      }
    />
  )
}

/**
 * Serialise list query to URL params string
 */
const serializeQuery = (listQuery: ListQuery, queryPrefix: string = '') => {
  const urlQuery = new URLSearchParams()

  // Pagination
  if (listQuery.page && listQuery.page > 1) urlQuery.set(`${queryPrefix}page`, listQuery.page.toString())
  if (listQuery.limit) urlQuery.set(`${queryPrefix}limit`, listQuery.limit.toString())

  // Filters
  for (const column in listQuery.filters) {
    const filter = listQuery.filters[column]
    if (!filter) continue

    for (const value of filter) {
      if (value) urlQuery.append(`${queryPrefix}${column}`, value.toString())
    }
  }

  // Sorting
  if (!Array.isArray(listQuery.sorter)) listQuery.sorter = [listQuery.sorter]
  for (const sorter of listQuery.sorter) {
    if (sorter.columnKey)
      urlQuery.append(`${queryPrefix}sort`, sorter.columnKey.toString() + '.' + (sorter.order || 'none'))
  }

  return urlQuery.toString()
}

const getPage = (urlQuery: ReadonlyURLSearchParams | null, queryPrefix: string = '') => {
  const page = urlQuery?.get(`${queryPrefix}page`) || '1'
  return parseInt(page)
}

const getLimit = (urlQuery: ReadonlyURLSearchParams | null, queryPrefix: string = '') => {
  const limit = urlQuery?.get(`${queryPrefix}limit`)
  return limit ? parseInt(limit) : undefined
}
/**
 * Get current pagination page
 */
const usePage = (queryPrefix?: string) => getPage(useSearchParams(), queryPrefix)
const useLimit = (queryPrefix?: string) => getLimit(useSearchParams(), queryPrefix)

const getFilters = (urlQuery: ReadonlyURLSearchParams | null, queryPrefix: string = '') => {
  if (!urlQuery) return null

  const filters: Record<string, FilterValue | null> = {}

  for (const key of urlQuery.keys()) {
    // Ignore keys without our prefix
    if (queryPrefix && !key.startsWith(queryPrefix)) continue
    // Ignore pagination and sorting keys
    if (key === `${queryPrefix}page`) continue
    if (key === `${queryPrefix}sort`) continue
    if (key === `${queryPrefix}pageSize`) continue

    const filter = urlQuery.getAll(key)
    if (!filter) continue

    filters[key.substring(queryPrefix.length)] = filter
  }

  if (!Object.keys(filters).length) return null

  return filters
}

const getSorter = (urlQuery: ReadonlyURLSearchParams | null, queryPrefix: string = '') => {
  if (!urlQuery) return null

  const sorter: SorterResult<any>[] = []

  for (const key of urlQuery.keys()) {
    if (key !== `${queryPrefix}sort`) continue

    let sorters = urlQuery.getAll(key)
    if (!sorters) continue

    for (const sort of sorters) {
      const [columnKey, order] = sort.split('.')

      sorter.push({
        columnKey,
        order: order === 'none' ? null : (order as SortOrder)
      })
    }
  }

  if (!sorter.length) return null

  return sorter
}

/**
 * Get filters, sorter and page for list view
 */
export const useListQuery = (defaults: Partial<ListQuery> = {}, queryPrefix?: string) => {
  const urlQuery = useSearchParams()
  return {
    filters: { ...defaults.filters, ...getFilters(urlQuery, queryPrefix) }, // This now concats the default with the url filters
    sorter: getSorter(urlQuery, queryPrefix) || defaults.sorter || [],
    page: getPage(urlQuery, queryPrefix),
    limit: getLimit(urlQuery, queryPrefix) ?? defaults.limit
  }
}

const updateColumn = <RecordType extends object = any>(
  column: ColumnsType<RecordType>[number],
  listQuery: {
    filters: Record<string, FilterValue | null>
    sorter: SorterResult<any>[]
  }
) => {
  if (!column.key) return column

  const filterable = column.filterDropdown || column.filters
  if (!column.sorter && !filterable) return column

  const updatedColumn = { ...column }

  if (column.sorter) {
    const key = column.key.toString()
    const sorter = listQuery.sorter.find(sorter => sorter.columnKey === key)
    if (sorter) updatedColumn.sortOrder = sorter.order
  }

  if (filterable) {
    const key = column.key!.toString()
    const filter = listQuery.filters[key]
    updatedColumn.filteredValue = filter ? filter : []
  }

  return updatedColumn
}

const useUpdateUrlQuery = <RecordType extends AnyObject>(queryPrefix?: string) => {
  const pathname = usePathname()
  const router = useRouter()

  const updateUrlQuery: TableProps<RecordType>['onChange'] = (pagination, filters, sorter) => {
    const urlQuery = serializeQuery(
      {
        page: pagination.current,
        limit: pagination.pageSize,
        filters,
        sorter: Array.isArray(sorter) ? sorter : [sorter]
      },
      queryPrefix
    )
    // router.push('?' + urlQuery) seems like is should work but leads to things/%5Bid%5D?page=... instead of things/1?page=...

    const url = new URL(pathname || '/', 'http://h')
    return router.push(url.pathname + '?' + urlQuery)
  }

  return updateUrlQuery
}

const usePagination = <RecordType extends AdminTableRecord = AdminTableRecord>(
  data: RecordType[] | undefined,
  queryPrefix?: string
) => {
  const page = usePage(queryPrefix)
  const limit = useLimit(queryPrefix)

  return {
    pageSize: limit ?? DEFAULT_PAGE_SIZE,
    showSizeChanger: false,
    total: data?.[0]?.totalCount,
    showTotal: (total: number) => `Total: ${total}`,
    current: page
  }
}
