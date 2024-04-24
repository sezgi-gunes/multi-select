"use client"
import MultiSelect from '@/views/components/multi-select'
import './style.scss'
import { getCharacters } from '@/actions/character'
import { getLocations } from '@/actions/location'

const MainSection = () => {
    const getCharactersForSelect = async (page?: number, keyword?: string) => {
        const result = await getCharacters(page, keyword);

        return { items: result?.results??[], pageCount: result?.info?.pages };
    }

    const getLocationsForSelect = async (page?: number, keyword?: string) => {
        const result = await getLocations(page, keyword);

        return { items: result?.results??[], pageCount: result?.info?.pages };
    }

    return (
        <section className='main'>
            <div className='container'>
                <div className='title'>
                    Rick and Morty Case
                </div>
                <MultiSelect
                    getData={getCharactersForSelect}
                    modelKeys={{ label: "name", value: "id", image: "image", counter: { key: "episode", template: "#count# Episodes" } }}
                    placeholder='Please choose at least one character'
                    onChange={selectedIds => { console.log("Selected Character Ids", selectedIds); }}
                    enablePagination
                    enableSearch
                />
                <MultiSelect
                    getData={getLocationsForSelect}
                    modelKeys={{ label: "name", value: "id", description: "type", counter: { key: "residents", template: "#count# Residents" } }}
                    placeholder='Please choose at least one location'
                    onChange={selectedIds => { console.log("Selected Location Ids", selectedIds); }}
                    enablePagination
                    enableSearch
                />
            </div>
        </section>
    )
}

export default MainSection