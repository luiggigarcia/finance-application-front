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

const storage = {
    get() {
        return JSON.parse(localStorage.getItem("transactions")) || [];
    },
    set(transaction) {
        localStorage.setItem("transactions", JSON.stringify(transaction));
    }
};

const transaction = {
    data: storage.get(),
    add(transaction) {
        this.data.push(transaction);
        app.restart();
    },
    remove(index) {
        this.data.splice(index, 1);
        app.restart();
    },
    income() {
        let totalOfIncome = 0;
        const transactions = this.data;

        for (const transaction of transactions) {
            if (Math.sign(Number(transaction.amount)) === 1) {
                totalOfIncome += transaction.amount;
            }
        }
        return totalOfIncome;
    },
    expense() {
        let totalOfExpense = 0;
        const transactions = this.data;

        for (const transaction of transactions) {
            if (Math.sign(Number(transaction.amount)) === -1) {
                totalOfExpense += transaction.amount;
            }
        }
        return totalOfExpense;
    },
    total() {
        return this.income() + this.expense();
    }
};

const htmlHandler = {
    pushTransaction(transaction, index) {
        const tbody = document.querySelector("#data-table tbody");
        const tr = document.createElement("tr");
        tr.innerHTML = htmlHandler.createHtmlTransaction(transaction, index);
        tr.dataset.index = index;
        tbody.appendChild(tr);
    },
    createHtmlTransaction(transaction, index) {
        const classCss = Math.sign(Number(transaction.amount)) === -1 ? "expense" : "earning";
        const currency = formatCurrency(transaction.amount);
        const html = 
        `<td class="description">${transaction.description}</td>
        <td class="${classCss}">${currency}</td>
        <td class="date">${transaction.date}</td>
        <td><img onclick="transaction.remove(${index})" src="./assets/images/minus.svg" alt="Remove transaction"></td>`;
        return html;
    },
    updateBalance() {
        document.getElementById("incomes-balance").innerHTML = formatCurrency(transaction.income());
        document.getElementById("expenses-balance").innerHTML = formatCurrency(transaction.expense());
        document.getElementById("total-balance").innerHTML = formatCurrency(transaction.total());
    },
    clearTransactions() {
        document.querySelector("#data-table tbody").innerHTML = "";
    }
};

const formatCurrency = value => {
    const signal = Math.sign(Number(value)) === -1 ? "-" : "";
    value = Number(String(value).replace(/\D/g, "")) / 100;

    const currency = value.toLocaleString("en-US", {
        style: "currency",
        currency: "USD"
    });
    return `${signal}${currency}`;
}

const formatAmount = value => {
    return Math.round(value * 100);
};

const formatDate = date => {
    date = date.split("-").reverse().join("/");
    return date;
};

const form = {
    fields: {
        description: document.getElementById("description"),
        amount: document.getElementById("amount"),
        date: document.getElementById("date")
    },
    fieldValues() {
        return {
            description: this.fields.description.value,
            amount: this.fields.amount.value,
            date: this.fields.date.value
        }
    },
    validateFields({ description, amount, date }) {
        if (!description || !amount || !date) throw new Error("Please fill in all fields");
        return {
            description,
            amount,
            date
        }
    },
    formatFields({description, amount, date}) {
        amount = formatAmount(amount);
        date = formatDate(date);
        return {
            description,
            amount,
            date
        }
    },
    submit() {
        document.getElementById("transaction-form").addEventListener('submit', event => {
            event.preventDefault();

            try {
                const values = this.fieldValues();
                const validatedFields = this.validateFields(values);
                const formatedFields = this.formatFields(validatedFields);
                transaction.add(formatedFields);
                event.target.reset();
                modal.toggle;

            } catch (error) {
                const inputs = document.querySelectorAll("input");
                inputs.forEach(input => input.classList.add("fill-in"));
            }
        });
    }
}.submit();

const app = {
    start() {
        transaction.data.forEach(htmlHandler.pushTransaction);
        htmlHandler.updateBalance();

        storage.set(transaction.data);
    },
    restart() {
        htmlHandler.clearTransactions();
        this.start();
    }
};

app.start();