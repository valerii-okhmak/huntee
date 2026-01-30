import React from 'react'
import { useTranslation } from 'react-i18next';
import CustomTitle from '../components/custom_title/CustomTitle';
import TemplatesHuntee from '../components/templates-huntee/TemplatesHuntee';

const TemplatesHunteePage = () => {
  const { t } = useTranslation();

  const object = {
    logo: null,
    line: true,
    strong: t('templatesHunteePage.subtitle'),
    p: null
  }

  return (
    <div className="page">
        <CustomTitle title={t('templatesHunteePage.title')} data={object} />
        <TemplatesHuntee />
    </div>
  )
}

export default TemplatesHunteePage;