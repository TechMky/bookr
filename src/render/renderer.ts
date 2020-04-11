import './index.css';

const showModal: HTMLElement = document.getElementById('show-modal');
const closeModal: HTMLElement = document.getElementById('close-modal');
const modalWindow: HTMLElement = document.getElementById('modal');
const inputUrl: HTMLElement = document.getElementById('url');

showModal.addEventListener('click', e => {
    modalWindow.style.display = 'flex';
    inputUrl.focus();
});

closeModal.addEventListener('click', e => {
    modalWindow.style.display = 'none';
})