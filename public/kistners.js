var tribars = document.querySelector("nav > div.tribars");
var collapse = document.querySelector("nav .collapse");
var nav = document.querySelector('nav');

tribars.addEventListener('click', toggleNav);
collapse.addEventListener('click', toggleNav);

function toggleNav() {
  nav.classList.toggle('expanded');
}
