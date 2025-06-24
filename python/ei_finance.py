from typing import Dict, List#, Dict
#from collections import defaultdict
#import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
from spellchecker import SpellChecker
from typing import Optional

from account import Account  # Assuming Account class is defined in account.py
from transaction import Transaction  # Assuming Transaction class is defined in transaction.py
#from typing import Dict, List

class EiFinance:
    def __init__(self, filenameExpenses: str, filenameAccounts: str):
        self.filenameExpenses = filenameExpenses
        self.filenameAccounts = filenameAccounts
        self.expenses: List[Transaction] = []
        self.accounts: List[Account] = []
        self.load_expenses()
        self.load_accounts()
        self.tags = []
        self.spell = SpellChecker()
        self.get_tags()
        self.current_day = pd.Timestamp.now().normalize()  # Get the current date without time
        self.expenses_per_bank: Dict[Account, Dict[str, float]] = {}

    def load_expenses(self):
        """Load expenses from a CSV file into the expenses list."""
        try:
            df = pd.read_csv(self.filenameExpenses)
            for _, row in df.iterrows():
                expense = Transaction(
                    name=row['name'],
                    date=row['date'],
                    currency=row['currency'],
                    amount=row['amount'],
                    account=row['account'],
                    description=row['description'],
                    category=row['category'],
                    tags=row['tags'].split(',') if isinstance(row['tags'], str) else [],
                    recurring=row['recurring'],
                    frequency=row['frequency'],
                    inout=row['inout'],
                    id=row['id']
                )
                self.expenses.append(expense)
        except FileNotFoundError:
            print(f"File {self.filenameExpenses} not found. Starting with an empty expense list.")

    def load_accounts(self):
        """Load accounts from a CSV file into the accounts list."""
        try:
            df = pd.read_csv(self.filenameAccounts)
            for _, row in df.iterrows():
                account = Account(
                    name=row['name'],
                    type=row.get('type', "") if row.get('type') is not None else "",
                    currency=row.get('currency', ""),
                    opening_date=row.get('opening_date', ""),
                    description=row.get('description', ""), # Default to empty string if not provided
                    initial_balance=row.get('initial_balance', 0.0)  # Default to 0.0 if not provided
                )
                self.accounts.append(account)
        except FileNotFoundError:
            print(f"File {self.filenameAccounts} not found. Starting with an empty account list.")

    def get_tags(self):
        """Get a list of unique tags from the expenses."""
        tags = set()
        for expense in self.expenses:
            for tag in expense.tags:
                if tag:
                    strip_tag = tag.strip()
                    misspelled = self.spell.unknown([strip_tag])
                    if misspelled:
                        for word in misspelled:
                            correction = self.spell.correction(word)
                            print(f"'{word}' might be a typo. Did you mean '{correction}'?")
                            tags.add(correction)

                            # Replace the misspelled tag in the expense's tags
                            expense.tags = [t if t != word else correction for t in expense.tags]
                    else:
                        tags.add(strip_tag)
        # Convert set to list and return
        tags = sorted(tags)
        self.tags = list(tags)

    def get_incomplete_expenses(self, field: Optional[str] = None) -> List[Transaction]:
        """Get a list of expenses that are missing required fields."""
        incomplete_expenses = []
        if field not in ['name', 'date', 'currency', 'amount', 'account', 'description', 'category', 'tags', 'recurring', 'frequency', 'inout']:
            raise ValueError(f"Invalid field: {field}")

        for expense in self.expenses:
            value = expense.to_dict().get(field)
            if value is None or (isinstance(value, float) and pd.isna(value)) or value == '' or value == []:
                incomplete_expenses.append(expense)
        return incomplete_expenses

    def get_expenses_per_bank(self):
        """Get a dictionary of expenses grouped by bank account."""
        expenses_per_bank = {}
        for expense in self.expenses:
            if expense.account not in expenses_per_bank:
                expenses_per_bank[expense.account] = {}
            expenses_per_bank[expense.account][expense.date] = expense.amount
        
        self.expenses_per_bank = expenses_per_bank

    def plot_accounts(self, currency: str = 'USD'):
        """Plot the balance of each account."""
        account_names = [account.name for account in self.accounts if getattr(account, 'currency', None) == currency]
        filtered_accounts = [account for account in self.accounts if getattr(account, 'currency', None) == currency]
        balances = [account.get_balance(str(self.current_day.date())) for account in filtered_accounts]
        balances = [account.get_balance(str(self.current_day.date())) for account in self.accounts]

        plt.figure(figsize=(10, 6))
        plt.bar(account_names, balances, color='skyblue')
        plt.xlabel('Accounts')
        plt.ylabel('Balance')
        plt.title('Account Balances')
        plt.xticks(rotation=45)
        plt.tight_layout()
        plt.show()

    def update_accounts(self):
        for account in self.accounts:
            print(account.name)
            start_date = account.opening_date
            print(self.current_day)
            # Ensure start_date is a valid Timestamp
            if start_date is None or pd.isna(start_date) or start_date == '':
                print(f"Warning: Account '{account.name}' has no valid opening_date. Skipping update.")
                continue
            if not isinstance(start_date, pd.Timestamp):
                try:
                    start_date = pd.to_datetime(start_date)
                except Exception as e:
                    print(f"Error parsing opening_date for account '{account.name}': {e}")
                    continue
            date_diff = self.current_day - start_date
            for date in pd.date_range(start=start_date, end=self.current_day, freq='D'):
                if date_diff.days > 0:
                    account.balance[str(date.date())] = account.get_balance(str(date.date()))
                else:
                    # If the opening date is today or in the future, just set the balance to initial balance
                    account.balance[str(date.date())] = account.initial_balance
