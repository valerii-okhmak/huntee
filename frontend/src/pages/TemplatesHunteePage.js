import React from 'react'
import CustomTitle from '../components/custom_title/CustomTitle';
import TemplatesHuntee from '../components/templates-huntee/TemplatesHuntee';

const TemplatesHunteePage = () => {

  const object = {
    logo: null,
    line: true,
    strong: 'Використовуйте шаблони для швидкого створення тестів!',
    p: null
  }

  return (
    <div className="page">
        <CustomTitle title='Шаблони Huntee' data={object} />
        <TemplatesHuntee />
    </div>
  )
}

export default TemplatesHunteePage