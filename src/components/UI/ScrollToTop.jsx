import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollableEls = document.querySelectorAll('[data-scrollable]');
      let anyScrolled = false;
      scrollableEls.forEach(el => {
        if (el.scrollTop > 300) anyScrolled = true;
      });
      setVisible(anyScrolled);
    };
    const scrollableEls = document.querySelectorAll('[data-scrollable]');
    scrollableEls.forEach(el => el.addEventListener('scroll', handleScroll));
    return () => scrollableEls.forEach(el => el.removeEventListener('scroll', handleScroll));
  }, []);

  const scrollToTop = () => {
    const scrollableEls = document.querySelectorAll('[data-scrollable]');
    scrollableEls.forEach(el => el.scrollTo({ top: 0, behavior: 'smooth' }));
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      title="Scroll to top"
      style={{
        position: "fixed",
        bottom: 32,
        right: 32,
        width: 44,
        height: 44,
        borderRadius: "50%",
        background: "var(--accent)",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 20px rgba(88,101,242,.5)",
        cursor: "pointer",
        zIndex: 999,
        border: "none",
        transition: "transform .2s, opacity .2s",
        animation: "fadeInUp .25s ease",
      }}
      onMouseOver={e => e.currentTarget.style.transform = "translateY(-3px) scale(1.1)"}
      onMouseOut={e => e.currentTarget.style.transform = "translateY(0) scale(1)"}
    >
      <ArrowUp size={20} />
    </button>
  );
}
