import { Product } from "./Product";

export interface Pagination<T> {
    pageIndex: number;
    pageSize:  number;
    count:     number;
    data:      T;
}