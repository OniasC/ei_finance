
from typing import Dict
import pandas as pd
from datetime import datetime, timedelta
import matplotlib.pyplot as plt
from typing import Optional

class Account():
    def __init__(self, name: str,
                       type: Optional[str] = None,
                       currency: Optional[str] = None,
                       opening_date: Optional[str] = None,
                       description: Optional[str] = None,
                       initial_balance: float = 0.0):
        self.name = name
        self.initial_balance = initial_balance
        self.type = type
        self.currency = currency
        self.opening_date = pd.to_datetime(opening_date) if opening_date is not None else None
        self.description = description
        self.balance: Dict[str, float] = {}


    def deposit(self, date: str, amount: float):
        self.balance[date] = self.balance.get(date, 0) + amount

    def withdraw(self, date: str, amount: float):
        self.balance[date] = self.balance.get(date, 0) - amount

    def get_balance(self, end_date: str) -> float:
        """Get the balance for a specific date range."""
        if self.opening_date is None:
            return sum(amount for date, amount in self.balance.items()
                       if pd.to_datetime(date) <= pd.to_datetime(end_date))
        end_date_ts = pd.to_datetime(end_date)
        opening_date_ts = self.opening_date
        return sum(amount for date, amount in self.balance.items()
                   if opening_date_ts <= pd.to_datetime(date) <= end_date_ts)
    @staticmethod
    def diff(start_date, end_date):
        start = datetime.strptime(start_date, "%Y-%m-%d")
        end = datetime.strptime(end_date, "%Y-%m-%d")
        delta = (end - start).days
        return [(start + timedelta(days=i)).strftime("%Y-%m-%d") for i in range(delta + 1)]

    def to_dict(self) -> dict:
        """Convert an Account object to a dictionary suitable for DataFrame."""
        return {
            'name': self.name,
            'type': self.type,
            'currency': self.currency,
            'opening_date': self.opening_date,
            'initial_balance': self.initial_balance,
            'description': self.description
        }

    def from_dict(self, dict) -> 'Account':
        """Convert a dictionary to an Account object."""
        return Account(
            name=dict.get('name'),
            type=dict.get('type'),
            currency=dict.get('currency'),
            opening_date=dict.get('opening_date'),
            initial_balance=dict.get('initial_balance'),
            description=dict.get('description')
        )

    def calculate_balance(self, end_date: str, expenses_dict: Dict[str, float]) -> Dict[str, float]:
        """TODO: do not change what was been already calculated. """
        balance_dict = {}
        if self.opening_date is None:
            raise ValueError("opening_date must be set to calculate balance.")
        opening_date_str = self.opening_date.strftime("%Y-%m-%d")
        balance_dict[opening_date_str] = self.initial_balance
        #start_date = datetime.strptime(opening_date_str, "%Y-%m-%d")
        for date in self.diff(opening_date_str, end_date):
            if date == opening_date_str:
                continue
            prev_date = (datetime.strptime(date, "%Y-%m-%d") - timedelta(days=1)).strftime("%Y-%m-%d")
            if date in expenses_dict:
                balance_dict[date] = balance_dict[prev_date] - expenses_dict[date]
            else:
                balance_dict[date] = balance_dict[prev_date]
        self.balance = balance_dict
        return balance_dict

    def plot_balance(self, start_date: str, end_date: str):
        all_dates = self.diff(start_date, end_date)
        dates = [d for d in all_dates if d in self.balance]
        if not dates:
            raise ValueError("No balance data available in the given interval.")
        balances = [self.balance[d] for d in dates]

        plt.figure(figsize=(10, 5))
        plt.plot(dates, balances, marker='o')
        plt.title('Balance Over Time')
        plt.xlabel('Date')
        plt.ylabel('Balance')
        plt.xticks(rotation=45)
        plt.grid()
        plt.tight_layout()
        plt.show()
