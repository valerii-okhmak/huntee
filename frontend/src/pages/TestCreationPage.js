import React from 'react'
import { useTranslation } from 'react-i18next';
import CustomTitle from '../components/custom_title/CustomTitle';
import TestCreation from '../components/test_creation/TestCreation';

const TestCreationPage = () => {
  const { t } = useTranslation();

  const object = {
    logo: null,
    line: true,
    strong: t('testCreationPage.subtitle'),
    p: null
  }

  return (
    <div className="page">
        <CustomTitle title={t('testCreationPage.title')} data={object} />
        <TestCreation/>
    </div>
  )
}

export default TestCreationPage;