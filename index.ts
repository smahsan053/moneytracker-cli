#! /usr/bin/env node
import inquirer from "inquirer";
import chalk from "chalk";

// Define the ATM protocol interface
interface atmProtocol {
    accountBalance: number;
    fastCash(): Promise<number | string>;
    withdrawAmount(): Promise<number | string>;
    displayBalance(): void;
    depositAmount(): Promise<number | string>;
    fundsTransfer(): Promise<number | string>;
}

// Define the ATM class implementing the ATM protocol
class ATM implements atmProtocol {
    private initialBalance: number = 1000;
    accountBalance: number;

    constructor(accountBalance?: number) {
        this.accountBalance = accountBalance ?? this.initialBalance;
    }

    // Method for fast cash withdrawal
    async fastCash(): Promise<number | string> {
        const cashVal = await inquirer.prompt<{ value: number }>([
            {
                message: chalk.yellow("Please select amount"),
                type: "list",
                name: "value",
                choices: [1000, 2000, 5000, 10000, 15000, 20000]
            },
        ]);
        const diff = this.accountBalance - cashVal.value;
        if (diff <= this.initialBalance) {
            console.log(chalk.red("Insufficient Funds"));
            return "Insufficient Funds";
        } else {
            console.log(chalk.green(`Dear customer RS: ${cashVal.value} have been withdrawn from your account & your remaining balance is ${this.accountBalance - cashVal.value}`));
            return `Dear customer RS: ${cashVal.value} have been withdrawn from your account & your remaining balance is ${this.accountBalance - cashVal.value}`;
        }
    }

    // Method for cash withdrawal
    async withdrawAmount(): Promise<number | string> {
        const cashVal = await inquirer.prompt<{ value: number }>([
            {
                message: chalk.yellow("Enter amount to withdraw"),
                type: "number",
                name: "value",
            },
        ]);
        if (isNaN(cashVal.value)) {
            console.log(chalk.red("Invalid Amount"));
            return "Invalid Amount";
        } else {
            const diff = this.accountBalance - cashVal.value;
            if (diff <= this.initialBalance) {
                console.log(chalk.red("Insufficient Funds"));
                return "Insufficient Funds";
            } else {
                console.log(chalk.green(`Dear customer RS: ${cashVal.value} have been withdrawn from your account & your remaining balance is ${this.accountBalance - cashVal.value}`));
                return `Dear customer RS: ${cashVal.value} have been withdrawn from your account & your remaining balance is ${this.accountBalance - cashVal.value}`;
            }
        }
    }

    // Method to display account balance
    displayBalance(): void {
        console.log(chalk.yellow(`Your account balance is ${this.accountBalance}`));
    }

    // Method for depositing amount
    async depositAmount(): Promise<number | string> {
        const amount = await inquirer.prompt<{ value: number }>([
            {
                message: chalk.yellow("Please enter amount to deposit"),
                type: "number",
                name: "value",
            },
        ]);
        if (isNaN(amount.value)) {
            console.log(chalk.red("Invalid Amount"));
            return "Invalid Amount";
        } else {
            this.accountBalance += amount.value;
            console.log(chalk.green(`Dear customer RS: ${amount.value} has been deposited to your account & your balance is now ${this.accountBalance}`));
            return `Dear customer RS: ${amount.value} has been deposited to your account & your balance is now ${this.accountBalance}`;
        }
    }

    // Method for funds transfer
    async fundsTransfer(): Promise<number | string> {
        const account = await inquirer.prompt<{ accountNumber: number }>([
            {
                message: chalk.yellow("Enter account number to transfer funds"),
                type: "number",
                name: "accountNumber",
            },
        ]);
        if (
            account.accountNumber.toString().length < 14 ||
            account.accountNumber.toString().length >= 15 ||
            isNaN(account.accountNumber)
        ) {
            console.log(chalk.red("Invalid Account Number"));
            return "Invalid Account Number";
        } else {
            const amount = await inquirer.prompt<{ transferAmount: number }>([
                {
                    message: chalk.yellow("Enter amount to transfer"),
                    type: "number",
                    name: "transferAmount",
                },
            ]);
            if (isNaN(amount.transferAmount)) {
                console.log(chalk.red("Invalid Amount"));
                return "Invalid Amount";
            } else {
                const diff = this.accountBalance - amount.transferAmount;
                if (diff <= this.initialBalance) {
                    console.log(chalk.red("Insufficient Funds"));
                    return "Insufficient Funds";
                } else {
                    console.log(chalk.green(`${amount.transferAmount} PKR has been transferred to account number ${account.accountNumber}. Your remaining account balance is ${this.accountBalance - amount.transferAmount}`));
                    return `${amount.transferAmount} PKR has been transferred to account number ${account.accountNumber}. Your remaining account balance is ${this.accountBalance - amount.transferAmount}`;
                }
            }
        }
    }
}

// Prompt for PIN verification
let cardPin = await inquirer.prompt<{ pin: number }>([
    {
        message: chalk.yellow("Please enter your 4-digit PIN"),
        type: "number",
        name: "pin",
    },
]);

// Validate PIN
while (
    cardPin.pin === null ||
    isNaN(cardPin.pin) ||
    cardPin.pin.toString().length !== 4 ||
    cardPin.pin !== 9579
) {
    console.log(chalk.red("Invalid PIN!"));

    cardPin = await inquirer.prompt<{ pin: number }>([
        {
            message: chalk.yellow("Please enter your 4-digit PIN"),
            type: "number",
            name: "pin",
        },
    ]);
}

// Prompt for banking options
const atmFunction = await inquirer.prompt<{ options: string }>([
    {
        message: chalk.yellow("Please select an option:"),
        type: "list",
        name: "options",
        choices: [
            "Fast Cash",
            "Cash Withdrawal",
            "Balance Inquiry",
            "Deposit Amount",
            "Funds Transfer",
            "Exit",
        ]
    },
]);

// Function to initialize ATM operations based on user selection
function initApp(atm: ATM) {
    switch (atmFunction.options) {
        case "Fast Cash":
            atm.fastCash();
            break;
        case "Cash Withdrawal":
            atm.withdrawAmount();
            break;
        case "Balance Inquiry":
            atm.displayBalance();
            break;
        case "Deposit Amount":
            atm.depositAmount();
            break;
        case "Funds Transfer":
            atm.fundsTransfer();
            break;
        default:
            console.log(chalk.blue("Exiting..."));
            break;
    }
}

// Initialize ATM object and perform selected operation
let atm = new ATM(100000);
initApp(atm);
