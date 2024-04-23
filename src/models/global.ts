export type ApiListModel<T = any> = {
    info: ApiPager,
    results: T[]
}

export type ApiPager = {
    count: number,
    pages: number,
    next: string,
    prev: string
}