export const navigateToSection = (sectionId: string) => {
  // If we're not on the main page, navigate there first
  if (window.location.pathname !== '/') {
    window.location.href = `/#${sectionId}`;
    return;
  }
  
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};