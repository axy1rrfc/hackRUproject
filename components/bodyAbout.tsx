'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const subjects = [
  {
    id: 'allergy-stats',
    title: 'Allergy Statistics',
    content: 'Food allergies affect 32 million Americans, including 1 in 13 children. The most common allergens are milk, eggs, peanuts, tree nuts, soy, wheat, fish, shellfish, and sesame. 40% of children with food allergies have had severe reactions, with peanuts, tree nuts, milk, and eggs being the most common triggers of anaphylaxis. While some allergies, like milk and eggs, may be outgrown, peanut, tree nut, fish, and shellfish allergies are often lifelong. Food allergies are increasing globally, with varying prevalence based on region',
    imgSrc: '/allergyStat.webp',
  },
  {
    id: 'fatalities',
    title: 'Allergy-Related Fatalities',
    content: 'Allergy-related fatalities, though rare, are a serious concern, with approximately 200 deaths occurring annually in the U.S. due to food allergies. The most common triggers of fatal anaphylaxis include peanuts, tree nuts, shellfish, and dairy. Delayed use of epinephrine and lack of immediate medical attention significantly increase the risk of death. Individuals with severe allergies should always carry an epinephrine auto-injector and have an emergency action plan in place. Public awareness, proper labeling of allergens, and prompt medical intervention are crucial in preventing fatal reactions.',
    imgSrc: '/foodDeath.webp',
  },
  {
    id: 'causes',
    title: 'Why Allergies Occur',
    content: 'Allergies occur when the immune system mistakenly identifies a harmless substance, such as pollen, food proteins, or pet dander, as a threat. In response, the body produces antibodies like Immunoglobulin E (IgE), triggering the release of histamines and other chemicals. This reaction leads to allergy symptoms, which can range from mild irritation, such as sneezing or itching, to severe responses like anaphylaxis. The exact cause of allergies is not fully understood, but genetics and environmental factors play a significant role in their development.',
    imgSrc: '/whyAllergy.webp',
  },
  {
    id: 'prevention',
    title: 'Allergy Prevention',
    content: 'Allergy prevention strategies include introducing allergenic foods like peanuts, eggs, and dairy to infants early, as research suggests this may help build tolerance. Avoiding known allergens, especially for individuals with a family history of allergies, can also reduce risks.  While not all allergies can be avoided, early intervention and careful management can significantly reduce their impact.',
    imgSrc: '/preventionOfAllergies.webp',
  },
];

export default function About() {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  return (
    <div className="relative w-full min-h-screen bg-custom flex flex-col items-center justify-center p-6 bg-fixed">
    <div className="absolute z-0 inset-0 bg-green-900 opacity-75"></div>
    <div className="relative z-10 flex flex-col items-center justify-center">
    <div className="flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl text-green-700 font-extrabold mb-6 bg-yellow-500 px-1.5 py-2 rounded">About Allergies</h1>
      <div className="flex space-x-4">
        {subjects.map((subject) => (
          <button
            key={subject.id}
            onClick={() => setSelectedSubject(subject.id)}
            className="px-6 py-3 bg-yellow-500 text-green-700 font-semibold rounded-lg transition-transform duration-300 hover:scale-105"
          >
            {subject.title}
          </button>
        ))}
      </div>
      

      {selectedSubject && (
        <motion.div
        {...{ className: "mt-6 p-6  rounded-lg bg-yellow-500 w-full max-w-lg text-center" }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
      
          <h2 className="text-2xl text-green-700 font-extrabold mb-2">
            {subjects.find((s) => s.id === selectedSubject)?.title}
          </h2>
          <p className="text-green-700 font-semibold">
            {subjects.find((s) => s.id === selectedSubject)?.content}
          </p>
          <Image
            src={subjects.find((s) => s.id === selectedSubject)?.imgSrc || ''}
            alt="Allergy Info"
            width={400}
            height={250}
            className="mt-4 rounded-lg shadow-md mx-auto border-4 border-green-700"
          />
          
        </motion.div>
        
      )}
        <p className="mt-4 text-sm text-green-700 max-w-lg text-center font-extrabold bg-yellow-500 rounded">
        Sources: <a href="https://www.foodallergy.org/resources/facts-and-statistics" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
          Food Allergy Research & Education (FARE)
        </a>. Data derived from various studies on food allergies in the U.S.
      </p>
    </div>
  </div>
  </div>
  );
  
}


