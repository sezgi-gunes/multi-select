"use client"
import { useEffect, useRef, useState, UIEvent, KeyboardEvent } from 'react'
import './style.scss'
import { htmlThicken } from '@/helpers/global'

type Data = {
    items: any[],
    pageCount?: number
}

type Props = {
    /** Method for getting data. */
    getData: (page?: number, keyword?: string) => Promise<Data>,
    /** Model keys for dynamic adaptation of data. */
    modelKeys: {
        /** Model key for label. */
        label: string,
        /** Model key for value. */
        value: string,
        /** Model key for image. */
        image?: string
        /** Model key for description. */
        description?: string,
        /** Model for counting results. */
        counter?: {
            /** Counter key. */
            key: string,
            /** Counter template. Example: #count# Episodes */
            template: string
        }
    },
    /** Placeholder. */
    placeholder?: string,
    /** Event handler that fires after selected items changed. */
    onChange?: (selectedValues: any[]) => void,
    /** Enable search for multi-select. Default is false. */
    enableSearch?: boolean,
    /** Enable pagination for multi-select. Default is false. */
    enablePagination?: boolean,
    /** No result text for user display. Default is "No results found". */
    noResultsText?: string,
}

/** Customizable multi-select component for generic uses. */
const MultiSelect = (props: Props) => {
    const ref = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [data, setData] = useState<Data>({ items: [] });
    const [loading, setLoading] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [page, setPage] = useState(1);
    const [keyword, setKeyword] = useState("");
    const [selectedItems, setSelectedItems] = useState<{ label: string, value: any }[]>([]);

    const onKeyDown = async (e: KeyboardEvent<HTMLDivElement>) => {
        let newKeyword;

        if (e.key.length == 1) {
            newKeyword = keyword + e.key;
        }
        else if (e.key == "Backspace") {
            newKeyword = keyword.substring(0, keyword.length - 1);
        }
        else if (e.key == "Escape") {
            setIsActive(false);
        }

        if (typeof (newKeyword) != "undefined") {
            dropdownRef.current?.scrollTo({ left: 0, top: 0 });
            setLoading(true);
            setPage(1);
            setKeyword(newKeyword);
            setData(await props.getData(1, newKeyword));
            setLoading(false);
        }
    }

    const onScrollDropdown = async (e: UIEvent<HTMLDivElement>) => {
        const elem = e.target as HTMLDivElement;

        if (elem.offsetHeight + elem.scrollTop >= elem.scrollHeight) {
            setPage(page + 1);
            get(page + 1);
        }
    }

    const onClickItem = (item: any) => {
        if (selectedItems.some(x => x.value == item[props.modelKeys.value])) {
            setSelectedItems((current) => current.filter(x => x.value != item[props.modelKeys.value]));
        }
        else {
            setSelectedItems((current) => {
                current.push({ label: item[props.modelKeys.label], value: item[props.modelKeys.value] });

                return [...current];
            });
        }
    }

    const get = async (targetPage: number) => {
        if (targetPage <= (data.pageCount ?? 1)) {
            setLoading(true);
            const result = await props.getData(targetPage, keyword);

            data.items = data.items.concat(result.items);
            data.pageCount = result.pageCount;

            setData({ ...data });
            setLoading(false);
        }
    }

    useEffect(() => {
        get(page);

        const globalClickHandler = (e: MouseEvent) => {
            const elem = e.target as HTMLElement;

            if (elem != ref.current && !ref.current?.contains(elem)) {
                setIsActive(false);
            }
        }

        document.addEventListener("click", globalClickHandler);

        return () => {
            document.removeEventListener("click", globalClickHandler);
        }
    }, []);

    useEffect(() => {
        if (props.onChange) {
            props.onChange(selectedItems.map(x => x.value));
        }
    }, [selectedItems]);

    return (
        <div ref={ref} className={'multi-select' + (isActive ? " active" : "")} onKeyDown={props.enableSearch ? onKeyDown : undefined}>
            <div className={'multi-select-input' + (loading ? " loading" : "")} onClick={() => { setIsActive(!isActive); }} tabIndex={0} onKeyDown={(e) => { e.key == "Enter" && setIsActive(!isActive); }}>
                <div className='multi-select-selected-items'>
                    {selectedItems.map(item =>
                        <div key={item.value} className='multi-select-selected-item'>
                            <div className='multi-select-selected-item-name'>
                                {item.label}
                            </div>
                            <button tabIndex={0}
                                className='multi-select-selected-item-remove'
                                onClick={(e) => { e.stopPropagation(); setTimeout(() => { setSelectedItems((current) => current.filter(x => x.value != item.value)) }); }}
                                onKeyDown={(e) => { (e.key != "Escape") && e.stopPropagation(); (e.key == "Enter") && setSelectedItems((current) => current.filter(x => x.value != item.value)); }}
                            />
                        </div>
                    )}
                    <span className='keyword'>{keyword}</span>
                    {props.placeholder && keyword.length == 0 && selectedItems.length == 0 &&
                        <span className='placeholder'>{props.placeholder}</span>
                    }
                </div>
            </div>
            <div ref={dropdownRef} className='multi-select-dropdown' onScroll={props.enablePagination ? onScrollDropdown : undefined}>
                {data.items.map(item =>
                    <div
                        key={item[props.modelKeys.value]}
                        className={'multi-select-item' + (selectedItems.some(x => x.value == item[props.modelKeys.value]) ? " selected" : "")}
                        onClick={() => { onClickItem(item) }}
                        onKeyDown={(e) => { (e.key == "Enter") && onClickItem(item); }}
                        tabIndex={0}
                    >
                        {props.modelKeys.image && item[props.modelKeys.image] &&
                            <img src={item[props.modelKeys.image]} alt={item[props.modelKeys.label]} />
                        }
                        <div className='multi-select-item-details'>
                            <div className='multi-select-item-label' dangerouslySetInnerHTML={{ __html: props.enableSearch ? htmlThicken(item[props.modelKeys.label], keyword) : item[props.modelKeys.label] }}></div>
                            {props.modelKeys.description && item[props.modelKeys.description] &&
                                <div className='multi-select-item-description'>
                                    {item[props.modelKeys.description]}
                                </div>
                            }
                            {props.modelKeys.counter && item[props.modelKeys.counter.key] &&
                                <div className='multi-select-item-counter'>
                                    {props.modelKeys.counter.template.replace("#count#", item[props.modelKeys.counter.key]?.length ?? 0)}
                                </div>
                            }
                        </div>
                    </div>
                )}
                {data.items.length == 0 &&
                    <div className='no-results'>
                        {props.noResultsText ?? "No results found."}
                    </div>
                }
            </div>
        </div>
    )
}

export default MultiSelect