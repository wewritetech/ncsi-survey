
const menu_button = document.querySelector('.mobile-menu-button');
const sidebar = document.querySelector('.sidebar');

menu_button.addEventListener('click', ()=>{
    sidebar.classList.toggle('-translate-x-full');
});