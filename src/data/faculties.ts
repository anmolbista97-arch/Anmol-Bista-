import { FacultyDetail } from '../types';

export const FACULTIES: FacultyDetail[] = [
  {
    id: 'Science',
    name: 'Science',
    iconName: 'Atom',
    tagline: 'Physics, Chemistry, Biology, Mathematics & CS',
    prompts: [
      {
        text: 'IC ko fulform k ho ra yesle computer ma kasari kaam garchha?',
        langTag: 'ROMANIZED',
        label: 'Romanized Nepali'
      },
      {
        text: 'State and explain Newton\'s second law of motion with mathematical derivation.',
        langTag: 'EN',
        label: 'English'
      },
      {
        text: 'प्रकाश संश्लेषण (Photosynthesis) प्रक्रियाको रासायनिक समीकरण र चरणहरू व्याख्या गर्नुहोस्।',
        langTag: 'NP',
        label: 'नेपाली (Devanagari)'
      },
      {
        text: 'Mitochondria lai power house of the cell kina bhanchhan?',
        langTag: 'ROMANIZED',
        label: 'Romanized Nepali'
      }
    ]
  },
  {
    id: 'Management',
    name: 'Management',
    iconName: 'TrendingUp',
    tagline: 'Accountancy, Economics, Finance & Business',
    prompts: [
      {
        text: 'Double-entry bookkeeping system ko golden rules k k hun?',
        langTag: 'ROMANIZED',
        label: 'Romanized Nepali'
      },
      {
        text: 'Explain the fundamental differences between GDP and GNP with clear examples.',
        langTag: 'EN',
        label: 'English'
      },
      {
        text: 'नगद प्रवाह विवरण (Cash Flow Statement) का तीन प्रमुख गतिविधिहरू के के हुन्?',
        langTag: 'NP',
        label: 'नेपाली (Devanagari)'
      },
      {
        text: 'Working capital ra fixed capital ma k farak chha?',
        langTag: 'ROMANIZED',
        label: 'Romanized Nepali'
      }
    ]
  },
  {
    id: 'Law',
    name: 'Law',
    iconName: 'Scale',
    tagline: 'Constitutional Law, Jurisprudence & Legal Codes',
    prompts: [
      {
        text: 'Nepal ko sambidhan 2072 ma fundamental rights kati wota chhan?',
        langTag: 'ROMANIZED',
        label: 'Romanized Nepali'
      },
      {
        text: 'Explain the doctrine of Separation of Powers and Judicial Review.',
        langTag: 'EN',
        label: 'English'
      },
      {
        text: 'कानुनको शासन (Rule of Law) भन्नाले के बुझिन्छ? यसका मुख्य सिद्धान्तहरू लेख्नुहोस्।',
        langTag: 'NP',
        label: 'नेपाली (Devanagari)'
      },
      {
        text: 'Civil case ra Criminal case ma main difference k hunchha?',
        langTag: 'ROMANIZED',
        label: 'Romanized Nepali'
      }
    ]
  },
  {
    id: 'Humanities',
    name: 'Humanities',
    iconName: 'BookOpen',
    tagline: 'Literature, Sociology, History & Political Science',
    prompts: [
      {
        text: 'Socrates ko Socratic method k ho ra yo kina important chha?',
        langTag: 'ROMANIZED',
        label: 'Romanized Nepali'
      },
      {
        text: 'Analyze the primary causes and global consequences of the Industrial Revolution.',
        langTag: 'EN',
        label: 'English'
      },
      {
        text: 'नेपाली साहित्यमा आदिकवि भानुभक्त आचार्यको मुख्य योगदान के हो?',
        langTag: 'NP',
        label: 'नेपाली (Devanagari)'
      },
      {
        text: 'Democracy ra Monarchy bich ko core farak k ho?',
        langTag: 'ROMANIZED',
        label: 'Romanized Nepali'
      }
    ]
  }
];
