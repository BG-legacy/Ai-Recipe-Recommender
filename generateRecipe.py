import json
import sys
import csv  # Import csv module for reading CSV files
import random  # Import random module for selecting random recipes
import os  # Import os module for working with file paths
import pandas as pd  # Import pandas for working with dataframes
from langchain_community.chat_models import ChatOllama
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate

# Initialize the ChatOllama model
# Resource: https://python.langchain.com/docs/integrations/chat/ollama
llm = ChatOllama(model='llama3.1')

# Load the CSV file containing recipe data using pandas
current_directory = os.path.dirname(os.path.abspath(__file__))
file_path = os.path.join(current_directory, 'Food Ingredients and Recipe Dataset with Image Name Mapping.csv')
if not os.path.exists(file_path):
    print(f"File not found: {file_path}. Please make sure the file is in the correct directory.")
    recipes_df = None
else:
    # Read the CSV file into a pandas DataFrame
    # Resource: https://pandas.pydata.org/docs/reference/api/pandas.read_csv.html
    recipes_df = pd.read_csv(file_path)

# Define prompt templates for recipe recommendation and details
# Resource: https://python.langchain.com/docs/modules/model_io/prompts/prompt_templates/
recipe_prompt = ChatPromptTemplate.from_template(
    "Based on the user's preference for {preference}, recommend a recipe from the following options:\n\n{recipe_titles}\n\nOnly provide the name and a brief description of the recipe."
)

details_prompt = ChatPromptTemplate.from_template(
    "Provide the ingredients and instructions for the {recipe_name} recipe."
)

# Create chains for recipe recommendation and details
# Resource: https://python.langchain.com/docs/modules/chains/
recipe_chain = recipe_prompt | llm | StrOutputParser()
details_chain = details_prompt | llm | StrOutputParser()

def get_most_relevant_recipe(preference):
    if recipes_df is None:
        return "Recipe dataset not loaded.", None, None, None

    # Filter the recipes based on user preference
    # Resource: https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.apply.html
    relevant_recipes = recipes_df[recipes_df.apply(lambda row: preference.lower() in str(row['Ingredients']).lower() or preference.lower() in str(row['Title']).lower(), axis=1)]
    
    if relevant_recipes.empty:
        return "No relevant recipes found.", None, None, None

    # Get a random relevant recipe
    # Resource: https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.sample.html
    recommended_recipe = relevant_recipes.sample(n=1).iloc[0]
    
    # Convert the filtered recipe to a string format for input to the prompt
    recipe_str = f"{recommended_recipe['Title']}: {recommended_recipe['Ingredients']}"
    
    # Invoke the chain to get a recommendation based on the preference and recipe data
    result = recipe_chain.invoke({
        'preference': preference,
        'recipe_titles': recipe_str
    })
    
    # Generate details for the recommended recipe
    details = details_chain.invoke({'recipe_name': recommended_recipe['Title']})
    
    # Get the image file name
    image_file_name = recommended_recipe['Image_Name']
    
    return result, recommended_recipe['Title'], details, image_file_name

def main():
    # Read input data from stdin
    # Resource: https://docs.python.org/3/library/json.html#json.loads
    input_data = json.loads(sys.stdin.read())
    preference = input_data.get('preference', '')
    get_details = input_data.get('get_details', False)
    recipe_name = input_data.get('recipe_name', '')
    
    if get_details:
        # If get_details is True, generate details for the specified recipe
        details = details_chain.invoke({'recipe_name': recipe_name})
        output = {'details': details}
    else:
        # Get a random relevant recipe based on the user's preference
        recommendation, recipe_name, details, image_file_name = get_most_relevant_recipe(preference)
        output = {
            'recommendation': recommendation,
            'recipe_name': recipe_name,
            'details': details,
            'image_file_name': image_file_name
        }
    
    # Print the output as JSON
    # Resource: https://docs.python.org/3/library/json.html#json.dumps
    print(json.dumps(output))

if __name__ == "__main__":
    main()
