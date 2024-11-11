from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
import argparse

load_dotenv()

parser = argparse.ArgumentParser()
parser.add_argument('--task', default='return a list of numbers')
parser.add_argument('--language', default='python')
args = parser.parse_args()

llm = ChatOpenAI()
code_prompt = ChatPromptTemplate.from_messages([
    ('user',
     'Write a code snippet in {language} that will {task}')
])

code_chain = (code_prompt | llm)

result = code_chain.invoke(
    {'language': args.language, 'task': args.task})

print(result.content)
