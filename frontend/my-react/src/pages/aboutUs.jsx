import React from "react";

export default function AboutUs() {
  return (
    <section className="py-12 px-6 md:px-20 text-gray-800">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
          About Us</h1>

        <div className="max-w-5xl mx-auto text-center p-5 rounded-xl bg-[#fff2eb] shadow-[0_0_10px_4px_rgba(59,130,246,0.5)]">
        <p className="text-lg md:text-xl leading-relaxed mb-6">
          Welcome to <span className="font-semibold">Choudhary Fitness</span>,
          your trusted space for everything health and fitness. Our mission is
          simple — to help you become healthier, stronger, and more active every day.
        </p>
        <p className="text-lg md:text-xl leading-relaxed mb-6">
          Here you’ll find expert-backed articles on:
        </p>
        <ul className="list-disc list-inside text-left text-base md:text-lg max-w-2xl mx-auto mb-6">
          <li>Gym workout tips and routines</li>
          <li>Diet plans and nutrition guidance</li>
          <li>Weight loss & muscle gain strategies</li>
          <li>Yoga, mental wellness, and motivation</li>
          <li>Daily health care tips to improve your lifestyle</li>
        </ul>
        <p className="text-lg md:text-xl leading-relaxed font-medium">
          Whether you’re a beginner or a fitness enthusiast, our content is for everyone — practical, science-based, and easy to follow.
        </p>
        <p className="text-xl mt-6 font-semibold italic">
          "Fit body, sharp mind, happy life."
        </p>
      </div>
    </section>
  );
}
