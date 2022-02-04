const modal = {
    elements: {
        modal: document.querySelector(".modal-overlay"),
        openBtn: document.querySelector(".button.new"), 
        closeBtn: document.querySelector(".button.cancel")
    },
    get toggle() {
        this.elements.modal.classList.toggle("active");
    }
};

modal.elements.openBtn.addEventListener('click', () => modal.toggle);
modal.elements.closeBtn.addEventListener('click', () => modal.toggle);

