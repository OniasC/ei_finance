import numpy as np
import pandas as pd

def test_numpy():
    # Create a 1D numpy array
    arr = np.array([1, 2, 3, 4, 5])
    assert arr.shape == (5,)

    # Perform basic operations
    arr_sum = np.sum(arr)
    assert arr_sum == 15

    arr_mean = np.mean(arr)
    assert arr_mean == 3.0
def test_pandas():
    # Create a simple DataFrame
    data = {
        'A': [1, 2, 3],
        'B': [4, 5, 6]
    }
    df = pd.DataFrame(data)

    # Check the shape of the DataFrame
    assert df.shape == (3, 2)

    # Perform basic operations
    df_sum = df.sum()
    assert df_sum['A'] == 6
    assert df_sum['B'] == 15

    df_mean = df.mean()
    assert df_mean['A'] == 2.0
    assert df_mean['B'] == 5.0
def run_tests():
    test_numpy()
    test_pandas()
    print("All tests passed!")

if __name__ == "__main__":
    run_tests()
    df = pd.read_csv("test.csv")  # Read the CSV file into a DataFrame
    print(df.head())  # Display the first few rows of the DataFrame
    print("Tests executed successfully.")