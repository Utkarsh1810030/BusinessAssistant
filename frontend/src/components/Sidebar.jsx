import React, { useEffect, useState } from 'react';

const sections = ["overview", "analytics", "assistant"];

const Sidebar = () => {
  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.4 }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <aside className="w-64 h-screen bg-white shadow-lg fixed left-0 top-0 p-6 hidden md:block text-gray-800">
      <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>
      <nav className="flex flex-col gap-4">
        {sections.map((section) => (
          <a
            key={section}
            href={`#${section}`}
            className={`hover:text-blue-600 transition-colors duration-200 ${activeSection === section ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}
          >
            {section.charAt(0).toUpperCase() + section.slice(1)}
          </a>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
