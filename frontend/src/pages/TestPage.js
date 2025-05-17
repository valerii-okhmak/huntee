import React from 'react';
import AboutTest from '../components/test_info/about_test/AboutTest';
import AboutWork from '../components/test_info/AboutWork';
import WorkResponsibilities from '../components/test_info/WorkResponsibilities';

const TestPage = () => {

const responsibilitiesList = [
  "Виступати в ролі лідера в галузі генеративного ШІ, визначаючи бізнес-сценарії, де генеративний ШІ може бути ефективно застосований.",
  "Досліджувати, розробляти та створювати прототипи передових підходів до генеративного ШІ, оцінювати їхню доцільність, вивчати існуючі наукові дослідження, а також впроваджувати та перевіряти рішення для реальних кейсів використання.",
  "Тісно співпрацювати з командою інженерів ML на всіх етапах, від досліджень до впровадження рішень для генеративного ШІ.",
  "Співпрацювати з продакт-менеджерами та іншими зацікавленими сторонами, щоб сформувати чітке бачення технології та її практичного застосування.",
  "Презентувати результати зацікавленим сторонам, ефективно висвітлюючи як технічні, так і бізнес-аспекти рішень."
];

  return (
    <div className="page">
      <AboutTest/>
      <AboutWork/>
      <WorkResponsibilities responsibilities={responsibilitiesList}/>
    </div>
  );
};

export default TestPage;