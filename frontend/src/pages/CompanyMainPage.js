import React from 'react'
import CompanyWelcome from '../components/companyWelcome/CompanyWelcome'
import CompanyAboutUs from '../components/companyAboutUs/CompanyAboutUs'
import CompanyFromIdea from '../components/companyFromIdea/CompanyFromIdea'
import CompanyOptions from '../components/companyOptions/CompanyOptions'

const CompanyMainPage = () => {
  return (
    <div className='page'>
        <CompanyWelcome />
        <CompanyAboutUs />
        <CompanyFromIdea/>
        <CompanyOptions />
    </div>
  )
}

export default CompanyMainPage