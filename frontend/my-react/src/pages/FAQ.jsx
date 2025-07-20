import React from "react";

export default function FAQ() {
  const faqs = [
    {
      question: "What type of fitness content do you provide?",
      answer:
        "We provide articles on gym workouts, diet plans, mental wellness, yoga, weight management, and general lifestyle improvements."
    },
    {
      question: "Is this platform suitable for beginners?",
      answer:
        "Absolutely! Whether you’re a beginner or an experienced fitness enthusiast, our content is designed for all levels."
    },
    {
      question: "Are the diet plans reviewed by experts?",
      answer:
        "Yes, our diet plans and nutrition content are researched from credible sources and reviewed for accuracy before publishing."
    },
    {
      question: "Do I need gym equipment for the workouts?",
      answer:
        "Not always. We offer both home-based workouts and gym-based routines to suit everyone’s access and preferences."
    },
    {
      question: "How often is new content posted?",
      answer:
        "We aim to post fresh content weekly so you always have new tips and routines to stay motivated."
    }
  ];

  return (
    <section className="py-12 px-6 md:px-20 text-gray-800">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
        Frequently Asked Questions
      </h1>

      <div className="max-w-5xl mx-auto space-y-6">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-[#fff2eb] p-5 rounded-xl shadow-[0_0_10px_4px_rgba(59,130,246,0.3)]"
          >
            <h2 className="text-xl font-semibold mb-2">{faq.question}</h2>
            <p className="text-base md:text-lg text-gray-700">{faq.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
