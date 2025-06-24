from my_types import Category
from typing import List, Dict
from typing import Optional, Union, Any

class Transaction:


    def __init__(self, name: Optional[str] = None,
                 date: Optional[str] = None,
                 currency: Optional[str] = None,
                 amount: float = 0.0,
                 account: Optional[str] = None,
                 description: Optional[str] = None,
                 category: Optional[Union[Category, str]] = None,
                 tags: Optional[List[str]] = None,
                 recurring: bool = False,
                 frequency: Optional[str] = None,
                 inout: Optional[str] = None,
                 id: Optional[str] = None):
        self.name = name
        self.date = date
        self.currency = currency
        self.amount = amount
        self.account = account
        self.description = description
        if isinstance(category, str):
            if "Category." in category:
                category = category.replace("Category.", "")
            try:
                self.category = Category[category.upper()]
            except KeyError:
                raise ValueError(f"Invalid category: {category}. Must be one of {list(Category)}.")
        elif isinstance(category, Category):
            self.category = category
        else:
            self.category = None
        self.tags = tags if tags is not None else []
        self.recurring = recurring
        self.frequency = frequency
        self.inout = inout

        if name is None or date is None or amount == 0.0 or inout is None:
            raise ValueError("Name, date, amount, and inout are required fields.")
        if id is not None:
            self.id = id
        else:
            self.id = self.create_id()

    def create_id(self) -> str:
        """Create a unique ID for the expense based on its attributes."""
        return f"{self.name}_{self.date}_{self.amount}_{self.currency}"

    def print(self):
        """Print the expense details."""
        print(f"Name: {self.name}, Date: {self.date}, Currency: {self.currency}, "
              f"Amount: {self.amount}, Bank: {self.account}, Description: {self.description}, "
              f"Category: {self.category}, Tags: {', '.join(self.tags)}, "
              f"Recurring: {self.recurring}, Frequency: {self.frequency}, In/Out: {self.inout}, ID: {self.id}")

    def to_dict(self) -> dict:
        """Convert an Transaction object to a dictionary suitable for DataFrame."""
        return {
            'name': self.name,
            'date': self.date,
            'currency': self.currency,
            'amount': self.amount,
            'account': self.account,
            'description': self.description,
            'category': self.category,
            'tags': ','.join(self.tags) if isinstance(self.tags, list) else self.tags,
            'recurring': self.recurring,
            'frequency': self.frequency,
            'inout': self.inout,
            'id': self.id
        }

    def from_dict(self, dict) -> 'Transaction':
        """Convert a dictionary to an Transaction object."""
        return Transaction(
            name=dict.get('name'),
            date=dict.get('date'),
            currency=dict.get('currency'),
            amount=dict.get('amount'),
            account=dict.get('account'),
            description=dict.get('description'),
            category=dict.get('category'),
            tags=dict.get('tags').split(',') if isinstance(dict.get('tags'), str) else [],
            recurring=dict.get('recurring'),
            frequency=dict.get('frequency'),
            inout=dict.get('inout'),
            id=dict.get('id')
        )

    def __eq__(self, other):
        """Check if two Expense objects are equal based on their attributes."""
        if not isinstance(other, Transaction):
            return False
        return (self.id == other.id)
    def update(self, newValue: Dict[str, Any]):
        """Update the Expense object with new values."""
        prev_values = self.to_dict()
        print(f"Updating Expense ID {self.id} from {prev_values} to {newValue}")
        for key, value in newValue.items():
            if key in prev_values and prev_values[key] != value:
                setattr(self, key, value)