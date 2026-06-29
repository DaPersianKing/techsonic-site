export function cn(...classes: Array<string | undefined | false | null>) {
  return classes.filter(Boolean).join(' ');
}

const scrollOffset = -100; // Adjust this value as needed

export function scrollToHash(hash: string) {
  const element = document.querySelector(hash);
  if (element) {
    const y = element.getBoundingClientRect().top + window.scrollY + scrollOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
}
