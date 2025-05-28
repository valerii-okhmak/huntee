import React from 'react'
import Filter from '../Filter/Filter'
import './Filters.css'

const Filters = ({selectedLocations, setSelectedLocations }) => {
  return (
    <div className='filters'>
        <Filter
        selectedLocations={selectedLocations}
        setSelectedLocations={setSelectedLocations}
        />
    </div>
  )
}

export default Filters