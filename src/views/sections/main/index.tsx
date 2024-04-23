"use client"
import MultiSelect from '@/views/components/multi-select'
import './style.scss'
import { getCharacters } from '@/actions/character'

const MainSection = () => {
    const getData = async (page?: number, keyword?: string) => {
        const result = await getCharacters(page, keyword);

        return { items: result?.results??[], pageCount: result?.info?.pages };
    }

    return (
        <section className='main'>
            <div className='container'>
                <div className='title'>
                    Rick and Morty Case
                </div>
                <MultiSelect
                    getData={getData}
                    modelKeys={{ label: "name", value: "id", image: "image", counter: { key: "episode", template: "#count# Episodes" } }}
                    placeholder='Please choose at least one item'
                    onChange={selectedIds => { console.log("Selected Ids", selectedIds); }}
                    enablePagination
                    enableSearch
                />
            </div>
        </section>
    )
}

export default MainSection